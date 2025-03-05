import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5057/api/Auth';

  constructor(private http: HttpClient) {}

  login(loginDto: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, loginDto);
  }

  register(registerDto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, registerDto);
  }
}