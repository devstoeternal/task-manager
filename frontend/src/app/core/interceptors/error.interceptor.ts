import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UI_LABELS } from '../../shared/constants/ui-labels.constants';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage: string = UI_LABELS.SERVER_ERROR; // Usar tipo base

        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = UI_LABELS.NETWORK_ERROR;
        } else {
          // Error del lado del servidor
          switch (error.status) {
            case 401:
              errorMessage = UI_LABELS.UNAUTHORIZED_ERROR;
              break;
            case 403:
              errorMessage = 'Acceso denegado';
              break;
            case 404:
              errorMessage = 'Recurso no encontrado';
              break;
            case 500:
              errorMessage = UI_LABELS.SERVER_ERROR;
              break;
            default:
              if (error.status === 0) {
                errorMessage = UI_LABELS.NETWORK_ERROR;
              } else {
                errorMessage = error.error?.message || UI_LABELS.SERVER_ERROR;
              }
          }
        }

        // Mostrar mensaje de error
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });

        return throwError(() => error);
      })
    );
  }
}