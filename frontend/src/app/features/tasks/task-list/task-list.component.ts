import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { TaskService } from '../../../core/services/task.service';
import { Task, TaskFilter, TaskStatus, TaskPriority } from '../../../core/models/task.interface';
import { UI_LABELS } from '../../../shared/constants/ui-labels.constants';

@Component({
  selector: 'app-task-list',
  template: `
    <div class="task-list-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">{{ labels.ALL_TASKS }}</h1>
          <button mat-raised-button color="primary" routerLink="/tasks/new">
            <mat-icon>add</mat-icon>
            {{ labels.NEW_TASK }}
          </button>
        </div>
      </div>

      <!-- Filters -->
      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters-row">
            <!-- Search -->
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>{{ labels.SEARCH }}</mat-label>
              <input matInput [formControl]="searchControl" placeholder="Buscar tareas...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <!-- Status Filter -->
            <mat-form-field appearance="outline">
              <mat-label>Estado</mat-label>
              <mat-select [formControl]="statusControl" multiple>
                <mat-option value="TODO">{{ labels.TODO }}</mat-option>
                <mat-option value="IN_PROGRESS">{{ labels.IN_PROGRESS }}</mat-option>
                <mat-option value="DONE">{{ labels.DONE }}</mat-option>
              </mat-select>
            </mat-form-field>

            <!-- Priority Filter -->
            <mat-form-field appearance="outline">
              <mat-label>Prioridad</mat-label>
              <mat-select [formControl]="priorityControl" multiple>
                <mat-option value="LOW">{{ labels.LOW }}</mat-option>
                <mat-option value="MEDIUM">{{ labels.MEDIUM }}</mat-option>
                <mat-option value="HIGH">{{ labels.HIGH }}</mat-option>
              </mat-select>
            </mat-form-field>

            <!-- Clear Filters -->
            <button mat-stroked-button (click)="clearFilters()" class="clear-filters">
              <mat-icon>clear</mat-icon>
              {{ labels.CLEAR }}
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Task List -->
      <div class="tasks-grid" *ngIf="filteredTasks$ | async as tasks">
        <div *ngIf="tasks.length === 0" class="empty-state">
          <mat-card>
            <mat-card-content>
              <mat-icon class="empty-icon">task_alt</mat-icon>
              <h3>{{ labels.NO_TASKS }}</h3>
              <p>No se encontraron tareas con los filtros aplicados</p>
              <button mat-raised-button color="primary" routerLink="/tasks/new">
                <mat-icon>add</mat-icon>
                {{ labels.NEW_TASK }}
              </button>
            </mat-card-content>
          </mat-card>
        </div>

        <mat-card *ngFor="let task of tasks" class="task-card" [routerLink]="['/tasks', task.id]">
          <mat-card-content>
            <div class="task-header">
              <h3 class="task-title">{{ task.title }}</h3>
              <div class="task-badges">
                <mat-chip-set>
                  <mat-chip [class]="'status-' + task.status.toLowerCase()">
                    {{ getStatusLabel(task.status) }}
                  </mat-chip>
                  <mat-chip [class]="'priority-' + task.priority.toLowerCase()">
                    {{ getPriorityLabel(task.priority) }}
                  </mat-chip>
                </mat-chip-set>
              </div>
            </div>

            <p class="task-description">{{ task.description | slice:0:150 }}...</p>

            <div class="task-meta">
              <div class="task-assignee">
                <mat-icon>person</mat-icon>
                <span>{{ task.assignee ? task.assignee.firstName + ' ' + task.assignee.lastName : 'Sin asignar' }}</span>
              </div>
              <div class="task-date">
                <mat-icon>schedule</mat-icon>
                <span>{{ formatDate(task.dueDate) }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Loading -->
      <div *ngIf="loading$ | async" class="loading-container">
        <mat-card>
          <mat-card-content>
            <div class="loading-content">
              <mat-icon class="loading-icon">refresh</mat-icon>
              <p>{{ labels.LOADING }}</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .task-list-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
      color: var(--mdc-theme-on-surface);
    }

    .filters-card {
      margin-bottom: 24px;
      border-radius: 12px;
    }

    .filters-row {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 300px;
    }

    .clear-filters {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
    }

    .task-card {
      border-radius: 12px;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .task-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
      gap: 16px;
    }

    .task-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
      color: var(--mdc-theme-on-surface);
      flex: 1;
    }

    .task-badges {
      flex-shrink: 0;
    }

    .task-description {
      color: var(--mdc-theme-on-surface-variant);
      margin: 0 0 16px 0;
      line-height: 1.5;
    }

    .task-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
      color: var(--mdc-theme-on-surface-variant);
    }

    .task-assignee,
    .task-date {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .task-assignee mat-icon,
    .task-date mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    /* Status Chips */
    .status-todo {
      background: #FFF3E0;
      color: #E65100;
    }

    .status-in_progress {
      background: #E3F2FD;
      color: #0277BD;
    }

    .status-done {
      background: #E8F5E8;
      color: #2E7D32;
    }

    /* Priority Chips */
    .priority-low {
      background: #E8F5E8;
      color: #2E7D32;
    }

    .priority-medium {
      background: #FFF3E0;
      color: #E65100;
    }

    .priority-high {
      background: #FFEBEE;
      color: #C62828;
    }

    .empty-state,
    .loading-container {
      grid-column: 1 / -1;
    }

    .empty-state mat-card,
    .loading-container mat-card {
      text-align: center;
      padding: 48px 24px;
      border-radius: 12px;
    }

    .empty-icon,
    .loading-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--mdc-theme-outline);
      margin-bottom: 16px;
    }

    .loading-icon {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    @media (max-width: 768px) {
      .tasks-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .filters-row {
        flex-direction: column;
        align-items: stretch;
      }

      .search-field {
        min-width: auto;
      }

      .header-content {
        flex-direction: column;
        align-items: stretch;
      }

      .task-header {
        flex-direction: column;
        gap: 12px;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class TaskListComponent implements OnInit {
  labels = UI_LABELS;
  
  searchControl = new FormControl('');
  statusControl = new FormControl<TaskStatus[]>([]);
  priorityControl = new FormControl<TaskPriority[]>([]);
  
  tasks$!: Observable<Task[]>;
  loading$!: Observable<boolean>;
  filteredTasks$!: Observable<Task[]>;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.tasks$ = this.taskService.tasks$;
    this.loading$ = this.taskService.loading$;
    
    // Load all tasks
    this.taskService.getAllTasks().subscribe();
    
    // Setup filtered tasks observable
    this.filteredTasks$ = combineLatest([
      this.tasks$,
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged()
      ),
      this.statusControl.valueChanges.pipe(startWith([])),
      this.priorityControl.valueChanges.pipe(startWith([]))
    ]).pipe(
      map(([tasks, search, statuses, priorities]) => {
        return this.filterTasks(tasks, search || '', statuses || [], priorities || []);
      })
    );
  }

  private filterTasks(
    tasks: Task[], 
    search: string, 
    statuses: TaskStatus[], 
    priorities: TaskPriority[]
  ): Task[] {
    return tasks.filter(task => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch = 
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      
      // Status filter
      if (statuses.length > 0 && !statuses.includes(task.status)) {
        return false;
      }
      
      // Priority filter
      if (priorities.length > 0 && !priorities.includes(task.priority)) {
        return false;
      }
      
      return true;
    });
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.statusControl.setValue([]);
    this.priorityControl.setValue([]);
  }

  getStatusLabel(status: TaskStatus): string {
    const statusLabels: Record<TaskStatus, string> = {
      'TODO': this.labels.TODO,
      'IN_PROGRESS': this.labels.IN_PROGRESS,
      'DONE': this.labels.DONE
    };
    return statusLabels[status];
  }

  getPriorityLabel(priority: TaskPriority): string {
    const priorityLabels: Record<TaskPriority, string> = {
      'LOW': this.labels.LOW,
      'MEDIUM': this.labels.MEDIUM,
      'HIGH': this.labels.HIGH
    };
    return priorityLabels[priority];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}