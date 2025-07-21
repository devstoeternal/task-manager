import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface ToastData {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  action?: string;
  duration?: number;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div [ngClass]="getToastClasses()" class="flex items-center justify-between p-4 rounded-lg shadow-lg min-w-80 max-w-md">
      <div class="flex items-center space-x-3">
        <div [ngClass]="getIconContainerClasses()" class="flex items-center justify-center w-8 h-8 rounded-full">
          <mat-icon [ngClass]="getIconClasses()" class="text-sm">{{ getIcon() }}</mat-icon>
        </div>
        <span [ngClass]="getTextClasses()" class="font-medium">{{ data.message }}</span>
      </div>
      
      <div class="flex items-center space-x-2 ml-4">
        <button 
          *ngIf="data.action"
          (click)="onAction()"
          [ngClass]="getActionButtonClasses()"
          class="text-sm font-medium px-3 py-1 rounded transition-colors">
          {{ data.action }}
        </button>
        <button 
          (click)="dismiss()"
          [ngClass]="getCloseButtonClasses()"
          class="p-1 rounded-full hover:bg-black/10 transition-colors">
          <mat-icon class="text-sm">close</mat-icon>
        </button>
      </div>
    </div>
  `
})
export class ToastComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<ToastComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: ToastData
  ) {}

  onAction(): void {
    this.snackBarRef.dismissWithAction();
  }

  dismiss(): void {
    this.snackBarRef.dismiss();
  }

  getToastClasses(): string {
    switch (this.data.type) {
      case 'success':
        return 'bg-green-50 border border-green-200';
      case 'error':
        return 'bg-red-50 border border-red-200';
      case 'warning':
        return 'bg-yellow-50 border border-yellow-200';
      case 'info':
        return 'bg-blue-50 border border-blue-200';
      default:
        return 'bg-gray-50 border border-gray-200';
    }
  }

  getIconContainerClasses(): string {
    switch (this.data.type) {
      case 'success':
        return 'bg-green-100';
      case 'error':
        return 'bg-red-100';
      case 'warning':
        return 'bg-yellow-100';
      case 'info':
        return 'bg-blue-100';
      default:
        return 'bg-gray-100';
    }
  }

  getIconClasses(): string {
    switch (this.data.type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  }

  getTextClasses(): string {
    switch (this.data.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  }

  getActionButtonClasses(): string {
    switch (this.data.type) {
      case 'success':
        return 'text-green-700 hover:bg-green-100';
      case 'error':
        return 'text-red-700 hover:bg-red-100';
      case 'warning':
        return 'text-yellow-700 hover:bg-yellow-100';
      case 'info':
        return 'text-blue-700 hover:bg-blue-100';
      default:
        return 'text-gray-700 hover:bg-gray-100';
    }
  }

  getCloseButtonClasses(): string {
    switch (this.data.type) {
      case 'success':
        return 'text-green-600 hover:text-green-800';
      case 'error':
        return 'text-red-600 hover:text-red-800';
      case 'warning':
        return 'text-yellow-600 hover:text-yellow-800';
      case 'info':
        return 'text-blue-600 hover:text-blue-800';
      default:
        return 'text-gray-600 hover:text-gray-800';
    }
  }

  getIcon(): string {
    switch (this.data.type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'notifications';
    }
  }
}