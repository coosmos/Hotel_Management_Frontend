import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Hotel {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  contactNumber: string;
  email: string;
  starRating: number;
  amenities: string;
  status: string;
  totalRooms: number;
  availableRooms: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string | null;
}

export interface SearchParams {
  city: string;
  checkInDate: string;
  checkOutDate: string;
}
@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private apiUrl = 'http://localhost:9090/api/hotels';
  constructor(private http: HttpClient) { }

  //search hotel by city
  searchHotels(city: string): Observable<ApiResponse<Hotel[]>> {
    const params = new HttpParams().set('city', city);
    return this.http.get<ApiResponse<Hotel[]>>(`${this.apiUrl}/search`, { params });
  }
  //get hotel by id
  getHotelById(id: number): Observable<ApiResponse<Hotel>> {
    return this.http.get<ApiResponse<Hotel>>(`${this.apiUrl}/${id}`);
  }
  // get all active hotels
  getAllActiveHotels(): Observable<ApiResponse<Hotel[]>> {
    return this.http.get<ApiResponse<Hotel[]>>(`${this.apiUrl}/active`);
  }
}
