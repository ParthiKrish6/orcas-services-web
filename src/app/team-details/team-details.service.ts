import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamDetailsService {

  private baseUrl = environment.apiUrl+'/api/v1/team-details';
  private headers : HttpHeaders;
  
  constructor(private http: HttpClient) { 
    
  }
  
  getTeamDetails(id: number): Observable<any> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.get(`${this.baseUrl}/${id}`, { headers: this.headers });
  }

  addTeamDetails(teamDetails: Object): Observable<Object> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.post(`${this.baseUrl}`, teamDetails, { headers: this.headers });
  }

  updateTeamDetails(id: number, teamDetails: Object): Observable<Object> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.put(`${this.baseUrl}/${id}`, teamDetails, { headers: this.headers });
  }

  deleteTeamDetails(id: number): Observable<any> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' , headers: this.headers});
  }

  getTeamDetailsList(): Observable<any> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.get(`${this.baseUrl}`, { headers: this.headers });
  }
}