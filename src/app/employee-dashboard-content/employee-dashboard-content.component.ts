import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../../employee.service';
import { Profile, Timesheet } from '../models/employee.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-employee-dashboard-content',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-dashboard-content.component.html',
  styleUrls: ['./employee-dashboard-content.component.css'],
})
export class EmployeeDashboardContentComponent implements OnInit {
  profile: Profile | null = null;
  userInitials: string = '';
  totalHoursThisWeek: number = 0;
  pendingTimesheets: number = 0;
  pendingLeaveRequests: number = 0;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      console.warn('User not logged in, redirecting to login');
      return;
    }
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.employeeService.getProfile().subscribe({
      next: (response) => {
        console.log('Employee profile fetched:', response);
        this.profile = response;
        this.userInitials = this.getInitials(response?.fullName || ''); // Changed to fullName
        this.fetchTimesheets();
      },
      error: (err) => {
        console.error('Failed to fetch profile:', err);
        this.errorMessage = 'Failed to load profile';
        this.isLoading = false;
      },
    });
  }

  fetchTimesheets(): void {
    this.employeeService.getTimesheets().subscribe({
      next: (timesheets) => {
        this.totalHoursThisWeek = this.calculateTotalHoursThisWeek(timesheets);
        this.pendingTimesheets = timesheets.filter(ts => ts.status === 'Pending').length; // Changed to status
        this.fetchLeaves();
      },
      error: (err) => {
        console.error('Failed to fetch timesheets:', err);
        this.errorMessage = 'Failed to load timesheets';
        this.isLoading = false;
      },
    });
  }
  fetchLeaves(): void {
    this.employeeService.getLeaves().subscribe({
      next: (leaves) => {
        this.pendingLeaveRequests = leaves.filter(lr => lr.status === 'Pending').length; // Now matches the interface
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch leave requests:', err);
        this.errorMessage = 'Failed to load leave requests';
        this.isLoading = false;
      },
    });
  }

  private calculateTotalHoursThisWeek(timesheets: Timesheet[]): number {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return timesheets
      .filter(ts => {
        const tsDate = new Date(ts.date); // Changed to date
        return tsDate >= startOfWeek && tsDate <= endOfWeek;
      })
      .reduce((total, ts) => total + ts.hoursWorked, 0); // Changed to hoursWorked
  }

  private getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .slice(0, 2) || 'E';
  }
}