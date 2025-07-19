import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User, 
  TokenRefreshRequest,
  ApiResponse 
} from '../../shared/models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  /**
   * Initialize authentication state from localStorage
   */
  private initializeAuth(): void {
    const token = this.getToken();
    const user = this.getCurrentUser();
    
    if (token && user) {
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  /**
   * Login user with email and password
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.API_URL}/login`, credentials)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            this.setAuthData(response.data);
            return response.data;
          }
          throw new Error(response.message || 'Login failed');
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Register new user
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.API_URL}/register`, userData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            this.setAuthData(response.data);
            return response.data;
          }
          throw new Error(response.message || 'Registration failed');
        }),
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Refresh authentication token
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const request: TokenRefreshRequest = { refreshToken };
    
    return this.http.post<ApiResponse<AuthResponse>>(`${this.API_URL}/refresh`, request)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            this.setAuthData(response.data);
            return response.data;
          }
          throw new Error(response.message || 'Token refresh failed');
        }),
        catchError(error => {
          console.error('Token refresh error:', error);
          this.logout();
          return throwError(() => error);
        })
      );
  }

  /**
   * Logout user and clear authentication data
   */
  logout(): void {
    // Call logout endpoint to invalidate token on server
    const token = this.getToken();
    if (token) {
      this.http.post(`${this.API_URL}/logout`, {}).subscribe({
        error: (error) => console.error('Logout error:', error)
      });
    }

    this.clearAuthData();
    this.router.navigate(['/auth/login']);
  }

  /**
   * Get current authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Get current user data
   */
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.clearAuthData();
      }
    }
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Error parsing token:', error);
      return false;
    }
  }

  /**
   * Set authentication data in localStorage and update subjects
   */
  private setAuthData(authResponse: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, authResponse.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));

    this.currentUserSubject.next(authResponse.user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Clear all authentication data
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Update user profile
   */
  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.API_URL}/profile`, userData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            // Update stored user data
            localStorage.setItem(this.USER_KEY, JSON.stringify(response.data));
            this.currentUserSubject.next(response.data);
            return response.data;
          }
          throw new Error(response.message || 'Profile update failed');
        }),
        catchError(error => {
          console.error('Profile update error:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Change user password
   */
  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    const request = { oldPassword, newPassword };
    
    return this.http.post<ApiResponse<void>>(`${this.API_URL}/change-password`, request)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message || 'Password change failed');
          }
        }),
        catchError(error => {
          console.error('Password change error:', error);
          return throwError(() => error);
        })
      );
  }
}