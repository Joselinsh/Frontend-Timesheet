import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../employee.service';
import { Profile } from '../models/employee.model';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profile: Profile | null = null;
  personalInfo: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    maritalStatus: string;
    bloodGroup: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
  } = {
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    maritalStatus: '',
    bloodGroup: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  };
  isLoading = false;
  errorMessage: string | null = null;
  isEditingPersonal = false;
  activeTab: 'professional' | 'personal' = 'professional';

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      console.warn('User not logged in, redirecting to login');
      this.router.navigate(['/']);
      return;
    }
    console.log('Token in localStorage:', localStorage.getItem('token'));
    this.loadPersonalInfo();
    this.fetchProfile();
  }

  fetchProfile(): void {
    this.isLoading = true;
    this.errorMessage = null;
    const token = localStorage.getItem('token');
    console.log('Fetching profile with token:', token);
    this.employeeService.getProfile().subscribe({
      next: (response) => {
        console.log('Profile fetched successfully:', response);
        this.profile = response || { employeeId: 0, fullName: 'Unknown', email: 'unknown@example.com', department: 'N/A', designation: 'N/A', timesheets: [] };
        this.isLoading = false;
        if (!response) {
          console.warn('No profile data received:', response);
          this.errorMessage = 'No profile data available.';
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to fetch profile:', err.status, err.statusText, err.error);
        this.errorMessage = `Failed to load profile: ${err.status} - ${err.statusText || err.message}`;
        this.profile = { employeeId: 0, fullName: 'Unknown', email: 'unknown@example.com', department: 'N/A', designation: 'N/A', timesheets: [] }; // Fallback with employeeId
        this.isLoading = false;
      },
    });
  }

  toggleEditPersonal(): void {
    this.isEditingPersonal = !this.isEditingPersonal;
  }

  savePersonalInfo(): void {
    const userId = this.authService.getRoleId();
    if (userId) {
      localStorage.setItem(`personalInfo_${userId}`, JSON.stringify(this.personalInfo));
    }
    this.isEditingPersonal = false;
  }

  loadPersonalInfo(): void {
    const userId = this.authService.getRoleId();
    if (userId) {
      const savedInfo = localStorage.getItem(`personalInfo_${userId}`);
      if (savedInfo) {
        this.personalInfo = JSON.parse(savedInfo);
      }
    }
  }

  setActiveTab(tab: 'professional' | 'personal'): void {
    this.activeTab = tab;
  }
}