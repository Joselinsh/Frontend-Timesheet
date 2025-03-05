import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ManageUsersComponent } from '../manage-users/manage-users.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, FormsModule, ManageUsersComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  showDropdown = false;
  userInitials: string = 'A';
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserInitials();
  }

  loadUserInitials(): void {
    const token = localStorage.getItem('token');
    if (token) {
      // Simulate fetching user data from token or AuthService (replace with real logic)
      const user = { fullName: 'Admin' }; // Default for admin@timesheet.com
      this.userInitials = this.generateInitials(user.fullName);
    }
  }

  generateInitials(fullName: string): string {
    if (!fullName) return 'A';
    const names = fullName.trim().split(' ');
    let initials = '';
    if (names.length >= 1) {
      initials += names[0].charAt(0).toUpperCase();
      if (names.length >= 2) {
        initials += names[1].charAt(0).toUpperCase();
      } else if (names[0].length >= 2) {
        initials += names[0].charAt(1).toUpperCase();
      }
    }
    return initials.length >= 2 ? initials : 'A';
  }

  toggleDarkMode(): void {
    document.documentElement.classList.toggle('dark');
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roleId');
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {}
}