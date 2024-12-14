import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError, map } from 'rxjs';
import { IApiResponse } from '../interfaces/i-api-response';
import { BaseHttpService } from './base-http.service';
import { IRoom } from '../interfaces/i-room';
import { AuthenticationService } from './authentication.service';
import { IBooking } from '../interfaces/i-booking';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private baseHttpService: BaseHttpService,
    private authService: AuthenticationService
  ) {
    this.apiUrl = `${this.baseHttpService.baseURL}/api/v1/rooms`;
  }

  // Fetch rooms with optional filters
  getRooms(filters?: any): Observable<IRoom[]> {
    const sessionId = this.authService.sessionId;
    const headers = new HttpHeaders().set('X-Session', sessionId || '');
    let params = new HttpParams();

    // Applying filters to the request parameters
    if (filters) {
      if (filters.floor) params = params.set('floorNumber', filters.floor);
      if (filters.capacity)
        params = params.set('capacityType', filters.capacity);
      if (filters.status) params = params.set('roomStatus', filters.status);
      if (filters.hasProjector !== undefined)
        params = params.set('hasProjector', filters.hasProjector.toString());
    }

    return this.http
      .get<IApiResponse<IRoom[]>>(this.apiUrl, {
        headers,
        params,
        withCredentials: true,
      })
      .pipe(
        map((response: IApiResponse<IRoom[]>) => response.data || []),
        catchError(this.handleError)
      );
  }

  getRoomDetail(roomNumber: string): Observable<IRoom[]> {
    const sessionId = this.authService.sessionId;
    const headers = new HttpHeaders().set('X-Session', sessionId || '');

    return this.http
      .get<IApiResponse<IRoom[]>>(`${this.apiUrl}/${roomNumber}`, {
        headers,
        withCredentials: true,
      })
      .pipe(
        map((response: IApiResponse<IRoom[]>) => {
          return response.data || [];
        }),
        catchError(this.handleError)
      );
  }

  getSchedules(roomNumber: string): Observable<IBooking[]> {
    const sessionId = this.authService.sessionId;
    const headers = new HttpHeaders().set('X-Session', sessionId || '');

    return this.http
      .get<IApiResponse<IBooking[]>>(`${this.apiUrl}/${roomNumber}/schedule`, {
        headers,
      })
      .pipe(
        map((response) => {
          console.log('API Response:', response); // Log the full API response
          return response.data || []; // Return the data field or an empty array
        }),
        catchError(this.handleError)
      );
  }

  // Book a room
  bookRoom(roomNumber: string, bookingData: any): Observable<IApiResponse> {
    const sessionId = this.authService.sessionId;
    const headers = new HttpHeaders().set('X-Session', sessionId || '');

    return this.http
      .post<IApiResponse>(`${this.apiUrl}/${roomNumber}/book`, bookingData, {
        headers,
      })
      .pipe(
        catchError(this.handleError),
        map((response) => {
          console.log('Booking Response:', response);
          return response; // Returning response to use in the component
        })
      );
  }

  // Private error handling method
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
