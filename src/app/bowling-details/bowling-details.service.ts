import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BowlingDetailsService {

  private baseUrl = environment.apiUrl+'/api/v1/bowling-details';

  constructor(private http: HttpClient) { }
  

  getBowlingDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  addBowlingDetails(bowlingDetails: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, bowlingDetails);
  }

  updateBowlingDetails(id: number, bowlingDetails: Object): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, bowlingDetails);
  }

  deleteBowlingDetails(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getBowlingDetailsList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getBowlingDetailsForMatch(matchId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/match/${matchId}`);
  }
}