import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SnackbarService } from '../services/snackbar.services';
import { animate, style, transition, trigger } from '@angular/animations';

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
  assignedUsers: any[] = [];
  allUsers: any[] = [];
  isLoading = false;
  searchQuery = '';
  availableRoles: string[] = ['Admin', 'Employee', 'HR', 'Unassigned'];
  showSuccessBanner = false;
  successMessage = '';
  totalUsers = 0;
  showAssignedUsers = false;
  roleFilter = 'All';
  sortOption = 'fullName';
  sortDirection = 1; // 1 for ascending, -1 for descending
  itemsPerPage = 5;
  currentPage = 1;

  constructor(private adminService: AdminService, private snackbarService: SnackbarService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        console.log('Raw users from API:', users);
        this.allUsers = [...users];
        this.totalUsers = this.allUsers.length;
        this.users = users.filter(user => {
          const role = user.role?.toString().toLowerCase() || 'unassigned';
          return !role || role === 'unassigned' || role === '';
        });
        this.assignedUsers = users.filter(user => {
          const role = user.role?.toString() || '';
          return this.availableRoles.includes(role) && role !== 'Unassigned' && role !== '' && role !== null;
        });
        this.applyFiltersAndSort();
        this.isLoading = false;
        if (this.users.length === 0 && !this.showAssignedUsers) {
          this.snackbarService.showWarning('No unassigned users found.');
        }
        console.log('Unassigned users:', this.users);
        console.log('Assigned users:', this.assignedUsers);
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.snackbarService.showError('Error loading users. Please try again.');
        this.isLoading = false;
        this.totalUsers = 0;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1; // Reset to first page on search
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort(): void {
    let tempUsers = this.showAssignedUsers ? [...this.assignedUsers] : [...this.users];
    if (this.roleFilter !== 'All') {
      tempUsers = tempUsers.filter(user => user.role === this.roleFilter);
    }
    if (this.searchQuery.trim()) {
      tempUsers = tempUsers.filter(user =>
        user.fullName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.designation.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    tempUsers.sort((a, b) => {
      const valueA = a[this.sortOption];
      const valueB = b[this.sortOption];
      return this.sortDirection * (valueA > valueB ? 1 : -1);
    });
    this.filteredUsers = tempUsers.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  onRoleFilterChange(event: any): void {
    this.roleFilter = event.target.value;
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  onSortChange(event: any): void {
    this.sortOption = event.target.value;
    this.applyFiltersAndSort();
  }

  toggleSort(): void {
    this.sortDirection = this.sortDirection === 1 ? -1 : 1;
    this.applyFiltersAndSort();
  }

  nextPage(): void {
    const totalItems = this.showAssignedUsers ? this.assignedUsers.length : this.users.length;
    if (this.currentPage * this.itemsPerPage < totalItems) {
      this.currentPage++;
      this.applyFiltersAndSort();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFiltersAndSort();
    }
  }

  assignRole(user: any): void {
    if (!user.id || !user.newRole) {
      this.snackbarService.showWarning('Please select a valid role.');
      return;
    }

    if (!this.availableRoles.includes(user.newRole)) {
      this.snackbarService.showWarning('Invalid role selected. Please choose Admin, Employee, HR, or Unassigned.');
      return;
    }

    this.isLoading = true;
    this.adminService.assignRole(user.id, user.newRole).subscribe({
      next: (response: { message?: string }) => {
        if (response.message) {
          this.loadUsers();
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

  toggleUserView(): void {
    this.showAssignedUsers = !this.showAssignedUsers;
    this.roleFilter = 'All'; // Reset filter on toggle
    this.currentPage = 1; // Reset page on toggle
    this.applyFiltersAndSort();
  }
}