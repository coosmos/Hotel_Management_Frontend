import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService, Hotel } from '../../../services/hotel.service';
import { SearchBarComponent, SearchParams } from '../../../shared/search-bar/search-bar';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, SearchBarComponent],
  templateUrl: './search-results.html',
  styleUrl: './search-results.css'
})
export class SearchResultsComponent implements OnInit {
  hotels: Hotel[] = [];
  loading: boolean = false;
  error: string = '';

  searchParams: SearchParams = {
    city: '',
    checkInDate: '',
    checkOutDate: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchParams = {
        city: params['city'] || '',
        checkInDate: params['checkIn'] || '',
        checkOutDate: params['checkOut'] || ''
      };

      if (this.searchParams.city) {
        this.searchHotels();
      }
    });
  }

  searchHotels(): void {
    this.loading = true;
    this.error = '';

    this.hotelService.searchHotels(this.searchParams.city).subscribe({
      next: (response) => {
        if (response.success) {
          this.hotels = response.data;
          console.log('Hotels found:', this.hotels);
        } else {
          this.error = response.message || 'Failed to find hotels';
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load hotels. Please try again.';
        this.loading = false;
        console.error('Error fetching hotels:', err);
      }
    });
  }

  handleSearch(newSearchParams: SearchParams): void {
    this.router.navigate(['/search-results'], {
      queryParams: {
        city: newSearchParams.city,
        checkIn: newSearchParams.checkInDate,
        checkOut: newSearchParams.checkOutDate
      }
    });
  }

  getDefaultImage(): string {
    return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';
  }
}