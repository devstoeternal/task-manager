import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../../../core/services/task.service';
import { UI_LABELS } from '../../../shared/constants/ui-labels.constants';
import { Task, Priority, Status } from '../../../shared/models/task.interface';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container-responsive py-6">
      <!-- Loading State -->
      <div *ngIf="isLoading" class="flex justify-center items-center py-12">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <!-- Task Detail -->
      <div *ngIf="!isLoading && task" class="max-w-4xl">
        
        <!-- Header -->
        <div class="flex items-start justify-between mb-6">
          <div class="flex items-center space-x-4 flex-1">
            <button 
              mat-icon-button 
              (click)="goBack()"
              class="bg-gray-100 hover:bg-gray-200">
              <mat-icon>arrow_back</mat-icon>
            </button>
            <div class="flex-1">
              <h1 class="text-3xl font-bold text-gray-900 mb-2">
                {{task.title}}
              </h1>
              <div class="flex flex-wrap items-center gap-3">
                <mat-chip 
                  [class]="getPriorityClass(task.priority)"
                  class="priority-chip">
                  <mat-icon matChipAvatar>{{getPriorityIcon(task.priority)}}</mat-icon>
                  {{getPriorityLabel(task.priority)}}
                </mat-chip>
                
                <mat-chip 
                  [class]="getStatusClass(task.status)"
                  class="priority-chip">
                  <mat-icon matChipAvatar>{{getStatusIcon(task.status)}}</mat-icon>
                  {{getStatusLabel(task.status)}}
                </mat-chip>

                <div *ngIf="isOverdue(task)" class="flex items-center text-red-600 text-sm">
                  <mat-icon class="mr-1" style="font-size: 16px; width: 16px; height: 16px;">warning</mat-icon>
                  <span class="font-medium">Tarea vencida</span>
                </div>
                
                <div *ngIf="isDueSoon(task)" class="flex items-center text-orange-600 text-sm">
                  <mat-icon class="mr-1" style="font-size: 16px; width: 16px; height: 16px;">schedule</mat-icon>
                  <span class="font-medium">Vence pronto</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-2">
            <button 
              mat-stroked-button 
              (click)="editTask()"
              color="primary">
              <mat-icon>edit</mat-icon>
              {{labels.EDIT}}
            </button>
            
            <button 
              mat-button 
              [matMenuTriggerFor]="actionMenu"
              class="text-gray-600">
              <mat-icon>more_vert</mat-icon>
            </button>
          </div>
        </div>

        <!-- Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- Description -->
            <mat-card class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                {{labels.TASK_DESCRIPTION}}
              </h3>
              <div *ngIf="task.description" class="prose max-w-none">
                <p class="text-gray-700 whitespace-pre-wrap">{{task.description}}</p>
              </div>
              <div *ngIf="!task.description" class="text-gray-500 italic">
                No hay descripción disponible
              </div>
            </mat-card>

            <!-- Activity Log (Placeholder) -->
            <mat-card class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Historial de Actividad
              </h3>
              <div class="space-y-3">
                <div class="flex items-start space-x-3">
                  <div class="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <mat-icon class="text-green-600 text-sm">add</mat-icon>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm text-gray-900">Tarea creada</p>
                    <p class="text-xs text-gray-500">{{task.createdAt | date:'medium'}}</p>
                  </div>
                </div>
                
                <div *ngIf="task.updatedAt && task.updatedAt !== task.createdAt" class="flex items-start space-x-3">
                  <div class="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <mat-icon class="text-blue-600 text-sm">edit</mat-icon>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm text-gray-900">Tarea actualizada</p>
                    <p class="text-xs text-gray-500">{{task.updatedAt | date:'medium'}}</p>
                  </div>
                </div>
              </div>
            </mat-card>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            
            <!-- Task Details -->
            <mat-card class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                {{labels.TASK_DETAILS}}
              </h3>
              
              <div class="space-y-4">
                <!-- Due Date -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{labels.DUE_DATE}}
                  </label>
                  <div class="flex items-center text-sm text-gray-900">
                    <mat-icon class="mr-2 text-gray-400">event</mat-icon>
                    <span *ngIf="task.dueDate">{{task.dueDate | date:'full'}}</span>
                    <span *ngIf="!task.dueDate" class="text-gray-500 italic">Sin fecha límite</span>
                  </div>
                </div>

                <!-- Created Date -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{labels.CREATED_AT}}
                  </label>
                  <div class="flex items-center text-sm text-gray-900">
                    <mat-icon class="mr-2 text-gray-400">schedule</mat-icon>
                    <span>{{task.createdAt | date:'medium'}}</span>
                  </div>
                </div>

                <!-- Last Updated -->
                <div *ngIf="task.updatedAt">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{labels.UPDATED_AT}}
                  </label>
                  <div class="flex items-center text-sm text-gray-900">
                    <mat-icon class="mr-2 text-gray-400">update</mat-icon>
                    <span>{{task.updatedAt | date:'medium'}}</span>
                  </div>
                </div>
              </div>
            </mat-card>

            <!-- Quick Actions -->
            <mat-card class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Acciones Rápidas
              </h3>
              
              <div class="space-y-3">
                <button 
                  *ngIf="task.status !== 'COMPLETED'"
                  mat-stroked-button 
                  color="primary"
                  (click)="markAsCompleted()"
                  class="w-full justify-start">
                  <mat-icon>check_circle</mat-icon>
                  <span class="ml-2">{{labels.MARK_COMPLETE}}</span>
                </button>
                
                <button 
                  *ngIf="task.status === 'COMPLETED'"
                  mat-stroked-button 
                  (click)="markAsPending()"
                  class="w-full justify-start">
                  <mat-icon>schedule</mat-icon>
                  <span class="ml-2">{{labels.MARK_PENDING}}</span>
                </button>
                
                <button 
                  mat-stroked-button 
                  (click)="editTask()"
                  class="w-full justify-start">
                  <mat-icon>edit</mat-icon>
                  <span class="ml-2">{{labels.EDIT_TASK}}</span>
                </button>
                
                <button 
                  mat-stroked-button 
                  (click)="deleteTask()"
                  class="w-full justify-start text-red-600 border-red-300 hover:bg-red-50">
                  <mat-icon>delete</mat-icon>
                  <span class="ml-2">{{labels.DELETE_TASK}}</span>
                </button>
              </div>
            </mat-card>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="!isLoading && !task" class="text-center py-12">
        <mat-icon class="text-gray-400 text-6xl mb-4">error_outline</mat-icon>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Tarea no encontrada</h3>
        <p class="text-gray-600 mb-6">La tarea que buscas no existe o ha sido eliminada.</p>
        <button mat-raised-button color="primary" (click)="goBack()">
          Volver a la lista
        </button>
      </div>

      <!-- Action Menu -->
      <mat-menu #actionMenu="matMenu">
        <button mat-menu-item (click)="markAsCompleted()" *ngIf="task && task.status !== 'COMPLETED'">
          <mat-icon>check_circle</mat-icon>
          <span>{{labels.MARK_COMPLETE}}</span>
        </button>
        <button mat-menu-item (click)="markAsPending()" *ngIf="task && task.status === 'COMPLETED'">
          <mat-icon>schedule</mat-icon>
          <span>{{labels.MARK_PENDING}}</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="editTask()">
          <mat-icon>edit</mat-icon>
          <span>{{labels.EDIT}}</span>
        </button>
        <button mat-menu-item (click)="deleteTask()" class="text-red-600">
          <mat-icon>delete</mat-icon>
          <span>{{labels.DELETE}}</span>
        </button>
      </mat-menu>
    </div>
  `,
  styles: [`
    .task-card {
      transition: all 0.3s ease;
    }

    .priority-chip {
      font-size: 0.875rem;
      height: auto;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 500;
    }

    .mat-mdc-card {
      border-radius: 12px;
    }

    .mat-mdc-stroked-button {
      border-radius: 8px;
    }

    .prose p {
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .mat-mdc-chip-avatar {
      width: 20px;
      height: 20px;
      font-size: 16px;
    }

    /* Custom button styling */
    .mat-mdc-button[class*="justify-start"] {
      justify-content: flex-start;
    }
  `]
})
export class TaskDetailComponent implements OnInit {
  labels = UI_LABELS;
  
  task: Task | null = null;
  isLoading = false;
  taskId: number | null = null;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTask();
  }

  private loadTask(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.taskId = parseInt(id, 10);
      this.isLoading = true;
      
      this.taskService.getTask(this.taskId).subscribe({
        next: (task) => {
          this.task = task;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading task:', error);
          this.task = null;
          this.isLoading = false;
        }
      });
    }
  }

  editTask(): void {
    if (this.taskId) {
      this.router.navigate(['/tasks', this.taskId, 'edit']);
    }
  }

  markAsCompleted(): void {
    if (!this.task || !this.task.id) return;

    this.taskService.updateTaskStatus(this.task.id, Status.COMPLETED).subscribe({
      next: (updatedTask) => {
        this.task = updatedTask;
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

  markAsPending(): void {
    if (!this.task || !this.task.id) return;

    this.taskService.updateTaskStatus(this.task.id, Status.PENDING).subscribe({
      next: (updatedTask) => {
        this.task = updatedTask;
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

  deleteTask(): void {
    if (!this.task || !this.task.id) return;

    if (confirm(`${this.labels.DELETE_TASK_CONFIRM}\n${this.labels.DELETE_CONFIRM}`)) {
      this.taskService.deleteTask(this.task.id).subscribe({
        next: () => {
          this.snackBar.open(this.labels.TASK_DELETED, 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
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

  getPriorityIcon(priority: Priority): string {
    switch (priority) {
      case Priority.HIGH:
        return 'priority_high';
      case Priority.MEDIUM:
        return 'remove';
      case Priority.LOW:
        return 'keyboard_arrow_down';
      default:
        return 'remove';
    }
  }

  getStatusIcon(status: Status): string {
    switch (status) {
      case Status.PENDING:
        return 'schedule';
      case Status.IN_PROGRESS:
        return 'hourglass_empty';
      case Status.COMPLETED:
        return 'check_circle';
      default:
        return 'schedule';
    }
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