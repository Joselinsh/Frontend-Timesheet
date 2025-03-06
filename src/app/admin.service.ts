import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5057/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') ?? '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/users`, { headers: this.getHeaders() });
  }

  updateUser(userId: number, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/user/update/${userId}`, user, { headers: this.getHeaders() });
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/user/delete/${userId}`, { headers: this.getHeaders() });
  }

  assignRole(userId: number, role: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/roles/update`, { userId, role }, { headers: this.getHeaders() });
  }

  // Removed getTotalUsers() as we're using getAllUsers() instead
}