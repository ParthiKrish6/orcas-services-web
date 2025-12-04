import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatchDetailsService {

  private baseUrl = environment.apiUrl+'/api/v1/match-details';

  constructor(private http: HttpClient) { }
  

  getMatchDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  addMatchDetails(matchDetails: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, matchDetails);
  }

  updateMatchDetails(id: number, matchDetails: Object): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, matchDetails);
  }

  deleteMatchDetails(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getMatchDetailsList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getMatchDetailsForDates(fromDate: string, toDate: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${fromDate}/${toDate}`);
  }
}