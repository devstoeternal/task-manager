import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../../../core/services/task.service';
import { UI_LABELS } from '../../../shared/constants/ui-labels.constants';
import { Task, TaskFilter, Priority, Status } from '../../../shared/models/task.interface';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatMenuModule
  ],
  template: `
    <div class="container-responsive py-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{labels.MY_TASKS}}</h1>
          <p class="text-gray-600 mt-1">
            Gestiona y organiza todas tus tareas
          </p>
        </div>
        <button 
          mat-raised-button 
          color="primary"
          (click)="createTask()"
          class="mt-4 sm:mt-0">
          <mat-icon>add</mat-icon>
          {{labels.NEW_TASK}}
        </button>
      </div>

      <!-- Search and Filters -->
      <mat-card class="search-container mb-6">
        <form [formGroup]="filterForm" class="space-y-4">
          <!-- Search Bar -->
          <div class="w-full">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{labels.SEARCH_TASKS}}</mat-label>
              <input 
                matInput 
                formControlName="searchTerm"
                [placeholder]="labels.SEARCH_TASKS">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>

          <!-- Filters Row -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Status Filter -->
            <mat-form-field appearance="outline">
              <mat-label>{{labels.STATUS}}</mat-label>
              <mat-select formControlName="status">
                <mat-option value="">Todos los estados</mat-option>
                <mat-option value="PENDING">{{labels.PENDING}}</mat-option>
                <mat-option value="IN_PROGRESS">{{labels.IN_PROGRESS}}</mat-option>
                <mat-option value="COMPLETED">{{labels.COMPLETED}}</mat-option>
              </mat-select>
            </mat-form-field>

            <!-- Priority Filter -->
            <mat-form-field appearance="outline">
              <mat-label>{{labels.PRIORITY}}</mat-label>
              <mat-select formControlName="priority">
                <mat-option value="">Todas las prioridades</mat-option>
                <mat-option value="LOW">{{labels.LOW}}</mat-option>
                <mat-option value="MEDIUM">{{labels.MEDIUM}}</mat-option>
                <mat-option value="HIGH">{{labels.HIGH}}</mat-option>
              </mat-select>
            </mat-form-field>

            <!-- Date From -->
            <mat-form-field appearance="outline">
              <mat-label>Fecha desde</mat-label>
              <input matInput [matDatepicker]="pickerFrom" formControlName="dueDateFrom">
              <mat-datepicker-toggle matSuffix [for]="pickerFrom"></mat-datepicker-toggle>
              <mat-datepicker #pickerFrom></mat-datepicker>
            </mat-form-field>

            <!-- Date To -->
            <mat-form-field appearance="outline">
              <mat-label>Fecha hasta</mat-label>
              <input matInput [matDatepicker]="pickerTo" formControlName="dueDateTo">
              <mat-datepicker-toggle matSuffix [for]="pickerTo"></mat-datepicker-toggle>
              <mat-datepicker #pickerTo></mat-datepicker>
            </mat-form-field>
          </div>

          <!-- Filter Actions -->
          <div class="flex justify-between items-center">
            <button 
              type="button"
              mat-button 
              (click)="clearFilters()"
              [disabled]="!hasActiveFilters()">
              <mat-icon>clear</mat-icon>
              {{labels.CLEAR_FILTERS}}
            </button>
            <div class="text-sm text-gray-600">
              {{filteredTasksCount}} tareas encontradas
            </div>
          </div>
        </form>
      </mat-card>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="flex justify-center items-center py-12">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && tasks.length === 0" class="text-center py-12">
        <mat-icon class="text-gray-400 text-6xl mb-4">assignment</mat-icon>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">{{labels.NO_TASKS_TITLE}}</h3>
        <p class="text-gray-600 mb-6">{{labels.NO_TASKS_SUBTITLE}}</p>
        <button 
          mat-raised-button 
          color="primary"
          (click)="createTask()">
          <mat-icon>add</mat-icon>
          {{labels.CREATE_FIRST_TASK}}
        </button>
      </div>

      <!-- Task List -->
      <div *ngIf="!isLoading && tasks.length > 0" class="card-grid">
        <mat-card 
          *ngFor="let task of tasks; trackBy: trackByTaskId"
          class="task-card cursor-pointer"
          (click)="viewTask(task)">
          
          <!-- Card Header -->
          <mat-card-header class="pb-4">
            <mat-card-title class="text-lg font-bold text-gray-800 line-clamp-2">
              {{task.title}}
            </mat-card-title>
            <mat-card-subtitle class="text-sm text-gray-600">
              <span *ngIf="task.dueDate">
                Vence: {{task.dueDate | date:'short'}}
              </span>
              <span *ngIf="!task.dueDate">
                Sin fecha límite
              </span>
            </mat-card-subtitle>
          </mat-card-header>

          <!-- Card Content -->
          <mat-card-content class="space-y-3">
            <p class="text-gray-700 text-sm line-clamp-3" *ngIf="task.description">
              {{task.description}}
            </p>
            
            <!-- Priority and Status -->
            <div class="flex flex-wrap gap-2">
              <mat-chip 
                [class]="getPriorityClass(task.priority)"
                class="priority-chip text-xs font-medium">
                {{getPriorityLabel(task.priority)}}
              </mat-chip>
              
              <mat-chip 
                [class]="getStatusClass(task.status)"
                class="priority-chip text-xs font-medium">
                {{getStatusLabel(task.status)}}
              </mat-chip>
            </div>

            <!-- Due Date Warning -->
            <div *ngIf="isOverdue(task)" class="flex items-center text-red-600 text-xs">
              <mat-icon class="text-red-600 mr-1" style="font-size: 16px; width: 16px; height: 16px;">warning</mat-icon>
              <span>Tarea vencida</span>
            </div>
            
            <div *ngIf="isDueSoon(task)" class="flex items-center text-orange-600 text-xs">
              <mat-icon class="text-orange-600 mr-1" style="font-size: 16px; width: 16px; height: 16px;">schedule</mat-icon>
              <span>Vence pronto</span>
            </div>
          </mat-card-content>

          <!-- Card Actions -->
          <mat-card-actions class="flex justify-between items-center pt-4">
            <div class="text-xs text-gray-500">
              {{task.createdAt | date:'short'}}
            </div>
            
            <div class="flex space-x-1">
              <button 
                mat-icon-button 
                (click)="$event.stopPropagation(); editTask(task)"
                [matTooltip]="labels.EDIT_TASK_TOOLTIP">
                <mat-icon>edit</mat-icon>
              </button>
              
              <button 
                mat-icon-button 
                [matMenuTriggerFor]="taskMenu"
                (click)="$event.stopPropagation(); setSelectedTask(task)"
                [matTooltip]="labels.ACTIONS">
                <mat-icon>more_vert</mat-icon>
              </button>
            </div>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- Task Actions Menu -->
      <mat-menu #taskMenu="matMenu">
        <button mat-menu-item (click)="markAsCompleted(selectedTask)">
          <mat-icon>check_circle</mat-icon>
          <span>{{labels.MARK_COMPLETE}}</span>
        </button>
        <button mat-menu-item (click)="markAsPending(selectedTask)">
          <mat-icon>schedule</mat-icon>
          <span>{{labels.MARK_PENDING}}</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="editTask(selectedTask)">
          <mat-icon>edit</mat-icon>
          <span>{{labels.EDIT}}</span>
        </button>
        <button mat-menu-item (click)="deleteTask(selectedTask)" class="text-red-600">
          <mat-icon>delete</mat-icon>
          <span>{{labels.DELETE}}</span>
        </button>
      </mat-menu>
    </div>

    <!-- Floating Action Button -->
    <button 
      mat-fab 
      color="primary" 
      class="floating-action-button"
      (click)="createTask()"
      [matTooltip]="labels.ADD_NEW_TASK">
      <mat-icon>add</mat-icon>
    </button>
  `,
  styles: [`
    .task-card {
      transition: all 0.3s ease;
      border: 1px solid transparent;
    }

    .task-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      border-color: rgb(33, 150, 243, 0.2);
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .priority-chip {
      font-size: 0.75rem;
      height: auto;
      padding: 4px 12px;
      border-radius: 16px;
      font-weight: 500;
    }

    .mat-mdc-card {
      border-radius: 12px;
    }

    .mat-mdc-fab {
      border-radius: 16px;
    }

    .search-container {
      border-radius: 12px;
    }
  `]
})
export class TaskListComponent implements OnInit, OnDestroy {
  labels = UI_LABELS;
  
