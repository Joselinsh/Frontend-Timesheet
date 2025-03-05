import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerDto = {
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    dateOfBirth: null as string | null,
    department: '',
    designation: ''
  };
  errorMessage: string | null = null;
  showPassword: boolean = false; // Track password visibility

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    this.authService.register(this.registerDto).subscribe({
      next: (response) => {
        alert(response.message || 'Registration successful! Please wait for role assignment.');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Registration failed';
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.type = this.showPassword ? 'text' : 'password';
  }
}