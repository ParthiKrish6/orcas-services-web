import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamDetailsService {

  private baseUrl = environment.apiUrl+'/api/v1/team-details';

  constructor(private http: HttpClient) { }
  

  getTeamDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  addTeamDetails(teamDetails: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, teamDetails);
  }

  updateTeamDetails(id: number, teamDetails: Object): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, teamDetails);
  }

  deleteTeamDetails(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getTeamDetailsList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}