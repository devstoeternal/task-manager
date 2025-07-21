import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ToastComponent, ToastData } from '../components/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  private show(data: ToastData): void {
    const config: MatSnackBarConfig = {
      duration: data.duration || 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['custom-toast'],
      data
    };

    this.snackBar.openFromComponent(ToastComponent, config);
  }

  success(message: string, action?: string, duration?: number): void {
    this.show({
      message,
      type: 'success',
      action,
      duration
    });
  }

  error(message: string, action?: string, duration?: number): void {
    this.show({
      message,
      type: 'error',
      action,
      duration: duration || 7000 // Longer duration for errors
    });
  }

  warning(message: string, action?: string, duration?: number): void {
    this.show({
      message,
      type: 'warning',
      action,
      duration
    });
  }

  info(message: string, action?: string, duration?: number): void {
    this.show({
      message,
      type: 'info',
      action,
      duration
    });
  }

  dismiss(): void {
    this.snackBar.dismiss();
  }
}