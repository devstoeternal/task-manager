import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TaskService } from '../../../core/services/task.service';
import { Task, TaskStatus } from '../../../core/models/task.interface';
import { UI_LABELS } from '../../../shared/constants/ui-labels.constants';

@Component({
  selector: 'app-task-detail',
  template: `
    <div class="task-detail-container" *ngIf="task">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <button mat-icon-button (click)="goBack()" class="back-button">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1 class="page-title">{{ task.title }}</h1>
          <button mat-icon-button [matMenuTriggerFor]="taskMenu" class="menu-button">
            <mat-icon>more_vert</mat-icon>
          </button>
          
          <mat-menu #taskMenu="matMenu">
            <button mat-menu-item [routerLink]="['/tasks', task.id, 'edit']">
              <mat-icon>edit</mat-icon>
              <span>{{ labels.EDIT }}</span>
            </button>
            <button mat-menu-item (click)="deleteTask()">
              <mat-icon>delete</mat-icon>
              <span>{{ labels.DELETE }}</span>
            </button>
          </mat-menu>
        </div>
      </div>

      <!-- Task Content -->
      <div class="task-content">
        <!-- Main Info Card -->
        <mat-card class="info-card">
          <mat-card-content>
            <div class="task-badges">
              <mat-chip [class]="'status-' + task.status.toLowerCase()">
                {{ getStatusLabel(task.status) }}
              </mat-chip>
              <mat-chip [class]="'priority-' + task.priority.toLowerCase()">
                {{ getPriorityLabel(task.priority) }}
              </mat-chip>
            </div>

            <div class="task-description">
              <h3>Descripción</h3>
              <p>{{ task.description }}</p>
            </div>

            <div class="task-meta">
              <div class="meta-item">
                <mat-icon>schedule</mat-icon>
                <div>
                  <span class="meta-label">Fecha de vencimiento</span>
                  <span class="meta-value">{{ formatDate(task.dueDate) }}</span>
                </div>
              </div>

              <div class="meta-item" *ngIf="task.assignee">
                <mat-icon>person</mat-icon>
                <div>
                  <span class="meta-label">Asignado a</span>
                  <span class="meta-value">{{ task.assignee.firstName }} {{ task.assignee.lastName }}</span>
                </div>
              </div>

              <div class="meta-item">
                <mat-icon>person_outline</mat-icon>
                <div>
                  <span class="meta-label">Creado por</span>
                  <span class="meta-value">{{ task.creator.firstName }} {{ task.creator.lastName }}</span>
                </div>
              </div>

              <div class="meta-item">
                <mat-icon>access_time</mat-icon>
                <div>
                  <span class="meta-label">Fecha de creación</span>
                  <span class="meta-value">{{ formatDate(task.createdAt) }}</span>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Actions Card -->
        <mat-card class="actions-card">
          <mat-card-header>
            <mat-card-title>Cambiar Estado</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="status-actions">
              <button 
                mat-raised-button 
                color="accent"
                *ngIf="task.status === 'TODO'"
                (click)="changeStatus('IN_PROGRESS')">
                <mat-icon>play_arrow</mat-icon>
                Iniciar Tarea
              </button>

              <button 
                mat-raised-button 
                color="primary"
                *ngIf="task.status === 'IN_PROGRESS'"
                (click)="changeStatus('DONE')">
                <mat-icon>check_circle</mat-icon>
                Completar Tarea
              </button>

              <button 
                mat-stroked-button
                *ngIf="task.status === 'IN_PROGRESS'"
                (click)="changeStatus('TODO')">
                <mat-icon>pause</mat-icon>
                Pausar Tarea
              </button>

              <button 
                mat-stroked-button
                *ngIf="task.status === 'DONE'"
                (click)="changeStatus('IN_PROGRESS')">
                <mat-icon>replay</mat-icon>
                Reabrir Tarea
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>

    <!-- Loading State -->
    <div *ngIf="!task" class="loading-container">
      <mat-card>
        <mat-card-content>
          <div class="loading-content">
            <mat-icon class="loading-icon">refresh</mat-icon>
            <p>{{ labels.LOADING }}</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .task-detail-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .back-button {
      flex-shrink: 0;
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0;
      flex: 1;
      color: var(--mdc-theme-on-surface);
    }

    .menu-button {
      flex-shrink: 0;
    }

    .task-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .info-card,
    .actions-card {
      border-radius: 12px;
    }

    .task-badges {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
    }

    .task-description {
      margin-bottom: 24px;
    }

    .task-description h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0 0 12px 0;
      color: var(--mdc-theme-on-surface);
    }

    .task-description p {
      color: var(--mdc-theme-on-surface-variant);
      line-height: 1.6;
      margin: 0;
    }

    .task-meta {
      display: grid;
      gap: 16px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .meta-item mat-icon {
      color: var(--mdc-theme-on-surface-variant);
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .meta-label {
      display: block;
      font-size: 0.875rem;
      color: var(--mdc-theme-on-surface-variant);
    }

    .meta-value {
      display: block;
      font-weight: 500;
      color: var(--mdc-theme-on-surface);
    }

    .status-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .status-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
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

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 48px 24px;
    }

    .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .loading-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--mdc-theme-outline);
      margin-bottom: 16px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 1.5rem;
      }

      .status-actions {
        flex-direction: column;
      }

      .task-meta {
        gap: 12px;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule
  ]
})
export class TaskDetailComponent implements OnInit {
  labels = UI_LABELS;
  task: Task | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const taskId = this.route.snapshot.params['id'];
    if (taskId) {
      this.loadTask(+taskId);
    }
  }

  loadTask(id: number): void {
    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        this.task = task;
      },
      error: () => {
        this.snackBar.open('Error al cargar la tarea', this.labels.CLOSE, {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.goBack();
      }
    });
  }

  changeStatus(newStatus: TaskStatus): void {
    if (this.task) {
      this.taskService.updateTaskStatus(this.task.id, newStatus).subscribe({
        next: (updatedTask) => {
          this.task = updatedTask;
          this.snackBar.open('Estado actualizado exitosamente', this.labels.CLOSE, {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        }
      });
    }
  }

  deleteTask(): void {
    if (this.task && confirm(this.labels.DELETE_TASK_CONFIRM)) {
      this.taskService.deleteTask(this.task.id).subscribe({
        next: () => {
          this.snackBar.open(this.labels.TASK_DELETED, this.labels.CLOSE, {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.goBack();
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  getStatusLabel(status: TaskStatus): string {
    const statusLabels: Record<TaskStatus, string> = {
      'TODO': this.labels.TODO,
      'IN_PROGRESS': this.labels.IN_PROGRESS,
      'DONE': this.labels.DONE
    };
    return statusLabels[status];
  }

  getPriorityLabel(priority: string): string {
    const priorityLabels: Record<string, string> = {
      'LOW': this.labels.LOW,
      'MEDIUM': this.labels.MEDIUM,
      'HIGH': this.labels.HIGH
    };
    return priorityLabels[priority] || priority;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}