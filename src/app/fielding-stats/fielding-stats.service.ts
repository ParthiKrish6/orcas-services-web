import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FieldingStatsService {

  private baseUrl = environment.apiUrl+'/api/v1/fielding-stats';

  constructor(private http: HttpClient) { }
  

  getFieldingStatsBetweenDates(fromDate: string, toDate: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${fromDate}/${toDate}`);
  }

  getFieldingStatsBetweenDatesForTeam(fromDate: string, toDate: string, teamId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${fromDate}/${toDate}/${teamId}`);
  }

  getFieldingStatsList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getFieldingStatsForTeam(teamId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${teamId}`);
  }
}