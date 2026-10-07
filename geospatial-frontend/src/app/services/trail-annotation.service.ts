import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TrailAnnotation, CreateTrailAnnotationRequest } from '../models/trail-annotation.model';

@Injectable({ providedIn: 'root' })
export class AnnotationService {

  private http = inject(HttpClient);


  private readonly baseUrl = 'https://geospatial-software-for-epirus-hiking.onrender.com/api/trails';
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