import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatchDetailsService {

  private baseUrl = environment.apiUrl+'/api/v1/match-details';
  private headers : HttpHeaders;
  
  constructor(private http: HttpClient) { }
  

  getMatchDetails(id: number): Observable<any> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.get(`${this.baseUrl}/${id}`, { headers: this.headers });
  }

  addMatchDetails(matchDetails: Object): Observable<Object> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.post(`${this.baseUrl}`, matchDetails, { headers: this.headers });
  }

  updateMatchDetails(id: number, matchDetails: Object): Observable<Object> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.put(`${this.baseUrl}/${id}`, matchDetails, { headers: this.headers });
  }

  deleteMatchDetails(id: number): Observable<any> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text', headers: this.headers });
  }

  getMatchDetailsList(): Observable<any> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.get(`${this.baseUrl}`, { headers: this.headers });
  }

  getMatchDetailsForDates(fromDate: string, toDate: string): Observable<any> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.get(`${this.baseUrl}/${fromDate}/${toDate}`, { headers: this.headers });
  }
}