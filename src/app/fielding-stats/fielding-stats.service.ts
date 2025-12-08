import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FieldingStatsService {

  private baseUrl = environment.apiUrl+'/api/v1/fielding-stats';
  private headers : HttpHeaders;
  
  constructor(private http: HttpClient) { }
  

  getFieldingStatsBetweenDates(fromDate: string, toDate: string): Observable<any> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.get(`${this.baseUrl}/${fromDate}/${toDate}`, { headers: this.headers });
  }

  getFieldingStatsBetweenDatesForTeam(fromDate: string, toDate: string, teamId: number): Observable<any> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.get(`${this.baseUrl}/${fromDate}/${toDate}/${teamId}`, { headers: this.headers });
  }

  getFieldingStatsList(): Observable<any> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.get(`${this.baseUrl}`, { headers: this.headers });
  }

  getFieldingStatsForTeam(teamId: number): Observable<any> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.get(`${this.baseUrl}/${teamId}`, { headers: this.headers });
  }
}