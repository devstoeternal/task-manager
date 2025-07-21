import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Observable } from 'rxjs';

import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';
import { TaskStats, Task } from '../../core/models/task.interface';
import { UserProfile } from '../../core/models/user.interface';
import { UI_LABELS } from '../../shared/constants/ui-labels.constants';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <div class="dashboard-header">
        <h1 class="page-title">{{ labels.DASHBOARD }}</h1>
        <p class="welcome-message" *ngIf="userProfile">
          ¡Hola, {{ userProfile.firstName }}! Aquí tienes un resumen de tus tareas.
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid" *ngIf="stats$ | async as stats">
        <mat-card class="stat-card total-tasks">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon>task_alt</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.total }}</div>
              <div class="stat-label">Total de Tareas</div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card pending-tasks">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon>pending_actions</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.todo }}</div>
              <div class="stat-label">Pendientes</div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card in-progress-tasks">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon>work_history</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.inProgress }}</div>
              <div class="stat-label">En Progreso</div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card completed-tasks">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.done }}</div>
              <div class="stat-label">Completadas</div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card high-priority-tasks">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon>priority_high</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.highPriority }}</div>
              <div class="stat-label">Alta Prioridad</div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card overdue-tasks">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon>schedule</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.overdue }}</div>
              <div class="stat-label">Vencidas</div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Quick Actions -->
      <div class="dashboard-section">
        <h2 class="section-title">Acciones Rápidas</h2>
        <div class="quick-actions">
          <button mat-raised-button color="primary" routerLink="/tasks/new" class="action-button">
            <mat-icon>add</mat-icon>
            Nueva Tarea
          </button>
          <button mat-stroked-button routerLink="/tasks" class="action-button">
            <mat-icon>list</mat-icon>
            Ver Todas las Tareas
          </button>
          <button mat-stroked-button routerLink="/tasks/my" class="action-button">
            <mat-icon>assignment_ind</mat-icon>
            Mis Tareas
          </button>
        </div>
      </div>

      <!-- Progress Section -->
      <div class="dashboard-section" *ngIf="stats$ | async as stats">
        <h2 class="section-title">Progreso General</h2>
        <mat-card class="progress-card">
          <mat-card-content>
            <div class="progress-info">
              <span class="progress-label">Tareas Completadas</span>
              <span class="progress-percentage">{{ getCompletionPercentage(stats) }}%</span>
            </div>
            <mat-progress-bar 
              mode="determinate" 
              [value]="getCompletionPercentage(stats)"
              class="progress-bar">
            </mat-progress-bar>
            <div class="progress-details">
              <span>{{ stats.done }} de {{ stats.total }} tareas completadas</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Recent Tasks -->
      <div class="dashboard-section" *ngIf="recentTasks$ | async as tasks">
        <h2 class="section-title">Tareas Recientes</h2>
        <div class="recent-tasks" *ngIf="tasks.length > 0; else noRecentTasks">
          <mat-card *ngFor="let task of tasks.slice(0, 5)" class="task-card">
            <mat-card-content>
              <div class="task-header">
                <h3 class="task-title">{{ task.title }}</h3>
                <span class="task-status" [ngClass]="'status-' + task.status.toLowerCase()">
                  {{ getStatusLabel(task.status) }}
                </span>
              </div>
              <p class="task-description">{{ task.description | slice:0:100 }}...</p>
              <div class="task-meta">
                <span class="task-priority" [ngClass]="'priority-' + task.priority.toLowerCase()">
                  {{ getPriorityLabel(task.priority) }}
                </span>
                <span class="task-date">{{ formatDate(task.dueDate) }}</span>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
        
        <ng-template #noRecentTasks>
          <mat-card class="empty-state">
            <mat-card-content>
              <mat-icon class="empty-icon">task_alt</mat-icon>
              <h3>No hay tareas recientes</h3>
              <p>Crea tu primera tarea para comenzar</p>
              <button mat-raised-button color="primary" routerLink="/tasks/new">
                <mat-icon>add</mat-icon>
                Crear Primera Tarea
              </button>
            </mat-card-content>
          </mat-card>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 32px;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 8px;
      color: var(--mdc-theme-on-surface);
    }

    .welcome-message {
      font-size: 1.125rem;
      color: var(--mdc-theme-on-surface-variant);
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }

    .stat-card {
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      padding: 24px;
      gap: 16px;
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .total-tasks .stat-icon { background: var(--mdc-theme-primary); }
    .pending-tasks .stat-icon { background: #FF9800; }
    .in-progress-tasks .stat-icon { background: #2196F3; }
    .completed-tasks .stat-icon { background: #4CAF50; }
    .high-priority-tasks .stat-icon { background: #F44336; }
    .overdue-tasks .stat-icon { background: #9C27B0; }

    .stat-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .stat-content {
      flex: 1;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: var(--mdc-theme-on-surface);
      line-height: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--mdc-theme-on-surface-variant);
      margin-top: 4px;
    }

    .dashboard-section {
      margin-bottom: 40px;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 24px;
      color: var(--mdc-theme-on-surface);
    }

    .quick-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .action-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 8px;
    }

    .progress-card {
      border-radius: 12px;
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .progress-label {
      font-weight: 600;
      color: var(--mdc-theme-on-surface);
    }

    .progress-percentage {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--mdc-theme-primary);
    }

    .progress-bar {
      height: 8px;
      border-radius: 4px;
      margin-bottom: 12px;
    }

    .progress-details {
      font-size: 0.875rem;
      color: var(--mdc-theme-on-surface-variant);
      text-align: center;
    }

    .recent-tasks {
      display: grid;
      gap: 16px;
    }

    .task-card {
      border-radius: 8px;
      transition: transform 0.2s ease;
    }

    .task-card:hover {
      transform: translateX(4px);
    }

    .task-header {
      display: flex;
      justify-content: between;
      align-items: flex-start;
      margin-bottom: 12px;
      gap: 16px;
    }

    .task-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
      flex: 1;
      color: var(--mdc-theme-on-surface);
    }

    .task-status {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .status-todo { background: #FFF3E0; color: #E65100; }
    .status-in_progress { background: #E3F2FD; color: #0277BD; }
    .status-done { background: #E8F5E8; color: #2E7D32; }

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
    }

    .task-priority {
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .priority-low { background: #E8F5E8; color: #2E7D32; }
    .priority-medium { background: #FFF3E0; color: #E65100; }
    .priority-high { background: #FFEBEE; color: #C62828; }

    .task-date {
      color: var(--mdc-theme-on-surface-variant);
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
      border-radius: 12px;
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--mdc-theme-outline);
      margin-bottom: 16px;
    }

    .empty-state h3 {
      margin-bottom: 8px;
      color: var(--mdc-theme-on-surface);
    }

    .empty-state p {
      color: var(--mdc-theme-on-surface-variant);
      margin-bottom: 24px;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .quick-actions {
        flex-direction: column;
      }

      .action-button {
        justify-content: center;
      }

      .task-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
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
    MatProgressBarModule
  ]
})
export class DashboardComponent implements OnInit {
  labels = UI_LABELS;
  userProfile: UserProfile | null = null;
  stats$!: Observable<TaskStats>;
  recentTasks$!: Observable<Task[]>;

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userProfile = this.authService.getUserProfile();
    this.stats$ = this.taskService.getTaskStats();
    this.recentTasks$ = this.taskService.tasks$;
    
    // Load tasks to get stats
    this.taskService.getMyTasks().subscribe();
  }

  getCompletionPercentage(stats: TaskStats): number {
    if (stats.total === 0) return 0;
    return Math.round((stats.done / stats.total) * 100);
  }

  getStatusLabel(status: string): string {
    const statusLabels: Record<string, string> = {
      'TODO': this.labels.TODO,
      'IN_PROGRESS': this.labels.IN_PROGRESS,
      'DONE': this.labels.DONE
    };
    return statusLabels[status] || status;
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
      month: 'short',
      year: 'numeric'
    });
  }
}