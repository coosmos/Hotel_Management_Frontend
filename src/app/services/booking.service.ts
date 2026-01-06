import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from './hotel.service';

export interface BookingRequest {
    hotelId: number;
    roomType: string;
    checkInDate: string;
    checkOutDate: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    numberOfGuests: number;
}

export interface BookingResponse {
    id: number;
    hotelName: string | null;
    roomNumber: string | null;
    roomType: string | null;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
    status: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    numberOfGuests: number;
    numberOfNights: number;
    cancelledAt: string | null;
    checkedInAt: string | null;
    checkedOutAt: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    paymentStatus: string;
    paymentMethod: string | null;
    paidAt: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private apiUrl = 'http://localhost:9090/api/bookings';

    constructor(private http: HttpClient) { }

    createBooking(booking: BookingRequest): Observable<BookingResponse> {
        return this.http.post<BookingResponse>(this.apiUrl, booking);
    }

    cancelBooking(bookingId: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${bookingId}/cancel`, {});
    }

    getUserBookings(): Observable<ApiResponse<BookingResponse[]>> {
        return this.http.get<ApiResponse<BookingResponse[]>>(`${this.apiUrl}/my-bookings`);
    }

    // Manager/Receptionist Methods

    getHotelBookings(hotelId: number): Observable<BookingResponse[]> {
        return this.http.get<BookingResponse[]>(`${this.apiUrl}/hotel/${hotelId}`);
    }

    getTodayCheckIns(hotelId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/hotel/${hotelId}/today-checkins`);
    }

    getTodayCheckOuts(hotelId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/hotel/${hotelId}/today-checkouts`);
    }

    checkIn(bookingId: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${bookingId}/check-in`, {});
    }

    checkOut(bookingId: number, feedback: { rating?: number; feedback?: string } = {}): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${bookingId}/check-out`, feedback);
    }

    updatePaymentStatus(bookingId: number, status: string, method: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${bookingId}/payment`, {}, {
            params: { status, method }
        });
    }
}
