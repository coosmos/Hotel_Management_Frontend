import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface DashboardAnalytics {
  totalBookings: number;
  totalRevenue: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  pendingPayments: number;
  averageBookingValue: number;
}

export interface HotelAnalytics {
  hotelId: number;
  hotelName: string;
  totalBookings: number;
  totalRevenue: number;
  activeBookings: number;
  averageBookingValue: number;
}

export interface RevenueByDate {
  date: string;
  bookingCount: number;
  revenue: number;
}

export interface RoomTypeAnalytics {
  roomType: string;
  bookingCount: number;
  totalRevenue: number;
  averagePrice: number;
}

@Injectable({
  providedIn: 'root',
})
export class Analytics {
  private apiUrl = 'http://localhost:9090/api/bookings/analytics';
  constructor(private http: HttpClient) { }

  //get all admin analytics
  getDashboardAnalytics(): Observable<DashboardAnalytics> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`)
      .pipe(map(response => response.data));
  }

  //get hotel analytics
  getHotelAnalytics(): Observable<HotelAnalytics[]> {
    return this.http.get<any>(`${this.apiUrl}/hotels`)
      .pipe(map(response => response.data));
  }

  //get hotel analytics by id
  getHotelAnalyticsById(hotelId: number): Observable<HotelAnalytics> {
    return this.http.get<any>(`${this.apiUrl}/hotels/${hotelId}`)
      .pipe(map(response => response.data));
  }
  // get revenu by date range
  getRevenueByDateRange(startDate: string, endDate: string): Observable<RevenueByDate[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<any>(`${this.apiUrl}/revenue`, { params })
      .pipe(map(response => response.data));
  }

  //get revenue by date range for a hotel
  getRevenueByDateRangeForHotel(hotelId: number, startDate: string, endDate: string): Observable<RevenueByDate[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<any>(`${this.apiUrl}/hotels/${hotelId}/revenue`, { params })
      .pipe(map(response => response.data));
  }

  //get room type analytics
  getRoomTypeAnalytics(): Observable<RoomTypeAnalytics[]> {
    return this.http.get<any>(`${this.apiUrl}/room-types`)
      .pipe(map(response => response.data));
  }

  //get room type analytics for a hotel
  getRoomTypeAnalyticsForHotel(hotelId: number): Observable<RoomTypeAnalytics[]> {
    return this.http.get<any>(`${this.apiUrl}/hotels/${hotelId}/room-types`)
      .pipe(map(response => response.data));
  }

}
