import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadScoreCardService {

  private baseUrl = environment.apiUrl+'/api/v1/upload-scorecard';
  private headers : HttpHeaders;
  
  constructor(private http: HttpClient) { }

  uploadScoreCard(formData: FormData): Observable<any> {
    this.headers = new HttpHeaders({
      'Authorization': 'Bearer ' +localStorage.getItem('authToken')
    });
    return this.http.post(`${this.baseUrl}`, formData, { headers: this.headers });
  }

}