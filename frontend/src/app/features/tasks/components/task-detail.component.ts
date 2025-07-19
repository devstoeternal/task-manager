import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider'; // ✅ Agregado para mat-divider
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
    MatDividerModule, // ✅ Agregado para mat-divider
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
                
                <span class="text-sm text-gray-500" *ngIf="task.dueDate">
                  Vence: {{task.dueDate | date:'medium'}}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Action Button -->
          <button 
            mat-button 
            [matMenuTriggerFor]="actionMenu"
            class="ml-4">
            <mat-icon>more_vert</mat-icon>
          </button>
        </div>

        <!-- Task Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- Description -->
            <mat-card class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Descripción</h3>
              <div class="prose max-w-none">
                <p class="text-gray-700 whitespace-pre-wrap" [innerHTML]="task.description || 'Sin descripción'"></p>
              </div>
            </mat-card>

            <!-- Comments Section (Placeholder) -->
            <mat-card class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Comentarios</h3>
              <div class="text-center py-8">
                <mat-icon class="text-gray-400 text-4xl mb-2">comment</mat-icon>
                <p class="text-gray-500">No hay comentarios aún</p>
                <button mat-stroked-button class="mt-4">
                  Agregar comentario
                </button>
              </div>
            </mat-card>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            
            <!-- Task Info -->
            <mat-card class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Información</h3>
              
              <div class="space-y-4">
                <div>
                  <p class="text-sm font-medium text-gray-500">Estado</p>
                  <p class="text-base text-gray-900">{{getStatusLabel(task.status)}}</p>
                </div>
                
                <mat-divider></mat-divider> <!-- ✅ Ahora funcionará -->
                
                <div>
                  <p class="text-sm font-medium text-gray-500">Prioridad</p>
                  <p class="text-base text-gray-900">{{getPriorityLabel(task.priority)}}</p>
                </div>
                
                <mat-divider></mat-divider>
                
                <div *ngIf="task.dueDate">
                  <p class="text-sm font-medium text-gray-500">Fecha de vencimiento</p>
                  <p class="text-base text-gray-900">{{task.dueDate | date:'fullDate'}}</p>
                </div>
                
                <mat-divider *ngIf="task.dueDate"></mat-divider>
                
                <div>
                  <p class="text-sm font-medium text-gray-500">Creado</p>
                  <p class="text-base text-gray-900">{{task.createdAt | date:'medium'}}</p>
                </div>
              </div>
            </mat-card>

            <!-- Quick Actions -->
            <mat-card class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Acciones rápidas</h3>
              
              <div class="space-y-3">
                <button 
                  mat-stroked-button 
                  class="w-full justify-start"
                  (click)="markAsCompleted()" 
                  *ngIf="task.status !== 'COMPLETED'">
                  <mat-icon>check_circle</mat-icon>
                  <span class="ml-2">Marcar como completada</span>
                </button>
                
                <button 
                  mat-stroked-button 
                  class="w-full justify-start"
                  (click)="markAsPending()" 
                  *ngIf="task.status === 'COMPLETED'">
                  <mat-icon>schedule</mat-icon>
                  <span class="ml-2">Marcar como pendiente</span>
                </button>
                
                <button 
                  mat-stroked-button 
                  class="w-full justify-start"
                  (click)="editTask()">
                  <mat-icon>edit</mat-icon>
                  <span class="ml-2">Editar tarea</span>
                </button>
                
                <button 
                  mat-stroked-button 
                  class="w-full justify-start text-red-600 border-red-300 hover:bg-red-50"
                  (click)="deleteTask()">
                  <mat-icon>delete</mat-icon>
                  <span class="ml-2">Eliminar tarea</span>
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
          <span>Marcar como completada</span>
        </button>
        <button mat-menu-item (click)="markAsPending()" *ngIf="task && task.status === 'COMPLETED'">
          <mat-icon>schedule</mat-icon>
          <span>Marcar como pendiente</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="editTask()">
          <mat-icon>edit</mat-icon>
          <span>Editar</span>
        </button>
        <button mat-menu-item (click)="deleteTask()" class="text-red-600">
          <mat-icon>delete</mat-icon>
          <span>Eliminar</span>
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
  isLoading = true;
  taskId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.loadTask();
    } else {
      this.isLoading = false;
    }
  }

  private loadTask(): void {
    if (!this.taskId) return;
    
    // Simular carga de tarea
    this.isLoading = true;
    setTimeout(() => {
      this.task = {
        id: 1,
        title: 'Revisar documentación del proyecto',
        description: 'Revisar y actualizar la documentación técnica del sistema de gestión de tareas.',
        status: 'IN_PROGRESS' as Status,
        priority: 'HIGH' as Priority,
        dueDate: new Date('2024-12-31'),
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2024-12-15'),
        userId: 1
      };
      this.isLoading = false;
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  editTask(): void {
    if (this.task) {
      this.router.navigate(['/tasks', this.task.id, 'edit']);
    }
  }

  markAsCompleted(): void {
    // Implementar lógica
    this.snackBar.open('Tarea marcada como completada', 'Cerrar', { duration: 3000 });
  }

  markAsPending(): void {
    // Implementar lógica  
    this.snackBar.open('Tarea marcada como pendiente', 'Cerrar', { duration: 3000 });
  }

  deleteTask(): void {
    // Implementar lógica
    this.snackBar.open('Tarea eliminada', 'Cerrar', { duration: 3000 });
    this.goBack();
  }

  getPriorityLabel(priority: Priority): string {
    const labels = {
      'LOW': 'Baja',
      'MEDIUM': 'Media', 
      'HIGH': 'Alta'
    };
    return labels[priority] || priority;
  }

  getPriorityIcon(priority: Priority): string {
    const icons = {
      'LOW': 'keyboard_arrow_down',
      'MEDIUM': 'remove',
      'HIGH': 'keyboard_arrow_up'
    };
    return icons[priority] || 'remove';
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

  getStatusIcon(status: Status): string {
    const icons = {
      'PENDING': 'schedule',
      'IN_PROGRESS': 'hourglass_empty',
      'COMPLETED': 'check_circle'
    };
    return icons[status] || 'schedule';
  }

  getStatusClass(status: Status): string {
    const classes = {
      'PENDING': 'status-pending',
      'IN_PROGRESS': 'status-in-progress',
      'COMPLETED': 'status-completed'
    };
    return classes[status] || '';
  }
}