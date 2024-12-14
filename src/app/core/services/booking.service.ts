import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { IApiResponse } from '../interfaces/i-api-response';
import { IBooking } from '../interfaces/i-booking';
import { AuthenticationService } from './authentication.service';
import { IExtendBooking } from '../interfaces/i-extend';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = 'http://localhost:8080/api/v1/bookings'; // Adjust base URL if needed

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  // Get bookings for a user
  getMyBookings(userId: number): Observable<IBooking[]> {
    const sessionId = this.authService.sessionId;
    const headers = new HttpHeaders().set('X-Session', sessionId || '');

    return this.http
      .get<any>(`${this.apiUrl}/${userId}`, { headers, withCredentials: true })
      .pipe(
        map((response) => {
          // Ensure the response structure matches what you described
          if (response.success && Array.isArray(response.data)) {
            return response.data; // Return the bookings array
          }
          return []; // Return an empty array if no bookings are found
        })
      );
  }

  // Enter the booking confirmation code
  confirmBooking(
    bookingId: number,
    confirmationCode: number
  ): Observable<IApiResponse> {
    const sessionId = this.authService.sessionId;
    const headers = new HttpHeaders().set('X-Session', sessionId || '');

    return this.http.post<IApiResponse>(
      `${this.apiUrl}/${bookingId}/${confirmationCode}`,
      { headers, withCredentials: true }
    );
  }

  // Cancel a booking
  cancelBooking(bookingId: number): Observable<IApiResponse> {
    const sessionId = this.authService.sessionId;
    const headers = new HttpHeaders().set('X-Session', sessionId || '');

    return this.http.put<IApiResponse>(`${this.apiUrl}/${bookingId}/cancel`, {
      headers,
      withCredentials: true,
    });
  }

  // Extend a booking
  extendBooking(
    bookingId: number,
    extensionData: IExtendBooking
  ): Observable<IApiResponse> {
    const sessionId = this.authService.sessionId;
    const headers = new HttpHeaders().set('X-Session', sessionId || '');

    return this.http.put<IApiResponse>(
      `${this.apiUrl}/${bookingId}/extend`,
      extensionData,
      { headers, withCredentials: true }
    );
  }

  getAllBookings(): Observable<IBooking[]> {
    const sessionId = this.authService.sessionId;
    const headers = new HttpHeaders().set('X-Session', sessionId || '');

    return this.http
      .get<IApiResponse>(`${this.apiUrl}/all`, {
        headers,
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          // Ensure the response structure matches what you described
          if (response.success && Array.isArray(response.data)) {
            return response.data; // Return the bookings array
          }
          return []; // Return an empty array if no bookings are found
        })
      );
  }

  generateBookingCode(bookingId: number): Observable<IApiResponse> {
    console.log(localStorage.getItem('sessionId'));
    console.log(this.authService.sessionId);
    const sessionId = this.authService.sessionId;
    const headers = new HttpHeaders().set('X-Session', sessionId || '');

    return this.http.put<IApiResponse>(
      `${this.apiUrl}/${bookingId}/generate-code`, {},
      { headers, withCredentials: true }
    );
  }

  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client-side error: ${error.error.message}`;
      console.error('Client-side error:', error.error.message);
    } else {
      // Backend error
      console.error('Backend error:', error);

      switch (error.status) {
        case 400:
          errorMessage = 'Bad request. Please check the data you sent.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please log in again.';
          break;
        case 404:
          errorMessage =
            'Resource not found. The requested resource does not exist.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        default:
          errorMessage = `Server error: ${error.status}. Please contact support.`;
          break;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
