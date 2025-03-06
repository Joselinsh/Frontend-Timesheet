import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SnackbarService } from '../services/snackbar.services';
import { animate, style, transition, trigger } from '@angular/animations'; // For animations

@Component({
  selector: 'app-assign-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-roles.component.html',
  styleUrls: ['./assign-roles.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
    trigger('bannerFade', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 })),
      ]),
    ]),
  ]
})
export class AssignRolesComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  allUsers: any[] = []; // Store all users for total count
  isLoading = false;
  searchQuery = '';
  availableRoles: string[] = ['Admin', 'Employee', 'HR'];
  showSuccessBanner = false;
  successMessage = '';
  totalUsers = 0; // Will be calculated from allUsers

  constructor(private adminService: AdminService, private snackbarService: SnackbarService) {}

  ngOnInit(): void {
    this.loadUsers(); // Combine loading unassigned and all users
  }

  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users; // Store all users for total count
        this.totalUsers = this.allUsers.length; // Calculate total users
        // Filter only unassigned users (role is null, undefined, or 'Unassigned')
        this.users = users.filter(user => !user.role || user.role === 'Unassigned');
        this.filteredUsers = [...this.users]; // Initialize filtered list
        this.isLoading = false;
        if (this.users.length === 0) {
          this.snackbarService.showWarning('No unassigned users found.');
        }
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.snackbarService.showError('Error loading users. Please try again.');
        this.isLoading = false;
        this.totalUsers = 0; // Fallback to 0 if API fails
      }
    });
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }
    this.filteredUsers = this.users.filter(user =>
      user.fullName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.designation.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  assignRole(user: any): void {
    if (!user.id || !user.newRole) {
      this.snackbarService.showWarning('Please select a valid role.');
      return;
    }

    if (!this.availableRoles.includes(user.newRole)) {
      this.snackbarService.showWarning('Invalid role selected. Please choose Admin, Employee, or HR.');
      return;
    }

    this.isLoading = true;
    this.adminService.assignRole(user.id, user.newRole).subscribe({
      next: (response: { message?: string }) => {
        if (response.message) {
          this.loadUsers(); // Refresh both unassigned and total users
          this.successMessage = `Role "${user.newRole}" assigned to ${user.fullName} successfully!`;
          this.showSuccessBanner = true;
          setTimeout(() => this.showSuccessBanner = false, 3000);
          this.snackbarService.showSuccess(this.successMessage);
        } else {
          console.error('Unexpected response format:', response);
          this.snackbarService.showError('Role assignment failed: Unexpected server response.');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to assign role', err);
        this.snackbarService.showError(`Role assignment failed: ${err.error?.error || 'An error occurred'}`);
        this.isLoading = false;
      }
    });
  }
}