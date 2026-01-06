<img width="1912" height="938" alt="image" src="https://github.com/user-attachments/assets/d068a756-2b3a-43f7-9e36-5a8fcf01f235" />
<img width="1918" height="933" alt="image" src="https://github.com/user-attachments/assets/c65fff0f-ac2c-46c4-9b4f-7c01cb606041" />
<img width="1910" height="937" alt="image" src="https://github.com/user-attachments/assets/bf39fb72-81ba-4d01-af47-4eecec99efba" />
<img width="1913" height="940" alt="image" src="https://github.com/user-attachments/assets/a763349f-5042-4c25-a513-c0787a4d7081" />
<img width="1911" height="941" alt="image" src="https://github.com/user-attachments/assets/e108ebd9-434a-425d-afa6-582791bc9745" />
<img width="1917" height="936" alt="image" src="https://github.com/user-attachments/assets/017f3e56-7f29-4e6c-9aec-4aee69a9cf03" />
<img width="1913" height="943" alt="image" src="https://github.com/user-attachments/assets/35310c1f-f02e-4698-a9dc-ade940e11b43" />
<img width="1906" height="941" alt="image" src="https://github.com/user-attachments/assets/eadcabe6-fc5c-42d1-bb70-b9da1043f188" />
<img width="1901" height="936" alt="image" src="https://github.com/user-attachments/assets/5bdbbe01-e1ad-46b4-9f9e-475d1909096e" />
<img width="1908" height="931" alt="image" src="https://github.com/user-attachments/assets/57b26e88-3ae9-4ce2-9942-ad9ba0d79c90" />
<img width="1917" height="934" alt="image" src="https://github.com/user-attachments/assets/402581fc-6ca3-429a-a137-1b0dfabaa0d0" />
<img width="603" height="854" alt="image" src="https://github.com/user-attachments/assets/ad77805b-2c68-40f5-8edb-7daad00495cb" />

# Hotel Management Frontend

Angular 18 application for the Hotel Management System.

## Features

### Guest
- **Search**: Search hotels by city and date range.
- **Booking**: View hotel details, room types, and create bookings.
- **Dashboard**: View personal booking history and cancel bookings.

### Manager & Receptionist
- **Dashboard**: View hotel details and operational statistics (total rooms, available rooms, today's check-ins/check-outs).
- **Booking Management**: List all bookings for the assigned hotel.
- **Operations**: Perform check-in and check-out actions.
- **Optimistic Updates**: Dashboard lists update immediately upon action confirmation.

### Admin
- **Operations**: Manage hotel and user data.

## Technical Implementation

### Core
- **Framework**: Angular 18 using Standalone Components.
- **HTTP**: `HttpClient` interaction via dedicated services (`HotelService`, `BookingService`).
- **Security**: `AuthInterceptor` attaches JWT Bearer token to requests. User context (`X-User-Id`, etc.) is handled by the backend API Gateway.

### Services
- **HotelService**: Manages hotel data retrieval and mapping. Handles `id` vs `hotelId` property mapping for frontend consistency.
- **BookingService**: Manages booking operations. Returns typed `BookingResponse` objects including nullable fields.

### State Management
- **Local State**: Component-level state management with optimistic UI updates in dashboards.
- **User Store**: `UserStore` service manages local storage persistence for session data.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   ng serve
   ```
3. Application runs on `http://localhost:4200`.
