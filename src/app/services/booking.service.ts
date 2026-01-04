import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    hotelName: string;
    roomNumber: string;
    roomType: string;
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

    getUserBookings(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/my-bookings`);
    }
}
