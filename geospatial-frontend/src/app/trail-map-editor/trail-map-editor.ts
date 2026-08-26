import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  AfterViewInit,
  Input,
  SimpleChanges,
  ViewChild,
  ElementRef,
  NgZone,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TrailService } from '../services/trail.service';
import { AnnotationService } from '../services/trail-annotation.service';

import maplibregl, { Map, Marker, GeoJSONSource } from 'maplibre-gl';
import { TrailAnnotation } from '../models/trail-annotation.model';

/* =========================================================
   DRAW POINT
   ========================================================= */

interface DrawPoint {
  lng: number;
  lat: number;
  elevation?: number;
  marker: Marker;
}

/* =========================================================
   ANNOTATION TYPES
   ========================================================= */

const ANNOTATION_TYPES = [
  { value: 'warning', label: 'Warning', emoji: '⚠️', color: '#f59e0b' },
  { value: 'water', label: 'Water', emoji: '💧', color: '#3b82f6' },
  { value: 'obstacle', label: 'Obstacle', emoji: '🪨', color: '#78716c' },
  { value: 'weather', label: 'Weather', emoji: '❄️', color: '#67e8f9' },
  { value: 'closed', label: 'Closed', emoji: '🔒', color: '#ef4444' },
  { value: 'viewpoint', label: 'Viewpoint', emoji: '👁️', color: '#8b5cf6' }
];

/* =========================================================
   COMPONENT
   ========================================================= */

