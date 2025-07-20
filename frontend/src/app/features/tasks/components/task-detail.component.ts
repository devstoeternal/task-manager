import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../../../core/services/task.service';
import { UI_LABELS } from '../../../shared/constants/ui-labels.constants';
import { Task, Priority, Status } from '../../../shared/models/task.interface';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDividerModule,
    RouterModule
  ],
  template: `
    <div class="container-responsive py-6">
      
      <!-- Loading State -->
      <div *ngIf="isLoading" class="flex justify-center items-center py-12">
        <mat-spinner diameter="40"></mat-spinner>
        <span class="ml-4 text-gray-600">Cargando tarea...</span>
      </div>

      <!-- Error State -->
      <div *ngIf="errorMessage && !isLoading" class="text-center py-12">
        <mat-icon class="text-red-500 text-6xl mb-4">error_outline</mat-icon>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Error al cargar la tarea</h2>
        <p class="text-gray-600 mb-6">{{errorMessage}}</p>
        <button mat-raised-button color="primary" (click)="goBack()">
          <mat-icon class="mr-2">arrow_back</mat-icon>
          Volver a las tareas
        </button>
      </div>

      <!-- Task Details -->
      <div *ngIf="task && !isLoading" class="space-y-6">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center space-x-4">
            <button 
              mat-icon-button 
              (click)="goBack()"
              class="text-gray-600 hover:text-gray-800">
              <mat-icon>arrow_back</mat-icon>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{labels.TASK_DETAILS}}</h1>
              <p class="text-gray-600 mt-1">Información completa de la tarea</p>
            </div>
          </div>
          
          <!-- Action Menu -->
          <div class="flex items-center space-x-2">
            <button 
              mat-stroked-button 
              [routerLink]="['/tasks', task.id, 'edit']"
              class="hidden sm:inline-flex">
              <mat-icon class="mr-2">edit</mat-icon>
              {{labels.EDIT}}
            </button>
            
            <button 
              mat-icon-button 
              [matMenuTriggerFor]="menu"
              class="text-gray-600">
              <mat-icon>more_vert</mat-icon>
            </button>
            
            <mat-menu #menu="matMenu">
              <button mat-menu-item [routerLink]="['/tasks', task.id, 'edit']">
                <mat-icon>edit</mat-icon>
                <span>{{labels.EDIT_TASK}}</span>
              </button>
              <button mat-menu-item (click)="deleteTask()" class="text-red-600">
                <mat-icon>delete</mat-icon>
                <span>{{labels.DELETE_TASK}}</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="duplicateTask()">
                <mat-icon>content_copy</mat-icon>
                <span>Duplicar tarea</span>
              </button>
            </mat-menu>
          </div>
        </div>

        <!-- Main Task Card -->
        <mat-card class="p-6 shadow-lg">
          <div class="space-y-6">
            
            <!-- Task Title & Status -->
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div class="flex-1">
                <h2 class="text-xl font-semibold text-gray-900 mb-2">{{task.title}}</h2>
                <div class="flex flex-wrap items-center gap-3">
                  <!-- Status Chip -->
                  <mat-chip [ngClass]="getStatusChipClass(task.status)">
                    <mat-icon class="mr-1">{{getStatusIcon(task.status)}}</mat-icon>
                    {{getStatusLabel(task.status)}}
                  </mat-chip>
                  
                  <!-- Priority Chip -->
                  <mat-chip [ngClass]="getPriorityChipClass(task.priority)">
                    <mat-icon class="mr-1">flag</mat-icon>
                    {{getPriorityLabel(task.priority)}}
                  </mat-chip>
                </div>
              </div>
              
              <!-- Quick Actions -->
              <div class="flex items-center space-x-2">
                <button 
                  mat-mini-fab 
                  color="primary"
                  *ngIf="task.status !== Status.COMPLETED"
                  (click)="markAsCompleted()"
                  matTooltip="Marcar como completada">
                  <mat-icon>check</mat-icon>
                </button>
                <button 
                  mat-mini-fab 
                  color="accent"
                  *ngIf="task.status === Status.PENDING"
                  (click)="startTask()"
                  matTooltip="Iniciar tarea">
                  <mat-icon>play_arrow</mat-icon>
                </button>
              </div>
            </div>

            <!-- Description -->
            <div *ngIf="task.description" class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-sm font-medium text-gray-700 mb-2">{{labels.TASK_DESCRIPTION}}</h3>
              <p class="text-gray-900 whitespace-pre-wrap">{{task.description}}</p>
            </div>

            <!-- Task Metadata -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- Dates Column -->
              <div class="space-y-4">
                <h3 class="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">
                  Fechas importantes
                </h3>
                
                <!-- Due Date -->
                <div class="flex items-center space-x-3" *ngIf="task.dueDate">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <mat-icon class="text-orange-600 text-sm">schedule</mat-icon>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{labels.DUE_DATE}}</p>
                    <p class="text-sm text-gray-600">{{formatDate(task.dueDate)}}</p>
                    <p class="text-xs" [ngClass]="getDueDateClass(task.dueDate)">
                      {{getDueDateText(task.dueDate)}}
                    </p>
                  </div>
                </div>

                <!-- Created Date -->
                <div class="flex items-center space-x-3" *ngIf="task.createdAt">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <mat-icon class="text-blue-600 text-sm">event</mat-icon>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{labels.CREATED_AT}}</p>
                    <p class="text-sm text-gray-600">{{formatDate(task.createdAt)}}</p>
                  </div>
                </div>

                <!-- Updated Date -->
                <div class="flex items-center space-x-3" *ngIf="task.updatedAt">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <mat-icon class="text-green-600 text-sm">update</mat-icon>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{labels.UPDATED_AT}}</p>
                    <p class="text-sm text-gray-600">{{formatDate(task.updatedAt)}}</p>
                  </div>
                </div>
              </div>

              <!-- Properties Column -->
              <div class="space-y-4">
                <h3 class="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">
                  Propiedades
                </h3>
                
                <!-- Priority Detail -->
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center" 
                         [ngClass]="getPriorityBgClass(task.priority)">
                      <mat-icon class="text-sm" [ngClass]="getPriorityTextClass(task.priority)">flag</mat-icon>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{labels.PRIORITY}}</p>
                    <p class="text-sm text-gray-600">{{getPriorityLabel(task.priority)}}</p>
                  </div>
                </div>

                <!-- Status Detail -->
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center"
                         [ngClass]="getStatusBgClass(task.status)">
                      <mat-icon class="text-sm" [ngClass]="getStatusTextClass(task.status)">
                        {{getStatusIcon(task.status)}}
                      </mat-icon>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{labels.STATUS}}</p>
                    <p class="text-sm text-gray-600">{{getStatusLabel(task.status)}}</p>
                  </div>
                </div>

                <!-- Task ID -->
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <mat-icon class="text-gray-600 text-sm">tag</mat-icon>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">ID de Tarea</p>
                    <p class="text-sm text-gray-600 font-mono">#{{task.id}}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
              <button 
                mat-stroked-button 
                (click)="goBack()"
                class="sm:w-auto w-full">
                <mat-icon class="mr-2">list</mat-icon>
                Ver todas las tareas
              </button>
              
              <button 
                mat-raised-button 
                color="primary"
                [routerLink]="['/tasks', task.id, 'edit']"
                class="sm:w-auto w-full">
                <mat-icon class="mr-2">edit</mat-icon>
                {{labels.EDIT_TASK}}
              </button>
            </div>

          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .container-responsive {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .mat-mdc-card {
      border-radius: 12px;
    }

    /* Status Classes */
    .status-pending { @apply bg-orange-100 text-orange-800; }
    .status-in-progress { @apply bg-blue-100 text-blue-800; }
    .status-completed { @apply bg-green-100 text-green-800; }

    /* Priority Classes */
    .priority-low { @apply bg-green-100 text-green-800; }
    .priority-medium { @apply bg-yellow-100 text-yellow-800; }
    .priority-high { @apply bg-red-100 text-red-800; }

    /* Background Classes */
    .bg-low { @apply bg-green-100; }
    .bg-medium { @apply bg-yellow-100; }
    .bg-high { @apply bg-red-100; }

    .bg-pending { @apply bg-orange-100; }
    .bg-in-progress { @apply bg-blue-100; }
    .bg-completed { @apply bg-green-100; }

    /* Text Classes */
    .text-low { @apply text-green-600; }
    .text-medium { @apply text-yellow-600; }
    .text-high { @apply text-red-600; }

    .text-pending { @apply text-orange-600; }
    .text-in-progress { @apply text-blue-600; }
    .text-completed { @apply text-green-600; }

    .text-overdue { @apply text-red-600 font-medium; }
    .text-due-soon { @apply text-orange-600; }
    .text-on-time { @apply text-green-600; }

    @media (max-width: 640px) {
      .container-responsive {
        padding: 0 0.75rem;
      }
    }
  `]
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  labels = UI_LABELS;
  Priority = Priority;
  Status = Status;
  
  task?: Task;
  isLoading = false;
  errorMessage = '';
  taskId?: number;
  
  private destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.taskId && !isNaN(this.taskId)) {
      this.loadTask();
    } else {
      this.errorMessage = 'ID de tarea inválido';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTask(): void {
    if (!this.taskId) return;

    this.isLoading = true;
    this.taskService.getTask(this.taskId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (task) => {
          this.isLoading = false;
          this.task = task;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Tarea no encontrada';
          console.error('Load task error:', error);
        }
      });
  }

  markAsCompleted(): void {
    if (!this.task) return;

    this.taskService.updateTaskStatus(this.task.id!, Status.COMPLETED)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedTask) => {
          this.task = updatedTask;
          this.snackBar.open('Tarea marcada como completada', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          console.error('Update status error:', error);
          this.snackBar.open('Error al actualizar el estado', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  startTask(): void {
    if (!this.task) return;

    this.taskService.updateTaskStatus(this.task.id!, Status.IN_PROGRESS)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedTask) => {
          this.task = updatedTask;
          this.snackBar.open('Tarea iniciada', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          console.error('Update status error:', error);
          this.snackBar.open('Error al actualizar el estado', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  deleteTask(): void {
    if (!this.task) return;

    // TODO: Implement confirmation dialog
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      this.taskService.deleteTask(this.task.id!)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.snackBar.open('Tarea eliminada exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/tasks']);
          },
          error: (error) => {
            console.error('Delete task error:', error);
            this.snackBar.open('Error al eliminar la tarea', 'Cerrar', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
    }
  }

  duplicateTask(): void {
    if (!this.task) return;

    const duplicatedTask = {
      title: `${this.task.title} (Copia)`,
      description: this.task.description,
      priority: this.task.priority,
      status: Status.PENDING,
      dueDate: this.task.dueDate
    };

    this.router.navigate(['/tasks/new'], {
      state: { duplicatedTask }
    });
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  // Helper methods for styling and formatting
  getStatusChipClass(status: Status): string {
    const baseClass = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ';
    switch (status) {
      case Status.PENDING: return baseClass + 'status-pending';
      case Status.IN_PROGRESS: return baseClass + 'status-in-progress';
      case Status.COMPLETED: return baseClass + 'status-completed';
      default: return baseClass + 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityChipClass(priority: Priority): string {
    const baseClass = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ';
    switch (priority) {
      case Priority.LOW: return baseClass + 'priority-low';
      case Priority.MEDIUM: return baseClass + 'priority-medium';
      case Priority.HIGH: return baseClass + 'priority-high';
      default: return baseClass + 'bg-gray-100 text-gray-800';
    }
  }

  getStatusIcon(status: Status): string {
    switch (status) {
      case Status.PENDING: return 'schedule';
      case Status.IN_PROGRESS: return 'play_circle';
      case Status.COMPLETED: return 'check_circle';
      default: return 'help';
    }
  }

  getStatusLabel(status: Status): string {
    switch (status) {
      case Status.PENDING: return this.labels.PENDING;
      case Status.IN_PROGRESS: return this.labels.IN_PROGRESS;
      case Status.COMPLETED: return this.labels.COMPLETED;
      default: return 'Desconocido';
    }
  }

  getPriorityLabel(priority: Priority): string {
    switch (priority) {
      case Priority.LOW: return this.labels.LOW;
      case Priority.MEDIUM: return this.labels.MEDIUM;
      case Priority.HIGH: return this.labels.HIGH;
      default: return 'Desconocida';
    }
  }

  getPriorityBgClass(priority: Priority): string {
    switch (priority) {
      case Priority.LOW: return 'bg-low';
      case Priority.MEDIUM: return 'bg-medium';
      case Priority.HIGH: return 'bg-high';
      default: return 'bg-gray-100';
    }
  }

  getPriorityTextClass(priority: Priority): string {
    switch (priority) {
      case Priority.LOW: return 'text-low';
      case Priority.MEDIUM: return 'text-medium';
      case Priority.HIGH: return 'text-high';
      default: return 'text-gray-600';
    }
  }

  getStatusBgClass(status: Status): string {
    switch (status) {
      case Status.PENDING: return 'bg-pending';
      case Status.IN_PROGRESS: return 'bg-in-progress';
      case Status.COMPLETED: return 'bg-completed';
      default: return 'bg-gray-100';
    }
  }

  getStatusTextClass(status: Status): string {
    switch (status) {
      case Status.PENDING: return 'text-pending';
      case Status.IN_PROGRESS: return 'text-in-progress';
      case Status.COMPLETED: return 'text-completed';
      default: return 'text-gray-600';
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }

  getDueDateClass(dueDate: Date): string {
    const now = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'text-overdue';
    if (diffDays <= 1) return 'text-due-soon';
    return 'text-on-time';
  }

  getDueDateText(dueDate: Date): string {
    const now = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `Vencida hace ${Math.abs(diffDays)} día(s)`;
    if (diffDays === 0) return 'Vence hoy';
    if (diffDays === 1) return 'Vence mañana';
    return `Vence en ${diffDays} día(s)`;
  }
}