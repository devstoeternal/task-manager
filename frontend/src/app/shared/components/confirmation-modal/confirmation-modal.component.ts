import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmationData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  icon?: string;
}

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-3">
          <div [ngClass]="getIconClasses()" class="flex items-center justify-center w-10 h-10 rounded-full">
            <mat-icon class="text-white">{{ data.icon || getDefaultIcon() }}</mat-icon>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ data.title }}
          </h2>
        </div>
        <button 
          mat-icon-button 
          (click)="onCancel()"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ data.message }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end space-x-3 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl">
        <button
          type="button"
          (click)="onCancel()"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
          {{ data.cancelText || 'Cancelar' }}
        </button>
        <button
          type="button"
          (click)="onConfirm()"
          [ngClass]="getConfirmButtonClasses()"
          class="px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors">
          {{ data.confirmText || 'Confirmar' }}
        </button>
      </div>
    </div>
  `
})
export class ConfirmationModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getIconClasses(): string {
    switch (this.data.type) {
      case 'danger':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  }

  getDefaultIcon(): string {
    switch (this.data.type) {
      case 'danger':
        return 'warning';
      case 'warning':
        return 'info';
      case 'info':
        return 'info';
      default:
        return 'help';
    }
  }

  getConfirmButtonClasses(): string {
    switch (this.data.type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
      default:
        return 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500';
    }
  }
}