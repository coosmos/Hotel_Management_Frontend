import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService, Hotel, RoomType } from '../../../services/hotel.service';

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotel-details.html',
  styleUrl: './hotel-details.css',
})
export class HotelDetails implements OnInit {
  hotel: Hotel | null = null;
  roomTypes: RoomType[] = [];
  loading: boolean = true;
  error: string = '';

  checkInDate: string = '';
  checkOutDate: string = '';
  hotelId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService
  ) { }

  ngOnInit(): void {
    // Get hotelId from route params
    this.route.params.subscribe(params => {
      this.hotelId = +params['hotelId'];
      this.loadHotelDetails(this.hotelId);
    });

    // Get dates from query params
    this.route.queryParams.subscribe(params => {
      this.checkInDate = params['checkIn'] || '';
      this.checkOutDate = params['checkOut'] || '';

      if (this.hotelId && this.checkInDate && this.checkOutDate) {
        this.loadRoomTypes();
      }
    });
  }

  loadHotelDetails(id: number): void {
    this.hotelService.getHotelById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.hotel = response.data;
        } else {
          this.error = 'Hotel not found';
        }
      },
      error: (err) => {
        console.error('Error loading hotel:', err);
        this.error = 'Failed to load hotel details';
      }
    });
  }

  loadRoomTypes(): void {
    this.hotelService.getAvailableRoomTypes(this.hotelId, this.checkInDate, this.checkOutDate).subscribe({
      next: (data) => {
        this.roomTypes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading room types:', err);
        this.loading = false;
        // Not blocking if room types fail, just show empty
        this.roomTypes = [];
      }
    });
  }

  bookRoom(roomType: RoomType): void {
    // Navigate to booking confirmation
    this.router.navigate(['/booking-confirm'], {
      queryParams: {
        hotelId: this.hotelId,
        roomType: roomType.roomType,
        checkIn: this.checkInDate,
        checkOut: this.checkOutDate,
        price: roomType.pricePerNight
      }
    });
  }
}