@Component({
  selector: 'app-trail-map-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './trail-map-editor.html',
  styleUrls: ['./trail-map-editor.css']
})
export class TrailMapComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  /* ===== View ===== */

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  /* ===== Inputs ===== */

  @Input() gpxUrl?: string;
  @Input() center: [number, number] = [22.9, 40.6];
  @Input() zoom = 12;
  @Input() trackColor = '#f97316';
  @Input() currentUserId?: string;
  @Input() trailId!: number;
  @Input() trailName?: string;

  @Input()
  set searchLocation(location: string) {
    if (!location) {
      return;
    }
    this._searchLocation = location;
    if (this.map) {
      this.flyToLocation(location);
    }
  }

  private _searchLocation?: string;

  /* ===== Services ===== */

  private map!: Map;
  private zone = inject(NgZone);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private trailService = inject(TrailService);
  private annotationService = inject(AnnotationService);

  /** Emits and completes on destroy — every subscription in this component
   *  should be piped through takeUntil(this.destroy$) so in-flight requests
   *  never touch component state after teardown. */
  private destroy$ = new Subject<void>();

  /* ===== Mode ===== */

  mode: 'view' | 'draw' = 'view';

  /* ===== Drawing ===== */

  drawnPoints: DrawPoint[] = [];
  isSaving = false;
  saveSuccess = false;
  errorMessage = '';
  distanceKm = 0;

  /* ===== GPX ===== */

  selectedGpxFile?: File;
  gpxFileName = '';

  /* ===== Loading ===== */

  isLoading = false;

  /* ===== Annotations ===== */

  annotations: TrailAnnotation[] = [];
  annotationTypes = ANNOTATION_TYPES;
  showAddPanel = false;
  pendingLng = 0;
  pendingLat = 0;
  pendingMarker?: Marker;
  newAnnotationType: TrailAnnotation['type'] = 'warning';
  newAnnotationTitle = '';
  newAnnotationDesc = '';

  /* ===== Search ===== */

  searchQuery = '';
  searchResults: { display_name: string; lat: string; lon: string }[] = [];
  showSearchResults = false;

  /* =======================================================
     LIFECYCLE
     ======================================================= */

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.trailId = Number(id);
      this.loadTrailInfo();
    }
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.initMap();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map) {
      return;
    }
    if (changes['gpxUrl'] && this.gpxUrl) {
      this.loadGpxFromUrl();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.map?.remove();
    delete (window as any).__deleteAnnotation;
  }

  /* =======================================================
     MAP INITIALIZATION
     ======================================================= */

  private initMap(): void {
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: this.center,
      zoom: this.zoom,
      attributionControl: { compact: true }
    });

    this.map.addControl(new maplibregl.NavigationControl(), 'bottom-right');
    this.map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');
    this.map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
      }),
      'bottom-right'
    );

    this.map.on('load', () => {
      this.zone.run(() => {
        this.initTrackLayer();
        this.initAnnotationLayer();

        if (this.gpxUrl) {
          this.loadGpxFromUrl();
        } else if (this.trailId) {
          this.loadExistingPoints();
        }

        if (this._searchLocation) {
          this.flyToLocation(this._searchLocation);
        }
      });
    });

    this.map.on('click', (e) => {
      this.zone.run(() => {

        /* DRAW MODE */
        if (this.mode === 'draw') {
          this.addDrawPoint(e.lngLat.lng, e.lngLat.lat);
          return;
        }

        /* VIEW MODE */
        const hit = this.map.queryRenderedFeatures(e.point, { layers: ['annotations-layer'] });

        // If the user clicked an existing annotation, don't open the add-annotation panel.
        if (hit.length > 0) {
          return;
        }

        this.pendingLng = e.lngLat.lng;
        this.pendingLat = e.lngLat.lat;

        this.showAddPanel = true;
        this.newAnnotationTitle = '';
        this.newAnnotationDesc = '';
        this.newAnnotationType = 'warning';

        this.pendingMarker?.remove();
        this.pendingMarker = new Marker({ color: '#f97316' })
          .setLngLat([this.pendingLng, this.pendingLat])
          .addTo(this.map);
      });
    });
  }

  /* =======================================================
     TRACK LAYER
     ======================================================= */

  private initTrackLayer(): void {
    this.map.addSource('track', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    });

    this.map.addLayer({
      id: 'track-shadow',
      type: 'line',
      source: 'track',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#000', 'line-width': 6, 'line-opacity': 0.15 }
    });

    this.map.addLayer({
      id: 'track-line',
      type: 'line',
      source: 'track',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': this.trackColor, 'line-width': 4, 'line-opacity': 0.9 }
    });
  }

  /* =======================================================
     ANNOTATION LAYER
     ======================================================= */

  private initAnnotationLayer(): void {
    this.map.addSource('annotations', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    });

    this.map.addLayer({
      id: 'annotations-layer',
      type: 'circle',
      source: 'annotations',
      paint: {
        'circle-radius': 14,
        'circle-color': ['get', 'color'],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 0.92
      }
    });

    this.map.addLayer({
      id: 'annotations-labels',
      type: 'symbol',
      source: 'annotations',
      layout: { 'text-field': ['get', 'emoji'], 'text-size': 14, 'text-allow-overlap': true }
    });

    this.map.on('click', 'annotations-layer', (e) => {
      if (!e.features?.length) {
        return;
      }

      const feature = e.features[0];
      const props = feature.properties as Record<string, string>;
      const coords = (feature.geometry as any).coordinates;

      const annotation = this.annotations.find(a => a.id === props['id']);
      const canDelete = !this.currentUserId || annotation?.createdBy === this.currentUserId;

      // Escape anything that originated as free-text user input before it goes
      // into innerHTML — titles/descriptions are user-supplied and would
      // otherwise be an XSS vector via the popup.
      const safeEmoji = props['emoji'];
      const safeTitle = this.escapeHtml(props['title']);
      const safeDescription = props['description'] ? this.escapeHtml(props['description']) : '';
      const safeTypeLabel = this.escapeHtml(props['typeLabel']);

      new maplibregl.Popup({ offset: 20 })
        .setLngLat(coords)
        .setHTML(`
          <div style="font-family:sans-serif;min-width:180px;">
            <div style="font-size:28px;text-align:center;margin-bottom:8px;">${safeEmoji}</div>
            <div style="font-weight:600;font-size:15px;margin-bottom:5px;">${safeTitle}</div>
            ${safeDescription
              ? `<div style="font-size:12px;color:#666;margin-bottom:8px;">${safeDescription}</div>`
              : ''}
            <div style="font-size:11px;color:#999;margin-bottom:10px;">${safeTypeLabel}</div>
            ${canDelete
              ? `<button
                   onclick="window.__deleteAnnotation('${props['id']}')"
                   style="width:100%;padding:7px;background:#fee2e2;border:none;border-radius:6px;color:#dc2626;font-size:12px;cursor:pointer;font-weight:500;">
                   Delete
                 </button>`
              : ''}
          </div>
        `)
        .addTo(this.map);
    });

    this.map.on('mouseenter', 'annotations-layer', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });

    this.map.on('mouseleave', 'annotations-layer', () => {
      this.map.getCanvas().style.cursor = '';
    });

    (window as any).__deleteAnnotation = (id: string) => {
      this.zone.run(() => {
        this.removeAnnotation(id);
      });
    };
  }

  /** Escapes text for safe insertion into innerHTML-built markup. */
  private escapeHtml(value: string): string {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
  }

  /* =======================================================
     LOAD TRAIL INFO
     ======================================================= */

  private loadTrailInfo(): void {
    this.trailService.getTrail(this.trailId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (trail) => {
          this.trailName = trail.trailName || trail.name || this.trailName || '';
        }
      });
  }

  /* =======================================================
     LOAD EXISTING ROUTE
     ======================================================= */

  private loadExistingPoints(): void {
    this.isLoading = true;

    this.trailService.getTrailPoints(this.trailId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (points) => {
          this.isLoading = false;
          if (points.length > 0) {
            const coords: [number, number][] = points.map(p => [p.lng, p.lat]);
            this.displayTrack(coords, 60);
          }
        },
        error: () => {
          this.isLoading = false;
        }
      });

    this.loadAnnotations();
  }

  /** Fetches this trail's annotations from the backend so every viewer sees
   *  the same set, instead of each browser only holding its own local copy. */
  private loadAnnotations(): void {
    this.annotationService.getAnnotations(this.trailId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (annotations) => {
          this.annotations = annotations;
          this.refreshAnnotationSource();
        },
        error: () => {
          this.errorMessage = 'Could not load points of interest.';
        }
      });
  }

  /* =======================================================
     DRAWING
     ======================================================= */

  startDrawing(): void {
    this.mode = 'draw';
    this.cancelAddAnnotation();
    this.map.getCanvas().style.cursor = 'crosshair';
    this.clearDrawnPoints();
  }

  stopDrawing(): void {
    this.mode = 'view';
    this.map.getCanvas().style.cursor = '';
  }

  private addDrawPoint(lng: number, lat: number): void {
    const index = this.drawnPoints.length;

    const el = document.createElement('div');
    el.className = 'draw-point-marker';
    el.innerHTML = `<span>${index + 1}</span>`;
    el.style.cssText = `
      width:24px; height:24px; border-radius:50%;
      background:#f97316; border:2px solid white;
      display:flex; align-items:center; justify-content:center;
      font-size:10px; color:white; font-weight:bold;
      box-shadow:0 2px 6px rgba(0,0,0,.3);
      cursor:pointer;
    `;

    el.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.zone.run(() => {
        this.removeDrawPoint(index);
      });
    });

    const marker = new Marker({ element: el, draggable: true })
      .setLngLat([lng, lat])
      .addTo(this.map);

    marker.on('dragend', () => {
      this.zone.run(() => {
        const lngLat = marker.getLngLat();
        const point = this.drawnPoints.find(p => p.marker === marker);
        if (point) {
          point.lng = lngLat.lng;
          point.lat = lngLat.lat;
          this.refreshTrackLine();
        }
      });
    });

    this.drawnPoints.push({ lng, lat, marker });
    this.refreshTrackLine();
  }

  removeDrawPoint(index: number): void {
    const point = this.drawnPoints[index];
    if (!point) {
      return;
    }
    point.marker.remove();
    this.drawnPoints.splice(index, 1);
    this.refreshTrackLine();
  }

  undoLastPoint(): void {
    if (this.drawnPoints.length === 0) {
      return;
    }
    const last = this.drawnPoints.pop()!;
    last.marker.remove();
    this.refreshTrackLine();
  }

  clearDrawnPoints(): void {
    this.drawnPoints.forEach(p => p.marker.remove());
    this.drawnPoints = [];
    this.refreshTrackLine();
  }

  private refreshTrackLine(): void {
    const coords: [number, number][] = this.drawnPoints.map(p => [p.lng, p.lat]);
    this.updateTrackLine(coords);
    this.calculateDistance(coords);
  }

  /* =======================================================
     GPX
     ======================================================= */

  onGpxSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedGpxFile = input.files[0];
      this.gpxFileName = input.files[0].name;
      this.previewGpx(input.files[0]);
    }
  }

  private previewGpx(file: File): void {
    const reader = new FileReader();

    reader.onload = (e) => {
      this.zone.run(() => {
        try {
          const coords = this.parseGpx(e.target?.result as string);
          if (coords.length) {
            this.clearDrawnPoints();
            this.stopDrawing();
            this.displayTrack(coords, 60);
          } else {
            this.errorMessage = 'No valid track points found in this GPX file.';
          }
        } catch {
          this.errorMessage = 'Invalid GPX file.';
        }
      });
    };

    reader.readAsText(file);
  }

  private loadGpxFromUrl(): void {
    if (!this.gpxUrl) {
      return;
    }

    this.isLoading = true;

    this.http.get(this.gpxUrl, { responseType: 'text' })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (gpxText) => {
          const coords = this.parseGpx(gpxText);
          this.zone.run(() => {
            this.isLoading = false;
            if (coords.length) {
              this.displayTrack(coords, 40);
            }
          });
        },
        error: () => {
          this.zone.run(() => {
            this.isLoading = false;
          });
        }
      });
  }

  /** Parses trkpt/rtept elements, silently dropping any point with a
   *  missing or non-numeric lat/lon rather than pushing NaN into the map. */
  private parseGpx(gpxText: string): [number, number][] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(gpxText, 'application/xml');
    const points = Array.from(doc.querySelectorAll('trkpt,rtept'));

    return points
      .map((p): [number, number] => [
        parseFloat(p.getAttribute('lon') ?? ''),
        parseFloat(p.getAttribute('lat') ?? '')
      ])
      .filter(([lon, lat]) => Number.isFinite(lon) && Number.isFinite(lat));
  }

  /* =======================================================
     DISPLAY ROUTE
     ======================================================= */

  private displayTrack(coords: [number, number][], padding: number): void {
    this.updateTrackLine(coords);
    this.calculateDistance(coords);

    const lngs = coords.map(c => c[0]);
    const lats = coords.map(c => c[1]);

    this.map.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)]
      ],
      { padding }
    );

    new Marker({ color: '#22c55e' }).setLngLat(coords[0]).addTo(this.map);
    new Marker({ color: '#ef4444' }).setLngLat(coords[coords.length - 1]).addTo(this.map);
  }

  private updateTrackLine(coords: [number, number][]): void {
    const source = this.map?.getSource('track') as GeoJSONSource;
    if (!source) {
      return;
    }

    source.setData({
      type: 'FeatureCollection',
      features: coords.length >= 2
        ? [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coords } }]
        : []
    });
  }

  private calculateDistance(coords: [number, number][]): void {
    let dist = 0;
    const R = 6371;

    for (let i = 1; i < coords.length; i++) {
      const [lng1, lat1] = coords[i - 1];
      const [lng2, lat2] = coords[i];

      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;

      dist += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    this.distanceKm = Math.round(dist * 10) / 10;
  }

  /* =======================================================
     SAVE ROUTE
     ======================================================= */

  saveRoute(): void {
    const hasDrawn = this.drawnPoints.length >= 2;
    const hasGpx = !!this.selectedGpxFile;

    if (!hasDrawn && !hasGpx) {
      this.errorMessage = 'Draw a route or import a GPX file first.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    if (hasGpx && !hasDrawn) {
      this.trailService.importGpx(this.trailId, this.selectedGpxFile!)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.onSaveSuccess(),
          error: () => this.onSaveError()
        });
    } else {
      const points = this.drawnPoints.map(p => ({ lat: p.lat, lng: p.lng }));

      this.trailService.saveTrailPoints(this.trailId, points)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.onSaveSuccess(),
          error: () => this.onSaveError()
        });
    }
  }

  private onSaveSuccess(): void {
    this.zone.run(() => {
      this.isSaving = false;
      this.saveSuccess = true;
      this.selectedGpxFile = undefined;
      this.gpxFileName = '';

      setTimeout(() => {
        this.saveSuccess = false;
        this.router.navigate([`/trail/${this.trailId}`]);
      }, 1500);
    });
  }

  private onSaveError(): void {
    this.zone.run(() => {
      this.isSaving = false;
      this.errorMessage = 'Failed to save route. Please try again.';
    });
  }

  get canSave(): boolean {
    return this.drawnPoints.length >= 2 || !!this.selectedGpxFile;
  }

  /* =======================================================
     ANNOTATIONS
     ======================================================= */

  private refreshAnnotationSource(): void {
    const source = this.map.getSource('annotations') as GeoJSONSource;
    if (!source) {
      return;
    }

    source.setData({
      type: 'FeatureCollection',
      features: this.annotations.map(annotation => {
        const typeInfo = ANNOTATION_TYPES.find(t => t.value === annotation.type);

        return {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [annotation.lng, annotation.lat] },
          properties: {
            id: annotation.id,
            emoji: typeInfo?.emoji ?? '📍',
            color: typeInfo?.color ?? '#f97316',
            title: annotation.title,
            description: annotation.description || '',
            typeLabel: typeInfo?.label ?? 'Annotation'
          }
        };
      })
    });
  }

  addAnnotation(): void {
    if (!this.newAnnotationTitle.trim()) {
      return;
    }

    // id/createdBy/createdAt are assigned by the server (see AnnotationController) —
    // don't set them here, and don't touch this.annotations until the save succeeds,
    // so a failed request never leaves the UI showing an annotation nobody else has.
    const request = {
      lat: this.pendingLat,
      lng: this.pendingLng,
      type: this.newAnnotationType,
      title: this.newAnnotationTitle.trim(),
      description: this.newAnnotationDesc.trim() || undefined
    };

    const pendingTitle = this.newAnnotationTitle;
    this.cancelAddAnnotation();

    this.annotationService.createAnnotation(this.trailId, request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (saved: TrailAnnotation) => {
          this.zone.run(() => {
            this.annotations = [...this.annotations, saved];
            this.refreshAnnotationSource();
          });
        },
        error: () => {
          this.zone.run(() => {
            this.errorMessage = `Could not save "${pendingTitle}". Please try again.`;
          });
        }
      });
  }

  removeAnnotation(id: string): void {
    const previous = this.annotations;

    this.annotationService.deleteAnnotation(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.zone.run(() => {
            this.annotations = this.annotations.filter(annotation => annotation.id !== id);
            this.refreshAnnotationSource();
            document.querySelectorAll('.maplibregl-popup').forEach(popup => popup.remove());
          });
        },
        error: () => {
          this.zone.run(() => {
            this.annotations = previous;
            this.errorMessage = 'Could not delete that annotation. You may not have permission.';
          });
        }
      });
  }

  cancelAddAnnotation(): void {
    this.showAddPanel = false;
    this.pendingMarker?.remove();
    this.pendingMarker = undefined;
    this.newAnnotationTitle = '';
    this.newAnnotationDesc = '';
  }

  /* =======================================================
     SEARCH
     ======================================================= */

  private flyToLocation(location: string): void {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`;

    this.http.get<any[]>(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe(results => {
        if (results?.length) {
          this.map.flyTo({
            center: [parseFloat(results[0].lon), parseFloat(results[0].lat)],
            zoom: 13
          });
        }
      });
  }

  doSearch(): void {
    if (!this.searchQuery.trim()) {
      return;
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.searchQuery)}&limit=5`;

    this.http.get<any[]>(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe(results => {
        this.zone.run(() => {
          this.searchResults = results;
          this.showSearchResults = true;
        });
      });
  }

  selectSearchResult(r: { display_name: string; lat: string; lon: string }): void {
    this.map.flyTo({ center: [parseFloat(r.lon), parseFloat(r.lat)], zoom: 14 });
    this.searchQuery = r.display_name.split(',')[0];
    this.showSearchResults = false;
    this.searchResults = [];
  }

  getTypeInfo(type: string) {
    return ANNOTATION_TYPES.find(t => t.value === type);
  }
}