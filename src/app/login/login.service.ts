import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = environment.apiUrl+'/api/v1/login';

  constructor(private http: HttpClient) { }
  
  login(loginDetails: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, loginDetails);
  }

}