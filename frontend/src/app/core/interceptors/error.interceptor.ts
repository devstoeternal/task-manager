import { Injectable } from '@angular/core';
import { 
  HttpInterceptor, 
  HttpRequest, 
  HttpHandler, 
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UI_LABELS } from '../../shared/constants/ui-labels.constants';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = UI_LABELS.SERVER_ERROR;

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = UI_LABELS.NETWORK_ERROR;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = error.error?.message || 'Solicitud inválida';
              break;
            case 401:
              errorMessage = UI_LABELS.UNAUTHORIZED_ERROR;
              break;
            case 403:
              errorMessage = 'Acceso denegado';
              break;
            case 404:
              errorMessage = 'Recurso no encontrado';
              break;
            case 422:
              errorMessage = error.error?.message || 'Datos de entrada inválidos';
              break;
            case 500:
              errorMessage = UI_LABELS.SERVER_ERROR;
              break;
            case 0:
              errorMessage = UI_LABELS.NETWORK_ERROR;
              break;
            default:
              errorMessage = error.error?.message || UI_LABELS.SERVER_ERROR;
          }
        }

        // Show error message to user (except for 401 errors which are handled by auth interceptor)
        if (error.status !== 401) {
          this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }

        return throwError(() => error);
      })
    );
  }
}