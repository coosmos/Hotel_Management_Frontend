import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Analytics } from '../../../services/analytics';
import { DashboardAnalytics } from '../../../services/analytics';
import { HotelAnalytics } from '../../../services/analytics';
import { RoomTypeAnalytics } from '../../../services/analytics';
import { RevenueByDate } from '../../../services/analytics';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  loading: boolean = false;
  error: string = '';

  // dashboard data
  dashboardStats: DashboardAnalytics | null = null;
  hotelAnalytics: HotelAnalytics[] = [];
  roomTypeAnalytics: RoomTypeAnalytics[] = [];
  revenueByDate: RevenueByDate[] = [];

  // chart configurations
  hotelRevenueChartData: ChartData<'bar'> | null = null;
  hotelRevenueChartOptions: ChartConfiguration<'bar'>['options'];
  hotelRevenueChartType: ChartType = 'bar';

  roomTypeChartData: ChartData<'doughnut'> | null = null;
  roomTypeChartOptions: ChartConfiguration<'doughnut'>['options'];
  roomTypeChartType: ChartType = 'doughnut';

  revenueLineChartData: ChartData<'line'> | null = null;
  revenueLineChartOptions: ChartConfiguration<'line'>['options'];
  revenueLineChartType: ChartType = 'line';

  constructor(private analyticsService:Analytics) {
    this.initializeChartOptions();
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  initializeChartOptions(): void {
    // hotel revenue bar chart options
    this.hotelRevenueChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return '₹' + context.parsed.y.toLocaleString('en-IN');
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => {
              return '₹' + Number(value).toLocaleString('en-IN', { 
                minimumFractionDigits: 0,
                maximumFractionDigits: 0 
              });
            }
          }
        }
      }
    };

    // room type doughnut chart options
    this.roomTypeChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = context.parsed;
              return label + ': ' + value + ' bookings';
            }
          }
        }
      }
    };

    // revenue line chart options
    this.revenueLineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return context.dataset.label + ': ₹' + context.parsed.y.toLocaleString('en-IN');
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => {
              return '₹' + Number(value).toLocaleString('en-IN', { 
                minimumFractionDigits: 0,
                maximumFractionDigits: 0 
              });
            }
          }
        }
      }
    };
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = '';

    // load dashboard stats
    this.analyticsService.getDashboardAnalytics().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard data';
        this.loading = false;
        console.error('Error loading dashboard:', err);
      }
    });

    // load hotel analytics
    this.analyticsService.getHotelAnalytics().subscribe({
      next: (hotels) => {
        this.hotelAnalytics = hotels;
        this.prepareHotelRevenueChart(hotels);
      },
      error: (err) => {
        console.error('Error loading hotel analytics:', err);
      }
    });

    // load room type analytics
    this.analyticsService.getRoomTypeAnalytics().subscribe({
      next: (roomTypes) => {
        this.roomTypeAnalytics = roomTypes;
        this.prepareRoomTypeChart(roomTypes);
      },
      error: (err) => {
        console.error('Error loading room type analytics:', err);
      }
    });

    // load revenue by date (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    this.analyticsService.getRevenueByDateRange(
      this.formatDateForApi(startDate),
      this.formatDateForApi(endDate)
    ).subscribe({
      next: (revenue) => {
        this.revenueByDate = revenue;
        this.prepareRevenueLineChart(revenue);
      },
      error: (err) => {
        console.error('Error loading revenue data:', err);
      }
    });
  }

  prepareHotelRevenueChart(hotels: HotelAnalytics[]): void {
    const labels = hotels.map(h => h.hotelName);
    const data = hotels.map(h => h.totalRevenue);

    this.hotelRevenueChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Revenue',
          data: data,
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(153, 102, 255, 0.8)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 2
        }
      ]
    };
  }

  prepareRoomTypeChart(roomTypes: RoomTypeAnalytics[]): void {
    const labels = roomTypes.map(rt => rt.roomType);
    const data = roomTypes.map(rt => rt.bookingCount);

    this.roomTypeChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 2
        }
      ]
    };
  }

  prepareRevenueLineChart(revenueData: RevenueByDate[]): void {
    const labels = revenueData.map(r => this.formatDate(r.date));
    const revenue = revenueData.map(r => r.revenue);
    const bookings = revenueData.map(r => r.bookingCount);

    this.revenueLineChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Revenue (₹)',
          data: revenue,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: 'Bookings',
          data: bookings,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    };

    // update chart options for dual axis
    this.revenueLineChartOptions = {
      ...this.revenueLineChartOptions,
      scales: {
        y: {
          type: 'linear',
          position: 'left',
          beginAtZero: true,
          ticks: {
            callback: (value) => {
              return '₹' + Number(value).toLocaleString('en-IN', { 
                minimumFractionDigits: 0,
                maximumFractionDigits: 0 
              });
            }
          }
        },
        y1: {
          type: 'linear',
          position: 'right',
          beginAtZero: true,
          grid: {
            drawOnChartArea: false
          },
          ticks: {
            callback: (value) => {
              return value.toString();
            }
          }
        }
      }
    };
  }

  formatCurrency(amount: number): string {
    return '₹' + amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  getRevenuePercentage(hotelRevenue: number): number {
    if (!this.dashboardStats || this.dashboardStats.totalRevenue === 0) {
      return 0;
    }
    return (hotelRevenue / this.dashboardStats.totalRevenue) * 100;
  }

  getBookingPercentage(count: number, total: number): number {
    if (total === 0) return 0;
    return (count / total) * 100;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatDateForApi(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}