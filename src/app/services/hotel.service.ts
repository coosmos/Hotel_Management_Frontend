import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Hotel {
  hotelId: number;
  hotelName: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  contactNumber: string | null;
  email: string;
  starRating?: number;
  amenities: string;
  status: string;
  totalRooms: number;
  availableRoomsCount: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
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
export interface RoomType {
  roomType: string;
  pricePerNight: number;
  availableCount: number;
  maxOccupancy: number;
  description: string;
  amenities: string;
  bedType: string;
}
@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private apiUrl = 'http://localhost:9090/api';
  constructor(private http: HttpClient) { }

  //search hotel by city
  searchHotels(city: string, checkInDate: string, checkOutDate: string): Observable<ApiResponse<Hotel[]>> {
    let params = new HttpParams().set('city', city);
    if (checkInDate) params = params.set('checkInDate', checkInDate);
    if (checkOutDate) params = params.set('checkOutDate', checkOutDate);

    return this.http.get<ApiResponse<Hotel[]>>(`${this.apiUrl}/bookings/search-hotels`, { params });
  }
  //get hotel by id
  getHotelById(id: number): Observable<ApiResponse<Hotel>> {
    return this.http.get<ApiResponse<Hotel>>(`${this.apiUrl}/hotels/${id}`);
  }
  // get all active hotels
  getAllActiveHotels(): Observable<ApiResponse<Hotel[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/hotels/active`).pipe(
      map(response => ({
        ...response,
        data: response.data.map(h => ({
          ...h,
          hotelId: h.id, // map id to hotelId
          hotelName: h.name // map name to hotelName
        }))
      }))
    );
  }

  // get all hotels (admin)
  getAllHotels(): Observable<ApiResponse<Hotel[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/hotels`).pipe(
      map(response => ({
        ...response,
        data: response.data.map(h => ({
          ...h,
          hotelId: h.id,
          hotelName: h.name
        }))
      }))
    );
  }

  // create hotel
  createHotel(hotel: any): Observable<ApiResponse<Hotel>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/hotels`, hotel).pipe(
      map(response => ({
        ...response,
        data: {
          ...response.data,
          hotelId: response.data.id,
          hotelName: response.data.name
        }
      }))
    );
  }
  //get avaialble room types of a hotel
  getAvailableRoomTypes(hotelId: number, checkInDate: string, checkOutDate: string): Observable<RoomType[]> {
    const params = new HttpParams()
      .set('hotelId', hotelId.toString())
      .set('checkInDate', checkInDate)
      .set('checkOutDate', checkOutDate);

    return this.http.get<any>(`${this.apiUrl}/bookings/room-types`, { params })
      .pipe(map(response => response.data));
  }

  // get my hotel (for manager/receptionist)
  getMyHotel(): Observable<ApiResponse<Hotel>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/hotels/my-hotel`).pipe(
      map(response => ({
        ...response,
        data: {
          ...response.data,
          hotelId: response.data?.id,
          hotelName: response.data?.name,
          availableRoomsCount: response.data?.availableRooms // Map availableRooms to availableRoomsCount
        }
      }))
    );
  }
}
