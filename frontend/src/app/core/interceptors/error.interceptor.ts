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
        let errorMessage = 'Ha ocurrido un error inesperado';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          switch (error.status) {
            case 0:
              errorMessage = 'No se puede conectar al servidor';
              break;
            case 400:
              errorMessage = error.error?.message || 'Solicitud inválida';
              break;
            case 401:
              errorMessage = 'No autorizado';
              break;
            case 403:
              errorMessage = 'Acceso denegado';
              break;
            case 404:
              errorMessage = 'Recurso no encontrado';
              break;
            case 409:
              errorMessage = error.error?.message || 'Conflicto en los datos';
              break;
            case 422:
              errorMessage = 'Datos de entrada inválidos';
              break;
            case 500:
              errorMessage = 'Error interno del servidor';
              break;
            default:
              if (error.error?.message) {
                errorMessage = error.error.message;
              }
          }
        }

        // Show error message (except for auth-related errors handled elsewhere)
        if (!req.url.includes('/auth/') || error.status !== 401) {
          this.snackBar.open(errorMessage, UI_LABELS.CLOSE, {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }

        return throwError(() => error);
      })
    );
  }
}