import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';
import { TaskStats, Task, TaskStatus, TaskPriority } from '../../core/models/task.interface';
import { UserProfile } from '../../core/models/user.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatGridListModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="welcome-section">
        <h1>¡Hola{{ userProfile ? ', ' + userProfile.firstName : '' }}!</h1>
        <p>Aquí tienes un resumen de tus tareas</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid" *ngIf="stats">
        <mat-card class="stat-card total">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>assignment</mat-icon>
              </div>
              <div class="stat-info">
                <h3>{{ stats.total }}</h3>
                <p>Total de Tareas</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card completed">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>check_circle</mat-icon>
              </div>
              <div class="stat-info">
                <h3>{{ stats.completed }}</h3>
                <p>Completadas</p>
                <div class="progress-info" *ngIf="stats.total > 0">
                  <mat-progress-bar 
                    mode="determinate" 
                    [value]="getCompletionPercentage()">
                  </mat-progress-bar>
                  <span>{{ getCompletionPercentage() }}%</span>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card in-progress">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>hourglass_empty</mat-icon>
              </div>
              <div class="stat-info">
                <h3>{{ stats.inProgress }}</h3>
                <p>En Progreso</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card overdue">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>schedule</mat-icon>
              </div>
              <div class="stat-info">
                <h3>{{ stats.overdue }}</h3>
                <p>Vencidas</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Status Breakdown -->
      <div class="content-grid">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Estado de las Tareas</mat-card-title>
          </mat-card-header>
          <mat-card-content *ngIf="stats">
            <div class="status-breakdown">
              <div class="status-item">
                <div class="status-indicator todo"></div>
                <span class="status-label">Por Hacer</span>
                <span class="status-count">{{ stats.todo }}</span>
              </div>
              <div class="status-item">
                <div class="status-indicator in-progress"></div>
                <span class="status-label">En Progreso</span>
                <span class="status-count">{{ stats.inProgress }}</span>
              </div>
              <div class="status-item">
                <div class="status-indicator in-review"></div>
                <span class="status-label">En Revisión</span>
                <span class="status-count">{{ stats.inReview }}</span>
              </div>
              <div class="status-item">
                <div class="status-indicator completed"></div>
                <span class="status-label">Completadas</span>
                <span class="status-count">{{ stats.completed }}</span>
              </div>
              <div class="status-item">
                <div class="status-indicator cancelled"></div>
                <span class="status-label">Canceladas</span>
                <span class="status-count">{{ stats.cancelled }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Prioridades</mat-card-title>
          </mat-card-header>
          <mat-card-content *ngIf="stats">
            <div class="priority-breakdown">
              <div class="priority-item">
                <div class="priority-indicator urgent"></div>
                <span class="priority-label">Urgente</span>
                <span class="priority-count">{{ stats.urgentPriority }}</span>
              </div>
              <div class="priority-item">
                <div class="priority-indicator high"></div>
                <span class="priority-label">Alta</span>
                <span class="priority-count">{{ stats.highPriority }}</span>
              </div>
              <div class="priority-item">
                <div class="priority-indicator medium"></div>
                <span class="priority-label">Media</span>
                <span class="priority-count">{{ stats.mediumPriority }}</span>
              </div>
              <div class="priority-item">
                <div class="priority-indicator low"></div>
                <span class="priority-label">Baja</span>
                <span class="priority-count">{{ stats.lowPriority }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Recent Tasks -->
      <mat-card class="recent-tasks-card" *ngIf="recentTasks.length > 0">
        <mat-card-header>
          <mat-card-title>Tareas Recientes</mat-card-title>
          <button mat-button routerLink="/tasks" color="primary">
            Ver todas
            <mat-icon>arrow_forward</mat-icon>
          </button>
        </mat-card-header>
        <mat-card-content>
          <div class="task-list">
            <div class="task-item" *ngFor="let task of recentTasks">
              <div class="task-info">
                <h4 class="task-title">{{ task.title }}</h4>
                <p class="task-description">{{ task.description }}</p>
                <div class="task-meta">
                  <span class="task-status" [class]="'status-' + task.status.toLowerCase()">
                    {{ getStatusLabel(task.status) }}
                  </span>
                  <span class="task-priority" [class]="'priority-' + task.priority.toLowerCase()">
                    {{ getPriorityLabel(task.priority) }}
                  </span>
                  <span class="task-date" *ngIf="task.dueDate">
                    <mat-icon>schedule</mat-icon>
                    {{ formatDate(task.dueDate) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3>Acciones Rápidas</h3>
        <div class="actions-grid">
          <button mat-raised-button color="primary" routerLink="/tasks/new">
            <mat-icon>add</mat-icon>
            Nueva Tarea
          </button>
          <button mat-raised-button routerLink="/tasks">
            <mat-icon>list</mat-icon>
            Ver Tareas
          </button>
          <button mat-raised-button routerLink="/profile">
            <mat-icon>person</mat-icon>
            Mi Perfil
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-section {
      margin-bottom: 32px;
    }

    .welcome-section h1 {
      font-size: 2.5rem;
      font-weight: 300;
      margin: 0 0 8px 0;
      color: #1976d2;
    }

    .welcome-section p {
      color: rgba(0,0,0,0.6);
      font-size: 1.1rem;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      transition: transform 0.2s ease-in-out;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-card.total { border-left: 4px solid #2196f3; }
    .stat-card.completed { border-left: 4px solid #4caf50; }
    .stat-card.in-progress { border-left: 4px solid #ff9800; }
    .stat-card.overdue { border-left: 4px solid #f44336; }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      padding: 12px;
      border-radius: 50%;
      background: rgba(25, 118, 210, 0.1);
    }

    .stat-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: #1976d2;
    }

    .stat-info h3 {
      font-size: 2rem;
      font-weight: 500;
      margin: 0;
      color: #333;
    }

    .stat-info p {
      margin: 4px 0 8px 0;
      color: rgba(0,0,0,0.6);
      font-size: 0.9rem;
    }

    .progress-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .progress-info mat-progress-bar {
      flex: 1;
      height: 6px;
    }

    .progress-info span {
      font-size: 0.8rem;
      color: rgba(0,0,0,0.6);
      font-weight: 500;
    }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .chart-card mat-card-header {
      margin-bottom: 16px;
    }

    .status-breakdown,
    .priority-breakdown {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .status-item,
    .priority-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
    }

    .status-indicator,
    .priority-indicator {
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }

    .status-indicator.todo { background-color: #2196f3; }
    .status-indicator.in-progress { background-color: #ff9800; }
    .status-indicator.in-review { background-color: #9c27b0; }
    .status-indicator.completed { background-color: #4caf50; }
    .status-indicator.cancelled { background-color: #f44336; }

    .priority-indicator.urgent { background-color: #3f51b5; }
    .priority-indicator.high { background-color: #f44336; }
    .priority-indicator.medium { background-color: #ff9800; }
    .priority-indicator.low { background-color: #4caf50; }

    .status-label,
    .priority-label {
      flex: 1;
      font-size: 0.9rem;
    }

    .status-count,
    .priority-count {
      font-weight: 600;
      color: #333;
    }

    .recent-tasks-card {
      margin-bottom: 32px;
    }

    .recent-tasks-card mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .task-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .task-item {
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: #fafafa;
    }

    .task-title {
      margin: 0 0 8px 0;
      font-size: 1rem;
      font-weight: 500;
    }

    .task-description {
      margin: 0 0 12px 0;
      color: rgba(0,0,0,0.6);
      font-size: 0.875rem;
      line-height: 1.4;
    }

    .task-meta {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }

    .task-status,
    .task-priority {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
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

    .task-date {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.75rem;
      color: rgba(0,0,0,0.6);
    }

    .task-date mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .quick-actions {
      margin-top: 40px;
    }

    .quick-actions h3 {
      margin-bottom: 16px;
      color: #333;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
    }

    .actions-grid button {
      padding: 12px 20px;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .welcome-section h1 {
        font-size: 1.8rem;
      }

      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }

      .content-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .recent-tasks-card mat-card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .task-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: TaskStats | null = null;
  recentTasks: Task[] = [];
  userProfile: UserProfile | null = null;
  loading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserProfile(): void {
    this.userProfile = this.authService.getUserProfile();
  }

  private loadDashboardData(): void {
    this.loading = true;

    // Cargar estadísticas
    this.taskService.getMyTaskStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.stats = stats;
        },
        error: (error) => {
          console.error('Error loading stats:', error);
        }
      });

    // Cargar tareas recientes
    this.taskService.getMyTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks) => {
          // Tomar las 5 tareas más recientes
          this.recentTasks = tasks
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 5);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading tasks:', error);
          this.loading = false;
        }
      });
  }

  getCompletionPercentage(): number {
    if (!this.stats || this.stats.total === 0) return 0;
    return Math.round((this.stats.completed / this.stats.total) * 100);
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