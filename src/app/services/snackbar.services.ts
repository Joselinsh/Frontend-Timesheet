import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['zoho-success'],
      verticalPosition: 'bottom', // Move to bottom to avoid overlapping with success banner
      horizontalPosition: 'center'
    });
  }

  showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000, // Increase duration for errors to ensure visibility
      panelClass: ['zoho-error'],
      verticalPosition: 'bottom',
      horizontalPosition: 'center'
    });
  }

  showWarning(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 4000, // Moderate duration for warnings
      panelClass: ['zoho-warning'],
      verticalPosition: 'bottom',
      horizontalPosition: 'center'
    });
  }
}