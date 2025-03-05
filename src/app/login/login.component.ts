import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginDto = { email: '', password: '' };
  errorMessage: string | null = null;
  showPassword: boolean = false; // Track password visibility

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.loginDto).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('roleId', response.roleId?.toString() ?? '');
        if (response.message === 'Welcome to Admin Dashboard') {
          this.router.navigate(['/admin']);
        } else {
          this.errorMessage = response.message || 'Role not assigned yet';
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Login failed';
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.type = this.showPassword ? 'text' : 'password';
  }
}