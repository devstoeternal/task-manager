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
import { MatDividerModule } from '@angular/material/divider'; // ✅ Agregado para mat-divider
import { MatTooltipModule } from '@angular/material/tooltip'; // ✅ Agregado para matTooltip
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
    MatMenuModule,
    MatDividerModule, // ✅ Para mat-divider
    MatTooltipModule  // ✅ Para matTooltip
  ],
  template: `
    <div class="container-responsive py-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Mis Tareas</h1>
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
          Nueva Tarea
        </button>
      </div>

      <!-- Search and Filters -->
      <mat-card class="search-container mb-6 p-4">
        <form [formGroup]="filterForm" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <!-- Search -->
          <mat-form-field appearance="outline">
            <mat-label>Buscar tareas</mat-label>
            <input matInput formControlName="search" placeholder="Título o descripción...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <!-- Status Filter -->
          <mat-form-field appearance="outline">
            <mat-label>Estado</mat-label>
            <mat-select formControlName="status">
              <mat-option value="">Todos</mat-option>
              <mat-option value="PENDING">Pendiente</mat-option>
              <mat-option value="IN_PROGRESS">En progreso</mat-option>
              <mat-option value="COMPLETED">Completada</mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Priority Filter -->
          <mat-form-field appearance="outline">
            <mat-label>Prioridad</mat-label>
            <mat-select formControlName="priority">
              <mat-option value="">Todas</mat-option>
              <mat-option value="LOW">Baja</mat-option>
              <mat-option value="MEDIUM">Media</mat-option>
              <mat-option value="HIGH">Alta</mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Due Date Filter -->
          <mat-form-field appearance="outline">
            <mat-label>Vence antes de</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="dueBefore">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </form>
      </mat-card>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="flex justify-center items-center py-12">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <!-- Tasks Grid -->
      <div *ngIf="!isLoading" class="space-y-6">
        
        <!-- Results Counter -->
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-600">
            Mostrando {{tasks.length}} tareas
          </p>
          <button mat-button (click)="clearFilters()">
            <mat-icon>clear</mat-icon>
            Limpiar filtros
          </button>
        </div>

        <!-- Tasks Grid -->
        <div class="card-grid" *ngIf="tasks.length > 0">
          <mat-card 
            *ngFor="let task of tasks; trackBy: trackByTaskId"
            class="task-card cursor-pointer hover:shadow-lg transition-all"
            (click)="viewTask(task)">
            
            <!-- Card Header -->
            <mat-card-header class="pb-2">
              <div class="flex items-start justify-between w-full">
                <div class="flex-1 min-w-0">
                  <mat-card-title class="text-lg font-semibold line-clamp-2">
                    {{task.title}}
                  </mat-card-title>
                  <mat-card-subtitle class="text-sm text-gray-500 mt-1">
                    Creado: {{task.createdAt | date:'short'}}
                  </mat-card-subtitle>
                </div>
                
                <!-- Task Menu -->
                <button 
                  mat-icon-button 
                  [matMenuTriggerFor]="taskMenu"
                  (click)="$event.stopPropagation(); setSelectedTask(task)"
                  [matTooltip]="'Acciones'">
                  <mat-icon>more_vert</mat-icon>
                </button>
              </div>
            </mat-card-header>

            <!-- Card Content -->
            <mat-card-content class="pt-2">
              <p class="text-gray-700 text-sm line-clamp-3 mb-4" *ngIf="task.description">
                {{task.description}}
              </p>
              
              <!-- Task Meta -->
              <div class="flex flex-wrap items-center gap-2 mb-4">
                <mat-chip 
                  [class]="getPriorityClass(task.priority)"
                  class="priority-chip text-xs">
                  {{getPriorityLabel(task.priority)}}
                </mat-chip>
                
                <mat-chip 
                  [class]="getStatusClass(task.status)"
                  class="priority-chip text-xs">
                  {{getStatusLabel(task.status)}}
                </mat-chip>
                
                <span class="text-xs text-gray-500" *ngIf="task.dueDate">
                  Vence: {{task.dueDate | date:'short'}}
                </span>
              </div>
            </mat-card-content>

            <!-- Card Actions -->
            <mat-card-actions class="flex justify-between items-center">
              <div class="flex space-x-2">
                <button 
                  mat-icon-button 
                  (click)="$event.stopPropagation(); editTask(task)"
                  [matTooltip]="'Editar tarea'">
                  <mat-icon>edit</mat-icon>
                </button>
                
                <button 
                  mat-icon-button 
                  (click)="$event.stopPropagation(); toggleTaskStatus(task)"
                  [matTooltip]="task.status === 'COMPLETED' ? 'Marcar pendiente' : 'Marcar completada'">
                  <mat-icon>{{task.status === 'COMPLETED' ? 'schedule' : 'check_circle'}}</mat-icon>
                </button>
              </div>
              
              <span class="text-xs text-gray-400">
                {{getDaysUntilDue(task.dueDate)}}
              </span>
            </mat-card-actions>
          </mat-card>
        </div>

        <!-- Empty State -->
        <div *ngIf="tasks.length === 0" class="text-center py-12">
          <mat-icon class="text-gray-400 text-6xl mb-4">assignment</mat-icon>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No se encontraron tareas</h3>
          <p class="text-gray-600 mb-6">
            No hay tareas que coincidan con los filtros aplicados
          </p>
          <button mat-raised-button color="primary" (click)="createTask()">
            <mat-icon>add</mat-icon>
            Crear primera tarea
          </button>
        </div>
      </div>

      <!-- Task Context Menu -->
      <mat-menu #taskMenu="matMenu">
        <button mat-menu-item (click)="viewTask(selectedTask!)" *ngIf="selectedTask">
          <mat-icon>visibility</mat-icon>
          <span>Ver detalles</span>
        </button>
        <button mat-menu-item (click)="toggleTaskStatus(selectedTask!)" *ngIf="selectedTask && selectedTask.status !== 'COMPLETED'">
          <mat-icon>check_circle</mat-icon>
          <span>Marcar completada</span>
        </button>
        <button mat-menu-item (click)="toggleTaskStatus(selectedTask!)" *ngIf="selectedTask && selectedTask.status === 'COMPLETED'">
          <mat-icon>schedule</mat-icon>
          <span>Marcar pendiente</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="editTask(selectedTask!)" *ngIf="selectedTask">
          <mat-icon>edit</mat-icon>
          <span>Editar</span>
        </button>
        <button mat-menu-item (click)="deleteTask(selectedTask!)" *ngIf="selectedTask" class="text-red-600">
          <mat-icon>delete</mat-icon>
          <span>Eliminar</span>
        </button>
      </mat-menu>
    </div>

    <!-- Floating Action Button -->
    <button 
      mat-fab 
      color="primary" 
      class="floating-action-button"
      (click)="createTask()"
      [matTooltip]="'Agregar nueva tarea'">
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
      search: [''],
      status: [''],
      priority: [''],
      dueBefore: [null]
    });
  }

  private setupFilterForm(): void {
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
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
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

    // Simular datos de tareas
    setTimeout(() => {
      this.tasks = [
        {
          id: 1,
          title: 'Revisar documentación del proyecto',
          description: 'Revisar y actualizar la documentación técnica del sistema.',
          status: 'IN_PROGRESS' as Status,
          priority: 'HIGH' as Priority,
          dueDate: new Date('2024-12-31'),
          createdAt: new Date('2024-12-01'),
          updatedAt: new Date('2024-12-15'),
          userId: 1
        },
        {
          id: 2,
          title: 'Implementar autenticación JWT',
          description: 'Configurar el sistema de autenticación con tokens JWT.',
          status: 'PENDING' as Status,
          priority: 'MEDIUM' as Priority,
          dueDate: new Date('2025-01-15'),
          createdAt: new Date('2024-12-10'),
          updatedAt: new Date('2024-12-10'),
          userId: 1
        },
        {
          id: 3,
          title: 'Diseñar interfaz de usuario',
          description: 'Crear mockups y prototipos para la nueva interfaz.',
          status: 'COMPLETED' as Status,
          priority: 'LOW' as Priority,
          dueDate: new Date('2024-12-20'),
          createdAt: new Date('2024-11-15'),
          updatedAt: new Date('2024-12-18'),
          userId: 1
        }
      ];
      this.isLoading = false;
    }, 1000);
  }

  private applyFilters(): void {
    // Implementar lógica de filtrado
    // Por ahora solo simular
  }

  clearFilters(): void {
    this.filterForm.reset();
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

  toggleTaskStatus(task: Task): void {
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    // Implementar lógica
    this.snackBar.open(
      `Tarea marcada como ${newStatus === 'COMPLETED' ? 'completada' : 'pendiente'}`,
      'Cerrar',
      { duration: 3000 }
    );
  }

  deleteTask(task: Task): void {
    // Implementar lógica
    this.snackBar.open('Tarea eliminada', 'Cerrar', { duration: 3000 });
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id ?? 0;
  }

  getPriorityLabel(priority: Priority): string {
    const labels = {
      'LOW': 'Baja',
      'MEDIUM': 'Media',
      'HIGH': 'Alta'
    };
    return labels[priority] || priority;
  }

  getPriorityClass(priority: Priority): string {
    const classes = {
      'LOW': 'priority-low',
      'MEDIUM': 'priority-medium',
      'HIGH': 'priority-high'
    };
    return classes[priority] || '';
  }

  getStatusLabel(status: Status): string {
    const labels = {
      'PENDING': 'Pendiente',
      'IN_PROGRESS': 'En progreso',
      'COMPLETED': 'Completada'
    };
    return labels[status] || status;
  }

  getStatusClass(status: Status): string {
    const classes = {
      'PENDING': 'status-pending',
      'IN_PROGRESS': 'status-in-progress',
      'COMPLETED': 'status-completed'
    };
    return classes[status] || '';
  }

  getDaysUntilDue(dueDate: Date | undefined): string {
    if (!dueDate) return '';

    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Vencida';
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    return `${diffDays} días`;
  }
}