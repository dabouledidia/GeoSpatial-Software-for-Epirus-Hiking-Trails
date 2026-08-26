import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TrailAnnotation, CreateTrailAnnotationRequest } from '../models/trail-annotation.model';

@Injectable({ providedIn: 'root' })
export class AnnotationService {

  private http = inject(HttpClient);

  // Adjust this base if your app proxies to Spring differently in dev
  // (check proxy.conf.json) — matches AnnotationController's @RequestMapping("/api/trails").
  private readonly baseUrl = 'http://localhost:8080/api/trails';

  getAnnotations(trailId: number): Observable<TrailAnnotation[]> {
    return this.http.get<TrailAnnotation[]>(`${this.baseUrl}/${trailId}/annotations`);
  }

  createAnnotation(
    trailId: number,
    annotation: CreateTrailAnnotationRequest
  ): Observable<TrailAnnotation> {
    return this.http.post<TrailAnnotation>(`${this.baseUrl}/${trailId}/annotations`, annotation);
  }


  deleteAnnotation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/annotations/${id}`);
  }
}