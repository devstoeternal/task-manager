import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { TaskService } from '../../../core/services/task.service';
import { AuthService } from '../../../core/services/auth.service';
import { UI_LABELS } from '../../../shared/constants/ui-labels.constants';
import { Task, TaskStats, Status, Priority } from '../../../shared/models/task.interface';
import { User } from '../../../shared/models/user.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="container-responsive py-6">
      <!-- Welcome Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {{labels.WELCOME}}, {{currentUser?.firstName}}! 👋
        </h1>
        <p class="text-gray-600">
          Aquí tienes un resumen de tus tareas y productividad
        </p>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="flex justify-center items-center py-12">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <!-- Dashboard Content -->
      <div *ngIf="!isLoading" class="space-y-8">
        
        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Tasks -->
          <mat-card class="stats-card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{labels.TOTAL_TASKS}}</p>
                <p class="text-3xl font-bold text-gray-900">{{stats?.totalTasks || 0}}</p>
              </div>
              <div class="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <mat-icon class="text-primary-600">assignment</mat-icon>
              </div>
            </div>
            <div class="mt-4 flex items-center text-sm">
              <span class="text-green-600 font-medium">
                +{{stats?.tasksCompletedThisWeek || 0}}
              </span>
              <span class="text-gray-500 ml-1">esta semana</span>
            </div>
          </mat-card>

          <!-- Completed Tasks -->
          <mat-card class="stats-card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{labels.COMPLETED_TASKS}}</p>
                <p class="text-3xl font-bold text-green-600">{{stats?.completedTasks || 0}}</p>
              </div>
              <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <mat-icon class="text-green-600">check_circle</mat-icon>
              </div>
            </div>
            <div class="mt-4 flex items-center text-sm">
              <span class="text-gray-600">
                {{getCompletionRate()}}% de finalización
              </span>
            </div>
          </mat-card>

          <!-- Pending Tasks -->
          <mat-card class="stats-card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{labels.PENDING_TASKS}}</p>
                <p class="text-3xl font-bold text-orange-600">{{stats?.pendingTasks || 0}}</p>
              </div>
              <div class="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <mat-icon class="text-orange-600">schedule</mat-icon>
              </div>
            </div>
            <div class="mt-4 flex items-center text-sm">
              <span class="text-gray-600">
                {{stats?.inProgressTasks || 0}} en progreso
              </span>
            </div>
          </mat-card>

          <!-- High Priority Tasks -->
          <mat-card class="stats-card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{labels.HIGH_PRIORITY_TASKS}}</p>
                <p class="text-3xl font-bold text-red-600">{{stats?.highPriorityTasks || 0}}</p>
              </div>
              <div class="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <mat-icon class="text-red-600">priority_high</mat-icon>
              </div>
            </div>
            <div class="mt-4 flex items-center text-sm">
              <span class="text-red-600" *ngIf="stats && stats.overdueTasks > 0">
                {{stats.overdueTasks}} vencidas
              </span>
              <span class="text-gray-600" *ngIf="!stats || stats.overdueTasks === 0">
                Al día
              </span>
            </div>
          </mat-card>
        </div>

        <!-- Recent Tasks and Upcoming Tasks -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- Recent Tasks -->
          <mat-card class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{{labels.RECENT_TASKS}}</h3>
              <button mat-button color="primary" routerLink="/tasks">
                Ver todas
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
            
            <div *ngIf="recentTasks.length === 0" class="text-center py-8">
              <mat-icon class="text-gray-400 text-4xl mb-2">assignment</mat-icon>
              <p class="text-gray-500">{{labels.NO_TASKS_FOUND}}</p>
            </div>

            <div class="space-y-3" *ngIf="recentTasks.length > 0">
              <div 
                *ngFor="let task of recentTasks"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{task.title}}</p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{task.createdAt | date:'short'}}
                  </p>
                </div>
                <div class="flex items-center space-x-2">
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
                </div>
              </div>
            </div>
          </mat-card>

          <!-- Upcoming Tasks -->
          <mat-card class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{{labels.UPCOMING_TASKS}}</h3>
              <button mat-button color="primary" routerLink="/tasks">
                Ver todas
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>

            <div *ngIf="upcomingTasks.length === 0" class="text-center py-8">
              <mat-icon class="text-gray-400 text-4xl mb-2">event</mat-icon>
              <p class="text-gray-500">No hay tareas próximas</p>
            </div>

            <div class="space-y-3" *ngIf="upcomingTasks.length > 0">
              <div 
                *ngFor="let task of upcomingTasks"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{task.title}}</p>
                  <p class="text-xs text-gray-500 mt-1">
                    Vence: {{task.dueDate | date:'short'}}
                  </p>
                </div>
                <div class="flex items-center space-x-2">
                  <mat-chip 
                    [class]="getPriorityClass(task.priority)"
                    class="priority-chip text-xs">
                    {{getPriorityLabel(task.priority)}}
                  </mat-chip>
                  <div class="text-xs text-gray-500">
                    {{getDaysUntilDue(task.dueDate)}}
                  </div>
                </div>
              </div>
            </div>
          </mat-card>
        </div>

        <!-- Quick Actions -->
        <mat-card class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              mat-raised-button 
              color="primary" 
              routerLink="/tasks/new"
              class="h-12 flex items-center justify-center space-x-2">
              <mat-icon>add</mat-icon>
              <span>{{labels.NEW_TASK}}</span>
            </button>
            
            <button 
              mat-stroked-button 
              routerLink="/tasks"
              [queryParams]="{status: 'PENDING'}"
              class="h-12 flex items-center justify-center space-x-2">
              <mat-icon>list</mat-icon>
              <span>Ver Pendientes</span>
            </button>
            
            <button 
              mat-stroked-button 
              routerLink="/tasks"
              [queryParams]="{priority: 'HIGH'}"
              class="h-12 flex items-center justify-center space-x-2">
              <mat-icon>priority_high</mat-icon>
              <span>Alta Prioridad</span>
            </button>
            
            <button 
              mat-stroked-button 
              routerLink="/tasks"
              [queryParams]="{status: 'COMPLETED'}"
              class="h-12 flex items-center justify-center space-x-2">
              <mat-icon>check_circle</mat-icon>
              <span>Completadas</span>
            </button>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .stats-card {
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }

    .stats-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .priority-chip {
      font-size: 0.75rem;
      height: auto;
      padding: 2px 8px;
      border-radius: 12px;
    }

    .mat-mdc-card {
      border-radius: 12px;
    }

    .mat-mdc-raised-button,
    .mat-mdc-stroked-button {
      border-radius: 8px;
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  labels = UI_LABELS;
  
  currentUser: User | null = null;
  stats: TaskStats | null = null;
  recentTasks: Task[] = [];
  upcomingTasks: Task[] = [];
  isLoading = true;

  private destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    
    // Subscribe to current user
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData(): void {
    this.isLoading = true;

    // Load all dashboard data in parallel
    forkJoin({
      stats: this.taskService.getTaskStats(),
      recentTasks: this.taskService.loadTasks(),
      upcomingTasks: this.taskService.getUpcomingTasks()
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.stats = data.stats;
        // Get the 5 most recent tasks
        this.recentTasks = data.recentTasks
          .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
          .slice(0, 5);
        // Get the 5 most urgent upcoming tasks
        this.upcomingTasks = data.upcomingTasks
          .sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0))
          .slice(0, 5);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      }
    });
  }

  getCompletionRate(): number {
    if (!this.stats || this.stats.totalTasks === 0) return 0;
    return Math.round((this.stats.completedTasks / this.stats.totalTasks) * 100);
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

  getDaysUntilDue(dueDate?: Date): string {
    if (!dueDate) return '';

    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} días atrasada`;
    } else if (diffDays === 0) {
      return 'Vence hoy';
    } else if (diffDays === 1) {
      return 'Vence mañana';
    } else {
      return `${diffDays} días`;
    }
  }
}