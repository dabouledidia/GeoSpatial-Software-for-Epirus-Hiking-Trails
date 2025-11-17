import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Trail } from '../models/trail.model';

@Injectable({
  providedIn: 'root',
})
export class TrailService {
private apiUrl = 'http://localhost:8080/';

    constructor(private http: HttpClient){}

    getTrails(): Observable<any[]>{
        const token = localStorage.getItem('token');

        return this.http.get<any[]>(this.apiUrl + "all_trails",{
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    }

    createTrail(trail: FormData): Observable<any> {
      return this.http.post(this.apiUrl + "createTrail", trail); 
    }

    deleteTrail(id: number): Observable<Object>{
        return this.http.delete(this.apiUrl+ "deleteTrail/"+ id);
    }
}