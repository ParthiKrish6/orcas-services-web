import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BowlingStatsService {

  private baseUrl = environment.apiUrl+'/api/v1/bowling-stats';

  constructor(private http: HttpClient) { }
  

  getBowlingStatsBetweenDates(fromDate: string, toDate: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${fromDate}/${toDate}`);
  }

  getBowlingStatsBetweenDatesForTeam(fromDate: string, toDate: string, teamId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${fromDate}/${toDate}/${teamId}`);
  }

  getBowlingStatsList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getBowlingStatsForTeam(teamId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${teamId}`);
  }
}