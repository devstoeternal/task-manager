import { Injectable } from '@angular/core';
import { 
  HttpInterceptor, 
  HttpRequest, 
  HttpHandler, 
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add auth header if token exists and request is not for auth endpoints
    let authReq = req;
    const token = this.authService.getToken();
    
    if (token && !this.isAuthRequest(req.url)) {
      authReq = this.addTokenHeader(req, token);
    }

    return next.handle(authReq).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(authReq, next);
        }
        
        return throwError(() => error);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.authService.getRefreshToken();
      
      if (refreshToken) {
        return this.authService.refreshToken().pipe(
          switchMap((authResponse) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(authResponse.token);
            
            return next.handle(this.addTokenHeader(request, authResponse.token));
          }),
          catchError((error) => {
            this.isRefreshing = false;
            this.authService.logout();
            return throwError(() => error);
          })
        );
      } else {
        this.authService.logout();
        return throwError(() => new Error('No refresh token available'));
      }
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private isAuthRequest(url: string): boolean {
    return url.includes('/auth/login') || 
           url.includes('/auth/register') || 
           url.includes('/auth/refresh');
  }
}