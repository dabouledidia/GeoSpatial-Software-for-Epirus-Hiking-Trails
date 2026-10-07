import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  
  private apiUrl = 'https://geospatial-software-for-epirus-hiking.onrender.com';  
  constructor(private http: HttpClient) {}

  addReview(trailId: number, reviewData: any): Observable<any> {
      return this.http.post(
        `${this.apiUrl}/add/${trailId}`,
        reviewData
      );
    }



  getReviews(trailId: number): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/reviews/${trailId}`);
    }

    deleteReview(reviewId: number): Observable<Object>{
      return this.http.delete(this.apiUrl+ "/deleteReview/"+ reviewId);
    }

    getUserReviews(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/userReviews`);
    }
}
