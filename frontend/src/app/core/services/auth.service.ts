import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthResponse, LoginRequest, RegisterRequest, JwtPayload } from '../models/auth.interface';
import { User, UserProfile } from '../models/user.interface';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constants';
import { UI_LABELS } from '../../shared/constants/ui-labels.constants';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  public isAuthenticated$ = this.token$.pipe(
    map(token => !!token && !this.isTokenExpired(token))
  );

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials)
      .pipe(
        tap(response => this.handleAuthSuccess(response)),
        catchError(error => this.handleAuthError(error))
      );
  }

  register(userData: RegisterRequest): Observable<string> {
    return this.http.post<string>(API_ENDPOINTS.AUTH.REGISTER, userData)
      .pipe(
        catchError(error => this.handleAuthError(error))
      );
  }

  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/auth/login']);
    this.snackBar.open(UI_LABELS.LOGOUT_SUCCESS, UI_LABELS.CLOSE, { duration: 3000 });
  }

  refreshToken(): Observable<AuthResponse> {
    const currentToken = this.getToken();
    if (!currentToken) {
      return throwError(() => new Error('No token available'));
    }

    return this.http.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, { token: currentToken })
      .pipe(
        tap(response => this.handleAuthSuccess(response)),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  getToken(): string | null {
    return this.tokenSubject.value || localStorage.getItem(environment.storageKeys.token);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  updateCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem(environment.storageKeys.user, JSON.stringify(user));
  }

  getUserProfile(): UserProfile | null {
    const user = this.getCurrentUser();
    if (!user) return null;

    return {
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
      initials: `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    };
  }

  private handleAuthSuccess(response: AuthResponse): void {
    const user: User = {
      id: response.id,
      username: response.username,
      email: response.email,
      firstName: '',
      lastName: '',
      role: 'USER',
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.tokenSubject.next(response.token);
    this.currentUserSubject.next(user);
    
    localStorage.setItem(environment.storageKeys.token, response.token);
    localStorage.setItem(environment.storageKeys.user, JSON.stringify(user));
  }

  private handleAuthError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 401) {
      errorMessage = 'Credenciales inválidas';
    } else if (error.status === 400) {
      errorMessage = 'Datos inválidos';
    } else if (error.status === 409) {
      errorMessage = 'El usuario ya existe';
    }

    this.snackBar.open(errorMessage, UI_LABELS.CLOSE, { 
      duration: 5000,
      panelClass: ['error-snackbar']
    });

    return throwError(() => error);
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(environment.storageKeys.token);
    const userData = localStorage.getItem(environment.storageKeys.user);

    if (token && !this.isTokenExpired(token) && userData) {
      try {
        const user = JSON.parse(userData);
        this.tokenSubject.next(token);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.clearAuthData();
      }
    } else {
      this.clearAuthData();
    }
  }

  private clearAuthData(): void {
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
    localStorage.removeItem(environment.storageKeys.token);
    localStorage.removeItem(environment.storageKeys.user);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      const now = Math.floor(new Date().getTime() / 1000);
      return payload.exp < now;
    } catch (error) {
      return true;
    }
  }

  private decodeToken(token: string): JwtPayload {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
}