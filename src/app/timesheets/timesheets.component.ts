import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../employee.service';
import { Timesheet } from '../models/employee.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-timesheets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.css'],
})
export class TimesheetsComponent implements OnInit {
  timesheets: Timesheet[] = [];
  newTimesheet: Partial<Timesheet> = {
    projectName: '',
    date: '',
    hoursWorked: 0,
    description: '',
  };
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  editingTimesheet: Timesheet | null = null;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.fetchTimesheets();
  }

  fetchTimesheets(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.employeeService.getTimesheets().subscribe({
      next: (response) => {
        this.timesheets = response;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to fetch timesheets:', err);
        this.errorMessage = `Failed to load timesheets: ${err.status} - ${err.statusText || err.message}`;
        this.isLoading = false;
      },
    });
  }

  submitTimesheet(): void {
    if (!this.newTimesheet.projectName || !this.newTimesheet.date || !this.newTimesheet.hoursWorked) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.employeeService.submitTimesheet(this.newTimesheet).subscribe({
      next: (response) => {
        this.timesheets.push(response);
        this.newTimesheet = { projectName: '', date: '', hoursWorked: 0, description: '' };
        this.successMessage = 'Timesheet submitted successfully!';
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to submit timesheet:', err);
        this.errorMessage = `Failed to submit timesheet: ${err.status} - ${err.statusText || err.message}`;
        this.isLoading = false;
      },
    });
  }

  startEditing(timesheet: Timesheet): void {
    if (timesheet.status !== 'Pending') {
      this.errorMessage = 'Only pending timesheets can be edited.';
      return;
    }
    this.editingTimesheet = { ...timesheet };
  }

  updateTimesheet(): void {
    if (!this.editingTimesheet) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.employeeService.updateTimesheet(this.editingTimesheet.timesheetId, this.editingTimesheet).subscribe({
      next: (response) => {
        const index = this.timesheets.findIndex(t => t.timesheetId === this.editingTimesheet!.timesheetId);
        if (index !== -1) {
          this.timesheets[index] = response;
        }
        this.editingTimesheet = null;
        this.successMessage = 'Timesheet updated successfully!';
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to update timesheet:', err);
        this.errorMessage = `Failed to update timesheet: ${err.status} - ${err.statusText || err.message}`;
        this.isLoading = false;
      },
    });
  }

  deleteTimesheet(timesheetId: number): void {
    const timesheet = this.timesheets.find(t => t.timesheetId === timesheetId);
    if (!timesheet || timesheet.status !== 'Pending') {
      this.errorMessage = 'Only pending timesheets can be deleted.';
      return;
    }

    if (!confirm('Are you sure you want to delete this timesheet?')) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.employeeService.deleteTimesheet(timesheetId).subscribe({
      next: () => {
        this.timesheets = this.timesheets.filter(t => t.timesheetId !== timesheetId);
        this.successMessage = 'Timesheet deleted successfully!';
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to delete timesheet:', err);
        this.errorMessage = `Failed to delete timesheet: ${err.status} - ${err.statusText || err.message}`;
        this.isLoading = false;
      },
    });
  }

  cancelEdit(): void {
    this.editingTimesheet = null;
    this.errorMessage = null;
  }
}