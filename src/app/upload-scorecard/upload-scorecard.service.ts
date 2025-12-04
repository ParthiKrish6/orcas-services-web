import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadScoreCardService {

  private baseUrl = environment.apiUrl+'/api/v1/upload-scorecard';

  constructor(private http: HttpClient) { }

  uploadScoreCard(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}`, formData);
  }

}