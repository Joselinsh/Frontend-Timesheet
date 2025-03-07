import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Added RouterModule
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { EmployeeService } from '../../employee.service';
import { Profile } from '../models/employee.model';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule], // Added RouterModule
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css'],
})
export class EmployeeDashboardComponent implements OnInit {
  profile: Profile | null = null;
  userInitials: string = '';
  darkMode = false;
  showDropdown = false;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      console.warn('User not logged in, redirecting to login');
      this.router.navigate(['/']);
      return;
    }
    this.fetchProfile();
  }

  fetchProfile(): void {
    this.isLoading = true;
    this.employeeService.getProfile().subscribe({
      next: (response) => {
        console.log('Employee profile fetched:', response);
        this.profile = response;
        this.userInitials = this.getInitials(response?.fullName || '');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch employee profile:', err);
        this.errorMessage = 'Failed to load profile';
        this.isLoading = false;
        this.router.navigate(['/']);
      },
    });
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    document.documentElement.classList.toggle('dark', this.darkMode);
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    this.authService.logout();
    this.isLoading = true;
    this.showDropdown = false;
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  navigateTo(path: string): void {
    this.router.navigate([`/employee/${path}`]);
  }

  private getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .slice(0, 2) || 'E';
  }
}