import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';





import { Task, TaskPriority, TaskStatus } from '../../../core/models/task.interface';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskFiltersComponent } from '../task-filters/task-filters.component';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatProgressBarModule,
    TaskFormComponent,
    TaskFiltersComponent
  ],
  template: `
    <div class="task-list-container">
      <div class="task-header">
        <h1>Mis Tareas</h1>
        <button mat-raised-button color="primary" (click)="openTaskForm()">
          <mat-icon>add</mat-icon>
          Nueva Tarea
        </button>
      </div>

      <app-task-filters 
        (filtersChanged)="onFiltersChanged($event)"
        [loading]="loading">
      </app-task-filters>

      <div class="tasks-content">
        <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>
        
        <div class="tasks-grid" *ngIf="!loading">
          <mat-card 
            class="task-card" 
            *ngFor="let task of filteredTasks" 
            [class.overdue]="isOverdue(task)">
            
            <mat-card-header>
              <div class="task-title-row">
                <h3 class="task-title">{{ task.title }}</h3>
                <button mat-icon-button [matMenuTriggerFor]="taskMenu">
                  <mat-icon>more_vert</mat-icon>
                </button>
                
                <mat-menu #taskMenu="matMenu">
                  <button mat-menu-item (click)="editTask(task)">
                    <mat-icon>edit</mat-icon>
                    Editar
                  </button>
                  <button mat-menu-item (click)="deleteTask(task.id)">
                    <mat-icon>delete</mat-icon>
                    Eliminar
                  </button>
                </mat-menu>
              </div>
            </mat-card-header>

            <mat-card-content>
              <p class="task-description">{{ task.description }}</p>
              
              <div class="task-meta">
                <mat-chip-set>
                  <mat-chip [class]="'status-' + task.status.toLowerCase()">
                    {{ getStatusLabel(task.status) }}
                  </mat-chip>
                  <mat-chip [class]="'priority-' + task.priority.toLowerCase()">
                    {{ getPriorityLabel(task.priority) }}
                  </mat-chip>
                </mat-chip-set>
                
                <div class="task-dates" *ngIf="task.dueDate">
                  <span class="due-date">
                    <mat-icon>schedule</mat-icon>
                    {{ formatDate(task.dueDate) }}
                  </span>
                </div>
              </div>
            </mat-card-content>

            <mat-card-actions>
              <button mat-button (click)="changeStatus(task, 'TODO')" 
                      [disabled]="task.status === 'TODO'">
                Por Hacer
              </button>
              <button mat-button (click)="changeStatus(task, 'IN_PROGRESS')" 
                      [disabled]="task.status === 'IN_PROGRESS'">
                En Progreso
              </button>
              <button mat-button (click)="changeStatus(task, 'IN_REVIEW')" 
                      [disabled]="task.status === 'IN_REVIEW'">
                En Revisión
              </button>
              <button mat-button (click)="changeStatus(task, 'DONE')" 
                      [disabled]="task.status === 'DONE'">
                Completada
              </button>
            </mat-card-actions>
          </mat-card>
        </div>

        <div class="empty-state" *ngIf="!loading && filteredTasks.length === 0">
          <mat-icon>assignment</mat-icon>
          <h3>No hay tareas</h3>
          <p>Crea tu primera tarea para comenzar</p>
          <button mat-raised-button color="primary" (click)="openTaskForm()">
            <mat-icon>add</mat-icon>
            Crear Tarea
          </button>
        </div>
      </div>

      <app-task-form
        *ngIf="showTaskForm"
        [task]="selectedTask"
        (taskSaved)="onTaskSaved($event)"
        (cancelled)="onTaskFormCancelled()">
      </app-task-form>
    </div>
  `,
  styles: [`
    .task-list-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .task-header h1 {
      margin: 0;
      font-size: 2rem;
      font-weight: 500;
    }

    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .task-card {
      transition: transform 0.2s ease-in-out;
    }

    .task-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.12);
    }

    .task-card.overdue {
      border-left: 4px solid #f44336;
    }

    .task-title-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
    }

    .task-title {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 500;
      flex: 1;
    }

    .task-description {
      color: rgba(0,0,0,0.6);
      margin: 12px 0;
      line-height: 1.4;
    }

    .task-meta {
      margin: 16px 0;
    }

    .task-dates {
      margin-top: 8px;
    }

    .due-date {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.875rem;
      color: rgba(0,0,0,0.6);
    }

    mat-chip-set {
      margin-bottom: 8px;
    }

    .status-todo { background-color: #e3f2fd; color: #1976d2; }
    .status-in_progress { background-color: #fff3e0; color: #f57c00; }
    .status-in_review { background-color: #f3e5f5; color: #7b1fa2; }
    .status-done { background-color: #e8f5e8; color: #388e3c; }
    .status-cancelled { background-color: #ffebee; color: #d32f2f; }

    .priority-low { background-color: #e8f5e8; color: #4caf50; }
    .priority-medium { background-color: #fff3e0; color: #ff9800; }
    .priority-high { background-color: #ffebee; color: #f44336; }
    .priority-urgent { background-color: #3f51b5; color: white; }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: rgba(0,0,0,0.6);
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: rgba(0,0,0,0.3);
    }

    .empty-state h3 {
      margin: 16px 0 8px;
      font-size: 1.5rem;
    }

    @media (max-width: 768px) {
      .task-list-container {
        padding: 16px;
      }

      .tasks-grid {
        grid-template-columns: 1fr;
      }

      .task-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
    }
  `]
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  loading = false;
  showTaskForm = false;
  selectedTask: Task | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    
    this.taskService.tasks$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => {
        this.tasks = tasks;
        this.filteredTasks = tasks;
      });

    this.taskService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.loading = loading);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTasks(): void {
    this.taskService.getMyTasks().subscribe({
      error: (error) => {
        this.snackBar.open('Error al cargar las tareas', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onFiltersChanged(filters: any): void {
    this.taskService.filterTasks(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe(filteredTasks => {
        this.filteredTasks = filteredTasks;
      });
  }

  openTaskForm(): void {
    this.selectedTask = null;
    this.showTaskForm = true;
  }

  editTask(task: Task): void {
    this.selectedTask = task;
    this.showTaskForm = true;
  }

  deleteTask(taskId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.snackBar.open('Tarea eliminada', 'Cerrar', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Error al eliminar la tarea', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  changeStatus(task: Task, newStatus: TaskStatus): void {
    this.taskService.updateTaskStatus(task.id, newStatus).subscribe({
      next: () => {
        this.snackBar.open('Estado actualizado', 'Cerrar', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Error al actualizar el estado', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onTaskSaved(task: Task): void {
    this.showTaskForm = false;
    this.selectedTask = null;
    this.snackBar.open(
      this.selectedTask ? 'Tarea actualizada' : 'Tarea creada', 
      'Cerrar', 
      { duration: 3000 }
    );
  }

  onTaskFormCancelled(): void {
    this.showTaskForm = false;
    this.selectedTask = null;
  }

  isOverdue(task: Task): boolean {
    return task.dueDate 
      ? new Date(task.dueDate) < new Date() && task.status !== 'DONE'
      : false;
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

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}