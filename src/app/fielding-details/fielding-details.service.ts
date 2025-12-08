import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FieldingDetailsService {

  private baseUrl = environment.apiUrl+'/api/v1/fielding-details';
  private headers : HttpHeaders;
  constructor(private http: HttpClient) { }
  

  getFieldingDetails(id: number): Observable<any> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.get(`${this.baseUrl}/${id}`, { headers: this.headers });
  }

  addFieldingDetails(fieldingDetails: Object): Observable<Object> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.post(`${this.baseUrl}`, fieldingDetails, { headers: this.headers });
  }

  updateFieldingDetails(id: number, fieldingDetails: Object): Observable<Object> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.put(`${this.baseUrl}/${id}`, fieldingDetails, { headers: this.headers });
  }

  deleteFieldingDetails(id: number): Observable<any> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' ,  headers: this.headers });
  }

  getFieldingDetailsList(): Observable<any> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.get(`${this.baseUrl}`, { headers: this.headers });
  }

  getFieldingDetailsForMatch(matchId: number): Observable<any> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.get(`${this.baseUrl}/match/${matchId}`, { headers: this.headers });
  }
}