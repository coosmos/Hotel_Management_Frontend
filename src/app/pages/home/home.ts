import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SearchParams, SearchBarComponent } from '../../shared/search-bar/search-bar';
@Component({
  selector: 'app-home',
  imports: [SearchBarComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {

  constructor(private router: Router) { }

  handleSearch(searchParams: SearchParams): void {
    console.log('Search params:', searchParams);
    this.router.navigate(['/search-results'], {
      queryParams: {
        city: searchParams.city,
        checkIn: searchParams.checkInDate,
        checkOut: searchParams.checkOutDate
      }
    });
  }
}