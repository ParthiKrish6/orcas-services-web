import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClearCacheService {

  private baseUrlCache = environment.apiUrl+'/api/v1/clear-cache';
  private headers : HttpHeaders;

  constructor(private http: HttpClient) { }

  clearCache(): Observable<Object> {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.post(`${this.baseUrlCache}`, {}, { responseType: 'text' ,  headers: this.headers });
  }

}