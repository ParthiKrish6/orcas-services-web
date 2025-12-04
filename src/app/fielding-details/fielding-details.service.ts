import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FieldingDetailsService {

  private baseUrl = environment.apiUrl+'/api/v1/fielding-details';

  constructor(private http: HttpClient) { }
  

  getFieldingDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  addFieldingDetails(fieldingDetails: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, fieldingDetails);
  }

  updateFieldingDetails(id: number, fieldingDetails: Object): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, fieldingDetails);
  }

  deleteFieldingDetails(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getFieldingDetailsList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getFieldingDetailsForMatch(matchId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/match/${matchId}`);
  }
}