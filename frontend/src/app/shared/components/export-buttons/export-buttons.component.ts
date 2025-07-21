import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

export type ExportFormat = 'pdf' | 'excel' | 'csv';

@Component({
  selector: 'app-export-buttons',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  template: `
    <div class="flex items-center space-x-2">
      <!-- Single Export Button -->
      <button
        *ngIf="!showMenu"
        mat-stroked-button
        [disabled]="loading"
        (click)="onExport(defaultFormat)"
        matTooltip="Exportar datos"
        class="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        <mat-icon *ngIf="!loading" class="text-lg">{{ getFormatIcon(defaultFormat) }}</mat-icon>
        <div *ngIf="loading" class="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
        <span>{{ loading ? 'Exportando...' : 'Exportar' }}</span>
      </button>

      <!-- Export Menu -->
      <button
        *ngIf="showMenu"
        mat-stroked-button
        [matMenuTriggerFor]="exportMenu"
        [disabled]="loading"
        matTooltip="Opciones de exportación"
        class="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        <mat-icon *ngIf="!loading" class="text-lg">download</mat-icon>
        <div *ngIf="loading" class="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
        <span>{{ loading ? 'Exportando...' : 'Exportar' }}</span>
        <mat-icon *ngIf="!loading" class="text-sm">arrow_drop_down</mat-icon>
      </button>

      <mat-menu #exportMenu="matMenu" class="mt-2">
        <button
          mat-menu-item
          *ngFor="let format of formats"
          (click)="onExport(format)"
          [disabled]="loading"
          class="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <mat-icon class="text-lg">{{ getFormatIcon(format) }}</mat-icon>
          <div class="flex flex-col items-start">
            <span class="font-medium">{{ getFormatLabel(format) }}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ getFormatDescription(format) }}</span>
          </div>
        </button>
      </mat-menu>
    </div>
  `
})
export class ExportButtonsComponent {
  @Input() formats: ExportFormat[] = ['pdf', 'excel', 'csv'];
  @Input() defaultFormat: ExportFormat = 'pdf';
  @Input() loading = false;
  @Input() showMenu = true;
  
  @Output() export = new EventEmitter<ExportFormat>();

  onExport(format: ExportFormat): void {
    this.export.emit(format);
  }

  getFormatIcon(format: ExportFormat): string {
    switch (format) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'excel':
        return 'table_chart';
      case 'csv':
        return 'description';
      default:
        return 'download';
    }
  }

  getFormatLabel(format: ExportFormat): string {
    switch (format) {
      case 'pdf':
        return 'PDF';
      case 'excel':
        return 'Excel';
      case 'csv':
        return 'CSV';
      default:
        return format.toUpperCase();
    }
  }

  getFormatDescription(format: ExportFormat): string {
    switch (format) {
      case 'pdf':
        return 'Documento portable';
      case 'excel':
        return 'Hoja de cálculo';
      case 'csv':
        return 'Valores separados por comas';
      default:
        return '';
    }
  }
}