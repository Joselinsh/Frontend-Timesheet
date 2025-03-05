import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-assign-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-roles.component.html',
  styleUrls: ['./assign-roles.component.css']
})
export class AssignRolesComponent implements OnInit {
  users: any[] = [];
  isLoading = false;

  constructor(private adminService: AdminService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users.map(user => ({
          ...user,
          newRole: user.role || 'Unassigned' // Default to current role or "Unassigned" if none
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.snackBar.open('Error loading users. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['bg-red-600', 'text-white'], // Red for errors, matching Zoho warn color
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.isLoading = false;
      }
    });
  }

  assignRole(user: any): void {
    if (!user.id || !user.newRole) {
      console.error('Invalid user or role:', user);
      this.snackBar.open('Please select a valid user and role.', 'Close', {
        duration: 3000,
        panelClass: ['bg-yellow-600', 'text-white'], // Yellow for warnings, matching Zoho accent
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
      return;
    }

    console.log('Assigning role:', { userId: user.id, role: user.newRole });
    this.isLoading = true;
    this.adminService.assignRole(user.id, user.newRole).subscribe({
      next: (response: { message?: string }) => {
        if (response.message) {
          this.loadUsers(); // Refresh the list after role assignment
          this.snackBar.open(`Role "${user.newRole}" assigned to ${user.fullName} successfully!`, 'Close', {
            duration: 3000,
            panelClass: ['bg-zoho-blue', 'text-white'], // Navy blue for success, matching Zoho primary
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        } else {
          console.error('Unexpected response format:', response);
          this.snackBar.open('Role assignment failed: Unexpected server response.', 'Close', {
            duration: 3000,
            panelClass: ['bg-red-600', 'text-white'], // Red for errors
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to assign role', err);
        this.snackBar.open(`Role assignment failed: ${err.error?.error || 'An error occurred'}`, 'Close', {
          duration: 3000,
          panelClass: ['bg-red-600', 'text-white'], // Red for errors
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.isLoading = false;
      }
    });
  }
}