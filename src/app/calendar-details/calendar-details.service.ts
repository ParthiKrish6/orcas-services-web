import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalendarDetailsService {

  private baseUrl = environment.apiUrl+'/api/v1/calendar-details';

  constructor(private http: HttpClient) { }
  

  getCalendarDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  addCalendarDetails(calendarDetails: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, calendarDetails);
  }

  updateCalendarDetails(id: number, calendarDetails: Object): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, calendarDetails);
  }

  deleteCalendarDetails(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getCalendarDetailsList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}