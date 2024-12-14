import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IChangePassword } from '../interfaces/i-changepassword';
import { IApiResponse } from '../interfaces/i-api-response';
import { AuthenticationService } from './authentication.service';
import { IUser } from '../interfaces/i-user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/v1/user'; // Adjust to your API URL

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  getAllUsers(): Observable<IUser[]> {
    const sessionId = this.authService.sessionId;
    const headers = new HttpHeaders().set('X-Session', sessionId || '');

    return this.http
      .get<IApiResponse>(`${this.apiUrl}/all`, {
        headers,
        withCredentials: true,
      })
      .pipe(map((response: IApiResponse) => response.data || []));
  }

  getUserDetail(userId: number): Observable<IUser> {
    const sessionId = this.authService.sessionId;
    const headers = new HttpHeaders().set('X-Session', sessionId || '');

    return this.http
      .get<IApiResponse>(`${this.apiUrl}/${userId}`, {
        headers,
        withCredentials: true,
      })
      .pipe(map((response: IApiResponse) => response.data || []));
  }

  changePassword(
    userId: number,
    passwordData: IChangePassword
  ): Observable<IApiResponse> {
    const sessionId = this.authService.sessionId;
    const headers = new HttpHeaders().set('X-Session', sessionId || '');

    return this.http.put<any>(
      `${this.apiUrl}/${userId}/change-password`,
      passwordData,
      {
        headers,
      }
    );
  }

  // Register a new user
  registerUser(registerData: any): Observable<IApiResponse> {
    const sessionId = this.authService.sessionId;
    const headers = new HttpHeaders().set('X-Session', sessionId || '');

    return this.http.post<IApiResponse>(
      `${this.apiUrl}/register`,
      registerData,
      { headers, withCredentials: true }
    );
  }

  // Delete a user by ID
  deleteUser(userId: number): Observable<IApiResponse> {
    const sessionId = this.authService.sessionId;
    const headers = new HttpHeaders().set('X-Session', sessionId || '');

    return this.http.delete<IApiResponse>(`${this.apiUrl}/${userId}`, {
      headers,
      withCredentials: true,
    });
  }
}
