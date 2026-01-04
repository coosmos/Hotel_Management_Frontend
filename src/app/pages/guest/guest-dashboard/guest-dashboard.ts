import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService, BookingResponse } from '../../../services/booking.service';

@Component({
  selector: 'app-guest-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guest-dashboard.html',
  styleUrl: './guest-dashboard.css',
})
export class GuestDashboard implements OnInit {
  bookings: BookingResponse[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private bookingService: BookingService) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.bookingService.getUserBookings().subscribe({
      next: (response) => {
        if (response.success) {
          this.bookings = response.data;
        } else {
          this.error = response.message || 'Failed to load bookings.';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching bookings:', err);
        this.error = 'Failed to load bookings. Please try again later.';
        this.loading = false;
      }
    });
  }

  cancelBooking(bookingId: number): void {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    this.bookingService.cancelBooking(bookingId).subscribe({
      next: (response) => {
        // update the specific booking in the list
        const bookingIndex = this.bookings.findIndex(b => b.id === bookingId);
        if (bookingIndex !== -1) {
          // Optimistic update or fetch updated object if returned
          this.bookings[bookingIndex].status = 'CANCELLED';
        }
        alert('Booking cancelled successfully');
      },
      error: (err) => {
        console.error('Error cancelling booking:', err);
        alert('Failed to cancel booking');
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'CONFIRMED': return 'status-confirmed';
      case 'CHECKED_IN': return 'status-checked-in';
      case 'CANCELLED': return 'status-cancelled';
      case 'COMPLETED': return 'status-completed';
      default: return 'status-default';
    }
  }
}
