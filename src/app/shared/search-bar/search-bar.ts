import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SearchParams {
  city: string;
  checkInDate: string;
  checkOutDate: string;
}
@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBarComponent implements OnInit, OnChanges {
  @Input() initialValues?: SearchParams;
  @Output() onSearch = new EventEmitter<SearchParams>();

  searchParams: SearchParams = {
    city: '',
    checkInDate: '',
    checkOutDate: ''
  };
  ngOnInit(): void {
    // Pre-fill search params if provided
    if (this.initialValues) {
      this.searchParams = { ...this.initialValues };
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialValues'] && changes['initialValues'].currentValue) {
      this.searchParams = { ...changes['initialValues'].currentValue };
    }
  }

  // get today's date in YYYY-MM-DD format for min date validation
  get today(): string {
    return new Date().toISOString().split('T')[0];
  }

  // get tomorrow's date for default checkout
  get tomorrow(): string {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }

  // if checkout date is before checkin date, auto adjust checkout date to next day
  onCheckInChange(): void {
    if (this.searchParams.checkInDate && this.searchParams.checkOutDate) {
      if (this.searchParams.checkOutDate <= this.searchParams.checkInDate) {
        const nextDay = new Date(this.searchParams.checkInDate);
        nextDay.setDate(nextDay.getDate() + 1);
        this.searchParams.checkOutDate = nextDay.toISOString().split('T')[0];
      }
    }
  }

  handleSearch(): void {
    if (this.isFormValid()) {
      this.onSearch.emit(this.searchParams);
    }
  }

  isFormValid(): boolean {
    return !!(
      this.searchParams.city.trim() &&
      this.searchParams.checkInDate &&
      this.searchParams.checkOutDate &&
      this.searchParams.checkOutDate > this.searchParams.checkInDate
    );
  }

  formatDateForDisplay(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    };
    return date.toLocaleDateString('en-US', options);
  }
}
