import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BowlingDetailsService {

  private baseUrl = environment.apiUrl+'/api/v1/bowling-details';
  private headers : HttpHeaders;
  
  constructor(private http: HttpClient) { }
  

  getBowlingDetails(id: number): Observable<any> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.get(`${this.baseUrl}/${id}`, { headers: this.headers });
  }

  addBowlingDetails(bowlingDetails: Object): Observable<Object> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.post(`${this.baseUrl}`, bowlingDetails, { headers: this.headers });
  }

  updateBowlingDetails(id: number, bowlingDetails: Object): Observable<Object> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.put(`${this.baseUrl}/${id}`, bowlingDetails, { headers: this.headers });
  }

  deleteBowlingDetails(id: number): Observable<any> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' ,  headers: this.headers });
  }

  getBowlingDetailsList(): Observable<any> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.get(`${this.baseUrl}`, { headers: this.headers });
  }

  getBowlingDetailsForMatch(matchId: number): Observable<any> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.get(`${this.baseUrl}/match/${matchId}`, { headers: this.headers });
  }
}