import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { TaskFilter, TaskStatus, TaskPriority } from '../../../core/models/task.interface';

@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <mat-card class="filters-card">
      <mat-card-content>
        <form [formGroup]="filtersForm" class="filters-form">
          <div class="search-section">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar tareas</mat-label>
              <input matInput formControlName="search" placeholder="Buscar por título o descripción">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>

          <div class="filters-row">
            <mat-form-field appearance="outline">
              <mat-label>Estados</mat-label>
              <mat-select formControlName="status" multiple>
                <mat-option value="TODO">Por Hacer</mat-option>
                <mat-option value="IN_PROGRESS">En Progreso</mat-option>
                <mat-option value="IN_REVIEW">En Revisión</mat-option>
                <mat-option value="DONE">Completada</mat-option>
                <mat-option value="CANCELLED">Cancelada</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Prioridades</mat-label>
              <mat-select formControlName="priority" multiple>
                <mat-option value="LOW">Baja</mat-option>
                <mat-option value="MEDIUM">Media</mat-option>
                <mat-option value="HIGH">Alta</mat-option>
                <mat-option value="URGENT">Urgente</mat-option>
              </mat-select>
            </mat-form-field>

            <div class="filter-actions">
              <button mat-icon-button type="button" (click)="clearFilters()" 
                      matTooltip="Limpiar filtros">
                <mat-icon>clear</mat-icon>
              </button>
            </div>
          </div>

          <div class="active-filters" *ngIf="hasActiveFilters()">
            <span class="filter-label">Filtros activos:</span>
            
            <mat-chip-set>
              <mat-chip *ngFor="let status of selectedStatuses" 
                       (removed)="removeStatusFilter(status)">
                {{ getStatusLabel(status) }}
                <mat-icon matChipRemove>cancel</mat-icon>
              </mat-chip>
              
              <mat-chip *ngFor="let priority of selectedPriorities" 
                       (removed)="removePriorityFilter(priority)">
                {{ getPriorityLabel(priority) }}
                <mat-icon matChipRemove>cancel</mat-icon>
              </mat-chip>
            </mat-chip-set>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .filters-card {
      margin-bottom: 24px;
    }

    .filters-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .search-section {
      width: 100%;
    }

    .search-field {
      width: 100%;
      max-width: 400px;
    }

    .filters-row {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .filters-row mat-form-field {
      min-width: 180px;
      flex: 1;
    }

    .filter-actions {
      display: flex;
      align-items: center;
      margin-top: 8px;
    }

    .active-filters {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      padding-top: 8px;
      border-top: 1px solid #e0e0e0;
    }

    .filter-label {
      font-weight: 500;
      color: rgba(0,0,0,0.6);
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .filters-row {
        flex-direction: column;
      }

      .filters-row mat-form-field {
        width: 100%;
        min-width: unset;
      }

      .active-filters {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class TaskFiltersComponent {
  @Input() loading = false;
  @Output() filtersChanged = new EventEmitter<TaskFilter>();

  filtersForm: FormGroup;
  selectedStatuses: TaskStatus[] = [];
  selectedPriorities: TaskPriority[] = [];

  constructor(private fb: FormBuilder) {
    this.filtersForm = this.fb.group({
      search: [''],
      status: [[]],
      priority: [[]]
    });

    this.setupFilterWatchers();
  }

  private setupFilterWatchers(): void {
    // Buscar con debounce
    this.filtersForm.get('search')?.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.emitFilters());

    // Estados y prioridades
    this.filtersForm.get('status')?.valueChanges.subscribe(values => {
      this.selectedStatuses = values || [];
      this.emitFilters();
    });

    this.filtersForm.get('priority')?.valueChanges.subscribe(values => {
      this.selectedPriorities = values || [];
      this.emitFilters();
    });
  }

  private emitFilters(): void {
    const formValue = this.filtersForm.value;
    const filters: TaskFilter = {
      search: formValue.search?.trim() || undefined,
      status: formValue.status?.length ? formValue.status : undefined,
      priority: formValue.priority?.length ? formValue.priority : undefined
    };

    this.filtersChanged.emit(filters);
  }

  clearFilters(): void {
    this.filtersForm.reset({
      search: '',
      status: [],
      priority: []
    });
    this.selectedStatuses = [];
    this.selectedPriorities = [];
  }

  hasActiveFilters(): boolean {
    return this.selectedStatuses.length > 0 || 
           this.selectedPriorities.length > 0 || 
           !!this.filtersForm.get('search')?.value?.trim();
  }

  removeStatusFilter(status: TaskStatus): void {
    const currentStatuses = this.filtersForm.get('status')?.value || [];
    const newStatuses = currentStatuses.filter((s: TaskStatus) => s !== status);
    this.filtersForm.patchValue({ status: newStatuses });
  }

  removePriorityFilter(priority: TaskPriority): void {
    const currentPriorities = this.filtersForm.get('priority')?.value || [];
    const newPriorities = currentPriorities.filter((p: TaskPriority) => p !== priority);
    this.filtersForm.patchValue({ priority: newPriorities });
  }

  getStatusLabel(status: TaskStatus): string {
    const labels = {
      'TODO': 'Por Hacer',
      'IN_PROGRESS': 'En Progreso',
      'IN_REVIEW': 'En Revisión',
      'DONE': 'Completada',
      'CANCELLED': 'Cancelada'
    };
    return labels[status] || status;
  }

  getPriorityLabel(priority: TaskPriority): string {
    const labels = {
      'LOW': 'Baja',
      'MEDIUM': 'Media',
      'HIGH': 'Alta',
      'URGENT': 'Urgente'
    };
    return labels[priority] || priority;
  }
}