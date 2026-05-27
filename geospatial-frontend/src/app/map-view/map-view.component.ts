import {
  Component, AfterViewInit, OnDestroy, OnChanges,
  Input, SimpleChanges, ViewChild, ElementRef, NgZone, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import maplibregl, { Map, Marker, GeoJSONSource } from 'maplibre-gl';

export interface TrailAnnotation {
  id: string;
  lng: number;
  lat: number;
  type: 'warning' | 'water' | 'obstacle' | 'weather' | 'closed' | 'viewpoint';
  title: string;
  description?: string;
  createdBy?: string;
  createdAt?: Date;
}

const ANNOTATION_TYPES = [
  { value: 'warning',   label: 'Warning',    emoji: '⚠️', color: '#f59e0b' },
  { value: 'water',     label: 'Water',      emoji: '💧', color: '#3b82f6' },
  { value: 'obstacle',  label: 'Obstacle',   emoji: '🪨', color: '#78716c' },
  { value: 'weather',   label: 'Weather',    emoji: '❄️', color: '#67e8f9' },
  { value: 'closed',    label: 'Closed',     emoji: '🔒', color: '#ef4444' },
  { value: 'viewpoint', label: 'Viewpoint',  emoji: '👁️', color: '#8b5cf6' },
];

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
})
export class MapViewComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  @Input() gpxUrl?: string;
  @Input() center: [number, number] = [22.9, 40.6];
  @Input() zoom = 12;
  @Input() trackColor = '#f97316';
  @Input() currentUserId?: string;
  @Input() trailName?: string;
  @Input() set searchLocation(location: string) {
    if (location) {
      this._searchLocation = location;
      if (this.map) this.flyToLocation(location);
    }
  }
  private _searchLocation?: string;

  private map!: Map;
  private zone = inject(NgZone);
  private http = inject(HttpClient);

  annotations: TrailAnnotation[] = [];
  annotationTypes = ANNOTATION_TYPES;

  showAddPanel = false;
  pendingLng = 0;
  pendingLat = 0;
  pendingMarker?: Marker;
  newAnnotationType: TrailAnnotation['type'] = 'warning';
  newAnnotationTitle = '';
  newAnnotationDesc = '';

  searchQuery = '';
  searchResults: { display_name: string; lat: string; lon: string }[] = [];
  showSearchResults = false;

  trailStats?: { distanceKm: number };
  isLoading = false;

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => this.initMap());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.map) return;
    if (changes['gpxUrl'] && this.gpxUrl) this.loadGpx();
  }

  ngOnDestroy() {
    this.map?.remove();
  }

  private initMap(): void {
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: this.center,
      zoom: this.zoom,
      attributionControl: { compact: true },
    });

    this.map.addControl(new maplibregl.NavigationControl(), 'bottom-right');
    this.map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');
    this.map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      'bottom-right'
    );

    this.map.on('load', () => {
      this.zone.run(() => {
        if (this.gpxUrl) this.loadGpx();
        this.initAnnotationLayer();
        if (this._searchLocation) this.flyToLocation(this._searchLocation);
      });
    });

    this.map.on('click', (e) => {
      const features = this.map.queryRenderedFeatures(e.point, { layers: ['annotations-layer'] });
      if (features.length > 0) return;
      this.zone.run(() => {
        this.pendingLng = e.lngLat.lng;
        this.pendingLat = e.lngLat.lat;
        this.showAddPanel = true;
        this.newAnnotationTitle = '';
        this.newAnnotationDesc = '';
        this.pendingMarker?.remove();
        this.pendingMarker = new Marker({ color: '#f97316' })
          .setLngLat([this.pendingLng, this.pendingLat])
          .addTo(this.map);
      });
    });
  }

  private initAnnotationLayer(): void {
    this.map.addSource('annotations', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
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
        'circle-opacity': 0.92,
      },
    });

    this.map.addLayer({
      id: 'annotations-labels',
      type: 'symbol',
      source: 'annotations',
      layout: {
        'text-field': ['get', 'emoji'],
        'text-size': 14,
        'text-allow-overlap': true,
      },
    });

    this.map.on('click', 'annotations-layer', (e) => {
      if (!e.features?.length) return;
      const props = e.features[0].properties;
      const coords = (e.features[0].geometry as any).coordinates;
      const ann = this.annotations.find(a => a.id === props['id']);
      const canDelete = !this.currentUserId || ann?.createdBy === this.currentUserId;

      new maplibregl.Popup({ offset: 20 })
        .setLngLat(coords)
        .setHTML(`
          <div style="font-family:sans-serif;min-width:160px">
            <div style="font-size:20px;text-align:center;margin-bottom:6px">${props['emoji']}</div>
            <div style="font-weight:600;font-size:14px;margin-bottom:4px">${props['title']}</div>
            ${props['description'] ? `<div style="font-size:12px;color:#666;margin-bottom:8px">${props['description']}</div>` : ''}
            <div style="font-size:11px;color:#999;margin-bottom:8px">${props['typeLabel']}</div>
            ${canDelete ? `<button onclick="window.__deleteAnnotation('${props['id']}')" style="width:100%;padding:6px;background:#fee2e2;border:none;border-radius:6px;color:#dc2626;font-size:12px;cursor:pointer;font-weight:500">Delete</button>` : ''}
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
      this.zone.run(() => this.removeAnnotation(id));
    };
  }

  private refreshAnnotationSource(): void {
    const source = this.map.getSource('annotations') as GeoJSONSource;
    if (!source) return;
    source.setData({
      type: 'FeatureCollection',
      features: this.annotations.map(a => {
        const typeInfo = ANNOTATION_TYPES.find(t => t.value === a.type)!;
        return {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [a.lng, a.lat] },
          properties: {
            id: a.id,
            emoji: typeInfo.emoji,
            color: typeInfo.color,
            title: a.title,
            description: a.description || '',
            typeLabel: typeInfo.label,
          },
        };
      }),
    });
  }

  addAnnotation(): void {
    if (!this.newAnnotationTitle.trim()) return;
    const annotation: TrailAnnotation = {
      id: Date.now().toString(),
      lng: this.pendingLng,
      lat: this.pendingLat,
      type: this.newAnnotationType,
      title: this.newAnnotationTitle.trim(),
      description: this.newAnnotationDesc.trim() || undefined,
      createdBy: this.currentUserId,
      createdAt: new Date(),
    };
    this.annotations = [...this.annotations, annotation];
    this.refreshAnnotationSource();
    this.cancelAddAnnotation();
  }

  removeAnnotation(id: string): void {
    this.annotations = this.annotations.filter(a => a.id !== id);
    this.refreshAnnotationSource();
    document.querySelectorAll('.maplibregl-popup').forEach(p => p.remove());
  }

  cancelAddAnnotation(): void {
    this.showAddPanel = false;
    this.pendingMarker?.remove();
    this.pendingMarker = undefined;
    this.newAnnotationTitle = '';
    this.newAnnotationDesc = '';
  }

  private loadGpx(): void {
    if (!this.gpxUrl) return;
    this.isLoading = true;
    this.http.get(this.gpxUrl, { responseType: 'text' }).subscribe({
      next: (gpxText) => {
        const coords = this.parseGpx(gpxText);
        if (coords.length) this.renderTrack(coords);
        this.zone.run(() => this.isLoading = false);
      },
      error: () => this.zone.run(() => this.isLoading = false),
    });
  }

  private parseGpx(gpxText: string): [number, number][] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(gpxText, 'application/xml');
    const points = Array.from(doc.querySelectorAll('trkpt,rtept'));
    return points.map(p => [
      parseFloat(p.getAttribute('lon')!),
      parseFloat(p.getAttribute('lat')!),
    ]);
  }

  private renderTrack(coords: [number, number][]): void {
    if (this.map.getSource('track')) {
      (this.map.getSource('track') as GeoJSONSource).setData({
        type: 'Feature', properties: {},
        geometry: { type: 'LineString', coordinates: coords },
      });
    } else {
      this.map.addSource('track', {
        type: 'geojson',
        data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coords } },
      });
      this.map.addLayer({
        id: 'track-line',
        type: 'line',
        source: 'track',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': this.trackColor, 'line-width': 4, 'line-opacity': 0.9 },
      }, 'annotations-layer');
    }

    new Marker({ color: '#22c55e' }).setLngLat(coords[0]).addTo(this.map);
    new Marker({ color: '#ef4444' }).setLngLat(coords[coords.length - 1]).addTo(this.map);

    let dist = 0;
    for (let i = 1; i < coords.length; i++) {
      const [lng1, lat1] = coords[i - 1];
      const [lng2, lat2] = coords[i];
      const R = 6371000;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
      dist += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }
    this.zone.run(() => this.trailStats = { distanceKm: Math.round(dist / 100) / 10 });

    const lngs = coords.map(c => c[0]);
    const lats = coords.map(c => c[1]);
    this.map.fitBounds(
      [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
      { padding: 40 }
    );
  }

  private flyToLocation(location: string): void {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`;
    this.http.get<any[]>(url).subscribe(results => {
      if (results?.length) {
        this.map.flyTo({
          center: [parseFloat(results[0].lon), parseFloat(results[0].lat)],
          zoom: 13,
        });
      }
    });
  }

  doSearch(): void {
    if (!this.searchQuery.trim()) return;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.searchQuery)}&limit=5`;
    this.http.get<any[]>(url).subscribe(results => {
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