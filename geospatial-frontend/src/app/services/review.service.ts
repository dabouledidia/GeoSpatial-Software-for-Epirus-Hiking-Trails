import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  addReview(trailId: number, reviewData: any): Observable<any> {
      const token = localStorage.getItem('token');


      return this.http.post(
        `${this.apiUrl}/add/${trailId}`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    }



  getReviews(trailId: number): Observable<any[]> {
      const token = localStorage.getItem('token');

      return this.http.get<any[]>(`${this.apiUrl}/reviews/${trailId}`,
      {
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
      });
    }
}
