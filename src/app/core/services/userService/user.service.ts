import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile/`);
  }

  updateUserProfile(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/profile/`, data)
  }
}
