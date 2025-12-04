import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlayerDetailsService {

  private baseUrl = environment.apiUrl+'/api/v1/player-details';

  constructor(private http: HttpClient) { }
  

  getPlayerDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  addPlayerDetails(playerDetails: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, playerDetails);
  }

  updatePlayerDetails(id: number, playerDetails: Object): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, playerDetails);
  }

  deletePlayerDetails(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getPlayerDetailsList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}