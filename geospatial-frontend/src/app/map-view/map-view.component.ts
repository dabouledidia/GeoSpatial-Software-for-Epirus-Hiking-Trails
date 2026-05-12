import { Component, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css'
})
export class MapViewComponent implements AfterViewInit, OnChanges {
  @Input() searchLocation: string = '';
  @Input() trailName: string = '';

  mapId = 'map-' + Math.random().toString(36).substring(2, 9);
  private map: L.Map | undefined;
  private marker: L.Marker | undefined;

  private famousTrails: { [key: string]: [number, number] } = {
    'smolikas': [40.0933, 20.9233],
    'tymfi': [39.9917, 20.7783],
    'vikos': [39.9536, 20.7183],
    'syrrako': [39.5936, 21.1069],
    'kalarrytes': [39.5828, 21.1250],
    'astraka': [39.9678, 20.7797],
    'drakolimni': [39.9933, 20.7883]
  };

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && (changes['searchLocation'] || changes['trailName'])) {
      this.updateMapLocation();
    }
  }

  private initMap(): void {
    this.map = L.map(this.mapId, { scrollWheelZoom: false }).setView([39.6631, 20.8522], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    
    if (this.searchLocation || this.trailName) {
        this.updateMapLocation();
    }
  }

  private updateMapLocation(): void {
    const searchKey = this.trailName.toLowerCase().trim();
    const locKey = this.searchLocation ? this.searchLocation.toLowerCase().trim() : '';
    let foundInDict = false;

    for (const key in this.famousTrails) {
        if (searchKey.includes(key) || locKey.includes(key)) {
            this.setMapView(this.famousTrails[key][0], this.famousTrails[key][1], this.trailName);
            foundInDict = true;
            break;
        }
    }

    if (!foundInDict) {
      const query = this.searchLocation || this.trailName;
      if (!query) return;
      
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', Epirus, Greece')}&format=json&limit=1`;
      this.http.get<any[]>(url).subscribe(results => {
        if (results && results.length > 0) {
            const lat = parseFloat(results[0].lat);
            const lon = parseFloat(results[0].lon);
            this.setMapView(lat, lon, this.trailName || results[0].display_name);
        }
      });
    }
  }

  private setMapView(lat: number, lon: number, title: string): void {
    if (!this.map) return;
    
    this.map.setView([lat, lon], 12);
    
    if (this.marker) {
        this.marker.setLatLng([lat, lon]);
        this.marker.getPopup()?.setContent(title);
    } else {
        this.marker = L.marker([lat, lon]).addTo(this.map)
            .bindPopup(title)
            .openPopup();
    }
  }
}
