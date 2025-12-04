import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BattingStatsService {

  private baseUrl = environment.apiUrl+'/api/v1/batting-stats';

  constructor(private http: HttpClient) { }
  

  getBattingStatsBetweenDates(fromDate: string, toDate: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${fromDate}/${toDate}`);
  }

  getBattingStatsBetweenDatesForTeam(fromDate: string, toDate: string, teamId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${fromDate}/${toDate}/${teamId}`);
  }

  getBattingStatsList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getBattingStatsForTeam(teamId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${teamId}`);
  }
}