import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalendarDetailsService {

  private baseUrl = environment.apiUrl+'/api/v1/calendar-details';
  private headers : HttpHeaders;

  constructor(private http: HttpClient) { }
  

  getCalendarDetails(id: number): Observable<any> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.get(`${this.baseUrl}/${id}`, { headers: this.headers });
  }

  addCalendarDetails(calendarDetails: Object): Observable<Object> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.post(`${this.baseUrl}`, calendarDetails, { headers: this.headers });
  }

  updateCalendarDetails(id: number, calendarDetails: Object): Observable<Object> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.put(`${this.baseUrl}/${id}`, calendarDetails, { headers: this.headers });
  }

  deleteCalendarDetails(id: number): Observable<any> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text', headers: this.headers });
  }

  getCalendarDetailsList(): Observable<any> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.get(`${this.baseUrl}`, { headers: this.headers });
  }
}