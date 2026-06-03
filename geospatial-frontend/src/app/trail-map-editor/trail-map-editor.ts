import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ViewChild, ElementRef, NgZone, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { TrailService } from '../services/trail.service';
import maplibregl, { Map, Marker, GeoJSONSource } from 'maplibre-gl';

interface DrawPoint {
  lng: number;
  lat: number;
  elevation?: number;
  marker: Marker;
}

@Component({
  selector: 'app-trail-map-editor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './trail-map-editor.html',
  styleUrls: ['./trail-map-editor.css'],
})
export class TrailMapEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private map!: Map;
  private zone = inject(NgZone);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private trailService = inject(TrailService);

  trailId!: number;
  trailName = '';

  // Mode: 'view' | 'draw'
  mode: 'view' | 'draw' = 'view';

  // Drawn points
  drawnPoints: DrawPoint[] = [];

  // State
  isSaving = false;
  isLoading = false;
  saveSuccess = false;
  errorMessage = '';
  distanceKm = 0;

  // GPX upload
  selectedGpxFile?: File;
  gpxFileName = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.trailId = Number(id);
      this.loadTrailInfo();
    }
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => this.initMap());
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private initMap(): void {
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [20.5, 39.5],
      zoom: 9,
      attributionControl: { compact: true },
    });

    this.map.addControl(new maplibregl.NavigationControl(), 'bottom-right');
    this.map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    this.map.on('load', () => {
      this.zone.run(() => {
        this.initTrackLayer();
        this.loadExistingPoints();
      });
    });

    this.map.on('click', (e) => {
      this.zone.run(() => {
        if (this.mode !== 'draw') return;
        this.addDrawPoint(e.lngLat.lng, e.lngLat.lat);
      });
    });
  }

  private initTrackLayer(): void {
    this.map.addSource('track', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    });

    // Track shadow
    this.map.addLayer({
      id: 'track-shadow',
      type: 'line',
      source: 'track',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#000', 'line-width': 6, 'line-opacity': 0.15 },
    });

    // Track line
    this.map.addLayer({
      id: 'track-line',
      type: 'line',
      source: 'track',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#f97316', 'line-width': 4, 'line-opacity': 0.9 },
    });
  }

  private loadTrailInfo(): void {
    this.trailService.getTrail(this.trailId).subscribe({
      next: (trail) => {
        this.trailName = trail.trailName || trail.name || '';
      },
    });
  }

  private loadExistingPoints(): void {
    this.isLoading = true;
    this.trailService.getTrailPoints(this.trailId).subscribe({
      next: (points) => {
        this.isLoading = false;
        if (points.length > 0) {
          this.renderLoadedTrack(points);
        }
      },
      error: () => { this.isLoading = false; },
    });
  }

  private renderLoadedTrack(points: { lat: number; lng: number; elevation?: number }[]): void {
    const coords: [number, number][] = points.map(p => [p.lng, p.lat]);
    this.updateTrackLine(coords);
    this.calculateDistance(coords);

    // Fit map to track
    const lngs = coords.map(c => c[0]);
    const lats = coords.map(c => c[1]);
    this.map.fitBounds(
      [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
      { padding: 60 }
    );

    // Start/end markers
    new Marker({ color: '#22c55e' }).setLngLat(coords[0]).addTo(this.map);
    new Marker({ color: '#ef4444' }).setLngLat(coords[coords.length - 1]).addTo(this.map);
  }

  // --- Draw mode ---

  startDrawing(): void {
    this.mode = 'draw';
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
      width: 24px; height: 24px; border-radius: 50%;
      background: #f97316; border: 2px solid white;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; color: white; font-weight: bold;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3); cursor: pointer;
    `;

    // Right-click marker to remove
    el.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.zone.run(() => this.removeDrawPoint(index));
    });

    const marker = new Marker({ element: el, draggable: true })
      .setLngLat([lng, lat])
      .addTo(this.map);

    marker.on('dragend', () => {
      this.zone.run(() => {
        const lngLat = marker.getLngLat();
        const pt = this.drawnPoints.find(p => p.marker === marker);
        if (pt) {
          pt.lng = lngLat.lng;
          pt.lat = lngLat.lat;
          this.refreshTrackLine();
        }
      });
    });

    this.drawnPoints.push({ lng, lat, marker });
    this.refreshTrackLine();
  }

  removeDrawPoint(index: number): void {
    const point = this.drawnPoints[index];
    if (point) {
      point.marker.remove();
      this.drawnPoints.splice(index, 1);
      this.refreshTrackLine();
    }
  }

  undoLastPoint(): void {
    if (this.drawnPoints.length === 0) return;
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

  // --- GPX Import ---

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
          const coords = this.parseGpxText(e.target?.result as string);
          if (coords.length) {
            this.clearDrawnPoints();
            this.stopDrawing();
            this.updateTrackLine(coords);
            this.calculateDistance(coords);

            const lngs = coords.map(c => c[0]);
            const lats = coords.map(c => c[1]);
            this.map.fitBounds(
              [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
              { padding: 60 }
            );
          }
        } catch {
          this.errorMessage = 'Invalid GPX file.';
        }
      });
    };
    reader.readAsText(file);
  }

  private parseGpxText(gpxText: string): [number, number][] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(gpxText, 'application/xml');
    const points = Array.from(doc.querySelectorAll('trkpt,rtept'));
    return points.map(p => [
      parseFloat(p.getAttribute('lon')!),
      parseFloat(p.getAttribute('lat')!),
    ]);
  }

  // --- Save ---

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
      // Save via GPX upload
      this.trailService.importGpx(this.trailId, this.selectedGpxFile!).subscribe({
        next: () => this.onSaveSuccess(),
        error: () => this.onSaveError(),
      });
    } else {
      // Save drawn points
      const points = this.drawnPoints.map(p => ({ lat: p.lat, lng: p.lng }));
      this.trailService.saveTrailPoints(this.trailId, points).subscribe({
        next: () => this.onSaveSuccess(),
        error: () => this.onSaveError(),
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

  // --- Helpers ---

  private updateTrackLine(coords: [number, number][]): void {
    const source = this.map?.getSource('track') as GeoJSONSource;
    if (!source) return;
    source.setData({
      type: 'FeatureCollection',
      features: coords.length >= 2 ? [{
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: coords },
      }] : [],
    });
  }

  private calculateDistance(coords: [number, number][]): void {
    let dist = 0;
    for (let i = 1; i < coords.length; i++) {
      const [lng1, lat1] = coords[i - 1];
      const [lng2, lat2] = coords[i];
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
      dist += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }
    this.distanceKm = Math.round(dist * 10) / 10;
  }

  get canSave(): boolean {
    return this.drawnPoints.length >= 2 || !!this.selectedGpxFile;
  }
}