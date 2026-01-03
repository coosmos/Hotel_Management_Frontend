import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingService, BookingRequest, BookingResponse } from '../../../services/booking.service';

@Component({
  selector: 'app-booking-confirm',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-confirm.html',
  styleUrl: './booking-confirm.css',
})
export class BookingConfirm implements OnInit {
  bookingForm: FormGroup;
  loading: boolean = false;
  error: string = '';
  bookingSuccess: BookingResponse | null = null;

  hotelId: number = 0;
  roomType: string = '';
  checkInDate: string = '';
  checkOutDate: string = '';
  pricePerNight: number = 0;
  totalPrice: number = 0;
  nights: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private bookingService: BookingService
  ) {
    this.bookingForm = this.fb.group({
      guestName: ['', [Validators.required, Validators.minLength(3)]],
      guestEmail: ['', [Validators.required, Validators.email]],
      guestPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      numberOfGuests: [1, [Validators.required, Validators.min(1), Validators.max(4)]] // Default max 4, can be dynamic
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.hotelId = +params['hotelId'];
      this.roomType = params['roomType'];
      this.checkInDate = params['checkIn'];
      this.checkOutDate = params['checkOut'];
      this.pricePerNight = +params['price'];

      this.calculateTotal();
    });
  }

  calculateTotal(): void {
    if (this.checkInDate && this.checkOutDate) {
      const start = new Date(this.checkInDate);
      const end = new Date(this.checkOutDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      this.nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (this.nights < 1) this.nights = 1;
    }
    this.totalPrice = this.pricePerNight * this.nights;
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const bookingRequest: BookingRequest = {
      hotelId: this.hotelId,
      roomType: this.roomType,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
      guestName: this.bookingForm.value.guestName,
      guestEmail: this.bookingForm.value.guestEmail,
      guestPhone: this.bookingForm.value.guestPhone,
      numberOfGuests: this.bookingForm.value.numberOfGuests
    };

    this.bookingService.createBooking(bookingRequest).subscribe({
      next: (response) => {
        this.bookingSuccess = response;
        this.loading = false;
        window.scrollTo(0, 0);
      },
      error: (err) => {
        console.error('Booking failed', err);
        this.error = 'Booking failed. Please try again later.';
        this.loading = false;
      }
    });
  }

  printReceipt(): void {
    window.print();
  }
}
