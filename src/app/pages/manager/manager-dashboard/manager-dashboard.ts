import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelService, Hotel } from '../../../services/hotel.service';
import { BookingService, BookingResponse } from '../../../services/booking.service';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manager-dashboard.html',
  styleUrl: './manager-dashboard.css',
})
export class ManagerDashboard implements OnInit {
  hotel: Hotel | null = null;
  bookings: BookingResponse[] = [];
  todayCheckIns: BookingResponse[] = [];
  todayCheckOuts: BookingResponse[] = [];
  isLoading = false;
  activeTab: 'overview' | 'bookings' | 'checkins' | 'checkouts' = 'overview';

  constructor(
    private hotelService: HotelService,
    private bookingService: BookingService
  ) { }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    this.hotelService.getMyHotel().subscribe({
      next: (response) => {
        if (response.success) {
          this.hotel = response.data;
          this.loadBookingData(this.hotel.hotelId);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching hotel', err);
        this.isLoading = false;
      }
    });
  }

  loadBookingData(hotelId: number) {
    this.bookingService.getHotelBookings(hotelId).subscribe(data => this.bookings = data);
    this.bookingService.getTodayCheckIns(hotelId).subscribe(data => this.todayCheckIns = data);
    this.bookingService.getTodayCheckOuts(hotelId).subscribe(data => this.todayCheckOuts = data);
  }

  checkIn(bookingId: number) {
    if (!confirm('Confirm Check-In?')) return;
    this.bookingService.checkIn(bookingId).subscribe({
      next: () => {
        // Optimistic update
        const booking = this.bookings.find(b => b.id === bookingId);
        if (booking) booking.status = 'CHECKED_IN';
        const todayBooking = this.todayCheckIns.find(b => b.id === bookingId);
        if (todayBooking) todayBooking.status = 'CHECKED_IN';

        this.loadDashboardData();
      },
      error: (err) => console.error('Check-in failed', err)
    });
  }

  checkOut(bookingId: number) {
    if (!confirm('Confirm Check-Out?')) return;
    this.bookingService.checkOut(bookingId).subscribe({
      next: () => {
        // Optimistic update
        const booking = this.bookings.find(b => b.id === bookingId);
        if (booking) booking.status = 'CHECKED_OUT';
        const todayBooking = this.todayCheckOuts.find(b => b.id === bookingId);
        if (todayBooking) todayBooking.status = 'CHECKED_OUT';

        this.loadDashboardData();
      },
      error: (err) => console.error('Check-out failed', err)
    });
  }

  setActiveTab(tab: 'overview' | 'bookings' | 'checkins' | 'checkouts') {
    this.activeTab = tab;
  }
}
