import { Injectable } from '@angular/core';
import { ILogin } from '../interfaces/i-login';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseHttpService } from './base-http.service';
import { IApiResponse } from '../interfaces/i-api-response';

@Injectable()
export class AuthenticationService {
  private _sessionId: string = '';
  private _namaLengkap: string = '';
  private _userId: number = 0;
  private _isLoggedIn: boolean = false;

  constructor(
    private http: HttpClient,
    private baseHttpService: BaseHttpService
  ) {
    this.loadSession();    
  }

  login(loginData: ILogin): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
    };

    const body = JSON.stringify(loginData);
    return this.http
      .post<IApiResponse>(
        `${this.baseHttpService.baseURL}/api/v1/user/login`,
        body,
        {
          headers,
          observe: 'response',
        }
      )
      .pipe(
        tap((response) => {
          const sessionId = response.headers.get('X-Session');
          const namaLengkap = response.body?.data.namaLengkap;
          const userId = response.body?.data.userId; 

          if (sessionId) {
            this.sessionId = sessionId;
            this.namaLengkap = namaLengkap;
            this.userId = userId;
          }
        })
      );
  }

  get sessionId(): string {
    return this._sessionId || localStorage.getItem('sessionId') || '';
  }

  set sessionId(value: string) {
    this._sessionId = value;
    localStorage.setItem('sessionId', value);
  }

  get namaLengkap(): string {
    return this._namaLengkap || localStorage.getItem('namaLengkap') || '';
  }

  set namaLengkap(value: string) {
    this._namaLengkap = value;
    localStorage.setItem('namaLengkap', value);
  }

  get userId(): number {
    return this._userId || Number(localStorage.getItem('userId'));
  }

  set userId(value: number) {
    this._userId = value;
    localStorage.setItem('userId', value.toString());
  }

  sessionStart() {
    this._isLoggedIn = true;
  }

  isLoggedIn(): boolean {
    return this._isLoggedIn || !!localStorage.getItem('sessionId');
  }

  logout() {
    this._isLoggedIn = false;
    localStorage.removeItem('sessionId');
    localStorage.removeItem('namaLengkap');
  }

  loadSession(): void {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      this._sessionId = sessionId;
      this._isLoggedIn = true;
    }
  }

  get baseHttp(): BaseHttpService {
    return this.baseHttpService;
  }
}
