import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile, Timesheet, LeaveRequest } from './app/models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:5057/api/employee';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  getProfile(): Observable<Profile> {
    const url = `${this.apiUrl}/Profile`;
    console.log('Fetching profile, URL:', url);
    return this.http.get<Profile>(url, { headers: this.getAuthHeaders() });
  }

  updateProfile(userId: number, profile: Profile): Observable<Profile> {
    const url = `${this.apiUrl}/Profile/${userId}`;
    return this.http.put<Profile>(url, profile, { headers: this.getAuthHeaders() });
  }

  submitTimesheet(timesheet: Partial<Timesheet>): Observable<Timesheet> {
    const url = `${this.apiUrl}/timesheets/Submit`; // Updated to match backend endpoint
    return this.http.post<Timesheet>(url, timesheet, { headers: this.getAuthHeaders() });
  }

  updateTimesheet(timesheetId: number, timesheet: Partial<Timesheet>): Observable<Timesheet> {
    const url = `${this.apiUrl}/timesheets/Update/${timesheetId}`;
    return this.http.put<Timesheet>(url, timesheet, { headers: this.getAuthHeaders() });
  }

  deleteTimesheet(timesheetId: number): Observable<void> {
    const url = `${this.apiUrl}/timesheets/Delete/${timesheetId}`;
    return this.http.delete<void>(url, { headers: this.getAuthHeaders() });
  }

  requestLeave(leaveRequest: Partial<LeaveRequest>): Observable<LeaveRequest> {
    const url = `${this.apiUrl}/leaves/Submit`; // Updated to match backend endpoint
    return this.http.post<LeaveRequest>(url, leaveRequest, { headers: this.getAuthHeaders() });
  }

  getTimesheets(): Observable<Timesheet[]> {
    const url = `${this.apiUrl}/timesheets`;
    console.log('Fetching timesheets, URL:', url);
    return this.http.get<Timesheet[]>(url, { headers: this.getAuthHeaders() });
  }

  getLeaves(): Observable<LeaveRequest[]> {
    const url = `${this.apiUrl}/leaves`;
    console.log('Fetching leaves, URL:', url);
    return this.http.get<LeaveRequest[]>(url, { headers: this.getAuthHeaders() });
  }
}