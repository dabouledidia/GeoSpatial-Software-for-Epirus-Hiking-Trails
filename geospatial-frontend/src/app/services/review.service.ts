import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  addReview(trailId: number, reviewData: any): Observable<any> {
  const token = localStorage.getItem('token');


  return this.http.post(
    `http://localhost:8080/add/${trailId}`,
    reviewData,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}

  getReviewsByTrail(trailId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/trail/${trailId}`);
  }
}
