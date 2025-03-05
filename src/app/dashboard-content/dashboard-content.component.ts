import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.css']
})
export class DashboardContentComponent implements OnInit, OnDestroy {
  totalUsers = 0;
  activeUsersChart: Chart | null = null;
  isLoading = false;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadActiveUsersData();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.totalUsers = users.length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.isLoading = false;
      }
    });
  }

  loadActiveUsersData(): void {
    const labels = ['Feb 21', 'Feb 22', 'Feb 23', 'Feb 24', 'Feb 25', 'Feb 26', 'Feb 27'];
    const data = [5, 7, 6, 9, 8, 10, 11];

    const ctx = document.getElementById('activeUsersChart') as HTMLCanvasElement;
    if (ctx && !this.activeUsersChart) {
      this.activeUsersChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Active Users',
            data: data,
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            tension: 0.4
          }]
        },
        options: {
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Number of Users' } },
            x: { title: { display: true, text: 'Date' } }
          },
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.activeUsersChart) {
      this.activeUsersChart.destroy();
    }
  }
}