import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

interface LoginResponse {
  message: string;
  token: string;
  roleId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5057/api/Auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(loginDto: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginDto).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('roleId', response.roleId.toString());

        const message = response.message?.toLowerCase() || '';
        if (message.includes('admin dashboard')) {
          localStorage.setItem('role', 'Admin');
          this.router.navigate(['/admin']);
        } else if (message.includes('employee dashboard')) {
          localStorage.setItem('role', 'Employee');
          this.router.navigate(['/employee/home']);
        } else if (message.includes('hr dashboard')) {
          localStorage.setItem('role', 'HR');
          this.router.navigate(['/hr/dashboard']);
        } else {
          this.router.navigate(['/']);
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('roleId');
          throw new Error('Role not assigned yet');
        }
      }),
      catchError(error => {
        console.error('Login failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('roleId');
        return of({ message: '', token: '', roleId: 0 } as LoginResponse);
      })
    );
  }

  register(registerDto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, registerDto);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roleId');
    localStorage.removeItem('role');
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getRoleId(): number | null {
    const roleId = localStorage.getItem('roleId');
    return roleId ? Number(roleId) : null;
  }
}