  tasks: Task[] = [];
  filteredTasksCount = 0;
  isLoading = false;
  selectedTask: Task | null = null;
  
  filterForm: FormGroup;
  
  private destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.createFilterForm();
  }

  ngOnInit(): void {
    this.setupFilterForm();
    this.loadTasks();
    this.setupQueryParamFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createFilterForm(): FormGroup {
    return this.fb.group({
      searchTerm: [''],
      status: [''],
      priority: [''],
      dueDateFrom: [''],
      dueDateTo: ['']
    });
  }

  private setupFilterForm(): void {
    // Subscribe to form changes with debounce
    this.filterForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }

  private setupQueryParamFilters(): void {
    // Apply filters from query params
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['status']) {
        this.filterForm.patchValue({ status: params['status'] });
      }
      if (params['priority']) {
        this.filterForm.patchValue({ priority: params['priority'] });
      }
    });
  }

  private loadTasks(): void {
    this.isLoading = true;
    
    this.taskService.loadTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.filteredTasksCount = tasks.length;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading tasks:', error);
          this.isLoading = false;
        }
      });
  }

  private applyFilters(): void {
    const filters: TaskFilter = this.getActiveFilters();
    
    this.taskService.loadTasks(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.filteredTasksCount = tasks.length;
        },
        error: (error) => {
          console.error('Error applying filters:', error);
        }
      });
  }

  private getActiveFilters(): TaskFilter {
    const formValue = this.filterForm.value;
    const filters: TaskFilter = {};

    if (formValue.searchTerm?.trim()) {
      filters.searchTerm = formValue.searchTerm.trim();
    }
    if (formValue.status) {
      filters.status = formValue.status as Status;
    }
    if (formValue.priority) {
      filters.priority = formValue.priority as Priority;
    }
    if (formValue.dueDateFrom) {
      filters.dueDateFrom = formValue.dueDateFrom;
    }
    if (formValue.dueDateTo) {
      filters.dueDateTo = formValue.dueDateTo;
    }

    return filters;
  }

  hasActiveFilters(): boolean {
    const formValue = this.filterForm.value;
    return !!(
      formValue.searchTerm?.trim() ||
      formValue.status ||
      formValue.priority ||
      formValue.dueDateFrom ||
      formValue.dueDateTo
    );
  }

  clearFilters(): void {
    this.filterForm.reset();
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id || index;
  }

  createTask(): void {
    this.router.navigate(['/tasks/new']);
  }

  viewTask(task: Task): void {
    this.router.navigate(['/tasks', task.id]);
  }

  editTask(task: Task): void {
    this.router.navigate(['/tasks', task.id, 'edit']);
  }

  setSelectedTask(task: Task): void {
    this.selectedTask = task;
  }

  markAsCompleted(task: Task | null): void {
    if (!task || !task.id) return;

    this.taskService.updateTaskStatus(task.id, Status.COMPLETED)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open('Tarea marcada como completada', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          console.error('Error updating task status:', error);
        }
      });
  }

  markAsPending(task: Task | null): void {
    if (!task || !task.id) return;

    this.taskService.updateTaskStatus(task.id, Status.PENDING)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open('Tarea marcada como pendiente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          console.error('Error updating task status:', error);
        }
      });
  }

  deleteTask(task: Task | null): void {
    if (!task || !task.id) return;

    if (confirm(`${this.labels.DELETE_TASK_CONFIRM}\n${this.labels.DELETE_CONFIRM}`)) {
      this.taskService.deleteTask(task.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.snackBar.open(this.labels.TASK_DELETED, 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            console.error('Error deleting task:', error);
          }
        });
    }
  }

  getPriorityClass(priority: Priority): string {
    switch (priority) {
      case Priority.HIGH:
        return 'priority-high';
      case Priority.MEDIUM:
        return 'priority-medium';
      case Priority.LOW:
        return 'priority-low';
      default:
        return 'priority-low';
    }
  }

  getStatusClass(status: Status): string {
    switch (status) {
      case Status.PENDING:
        return 'status-pending';
      case Status.IN_PROGRESS:
        return 'status-in-progress';
      case Status.COMPLETED:
        return 'status-completed';
      default:
        return 'status-pending';
    }
  }

  getPriorityLabel(priority: Priority): string {
    return this.taskService.getPriorityLabel(priority);
  }

  getStatusLabel(status: Status): string {
    return this.taskService.getStatusLabel(status);
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.status === Status.COMPLETED) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  }

  isDueSoon(task: Task): boolean {
    if (!task.dueDate || task.status === Status.COMPLETED || this.isOverdue(task)) return false;
    
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);
    
    const dueDate = new Date(task.dueDate);
    
    return dueDate <= threeDaysFromNow;
  }
}