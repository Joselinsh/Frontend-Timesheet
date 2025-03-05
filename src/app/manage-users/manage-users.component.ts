import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  users: any[] = [];
  showViewModal = false;
  viewedUser: any = {};
  currentPage = 1;
  itemsPerPage = 10;
  isLoading = false;
  sortOption = 'fullName'; // Default sort by fullName (Alphabetical Order)
  sortDirection = 1; // 1 for ascending, -1 for descending

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = this.sortUsers(users, this.sortOption, this.sortDirection);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.isLoading = false;
      }
    });
  }

  viewUser(user: any): void {
    this.viewedUser = { ...user };
    this.showViewModal = true;
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Failed to delete user', err)
      });
    }
  }

  closeViewModal(): void {
    this.showViewModal = false;
  }

  // Filter by role with typed event
  onRoleFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.filterByRole(target.value);
    }
  }

  // Filter by role
  filterByRole(role: string): void {
    this.isLoading = true;
    if (role === 'All') {
      this.loadUsers(); // Reset to full list, sorted
    } else {
      this.adminService.getAllUsers().subscribe({
        next: (users) => {
          this.users = this.sortUsers(users.filter(u => u.role === role), this.sortOption, this.sortDirection);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to filter users', err);
          this.isLoading = false;
        }
      });
    }
  }

  // Sort users by fullName or User ID
  sortUsers(users: any[], sortBy: string, direction: number): any[] {
    return users.sort((a, b) => {
      if (sortBy === 'id') {
        return direction * (a.id - b.id);
      } else {
        return direction * a.fullName.localeCompare(b.fullName);
      }
    });
  }

  // Toggle sort direction and update sort
  toggleSort(): void {
    this.sortDirection *= -1; // Reverse direction
    this.users = this.sortUsers([...this.users], this.sortOption, this.sortDirection);
  }

  // Change sort option (Alphabetical Order or User ID)
  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.sortOption = target.value;
      this.sortDirection = 1; // Reset to ascending for new sort option
      this.users = this.sortUsers([...this.users], this.sortOption, this.sortDirection);
    }
  }

  get paginatedUsers(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.users.slice(start, start + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.users.length) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  exportToCSV(): void {
    const csv = this.users.map(user => `${user.fullName},${user.email},${user.role},${user.department},${user.designation}`).join('\n');
    const blob = new Blob([`Full Name,Email,Role,Department,Designation\n${csv}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
  }
}