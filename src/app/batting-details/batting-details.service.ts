import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BattingDetailsService {

  private baseUrl = environment.apiUrl+'/api/v1/batting-details';

  constructor(private http: HttpClient) { }
  

  getBattingDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  addBattingDetails(battingDetails: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, battingDetails);
  }

  updateBattingDetails(id: number, battingDetails: Object): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, battingDetails);
  }

  deleteBattingDetails(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getBattingDetailsList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getBattingDetailsForMatch(matchId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/match/${matchId}`);
  }
}