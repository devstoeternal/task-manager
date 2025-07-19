import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // ✅ Agregado para routerLink
import { Subject, takeUntil } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
    RouterModule, // ✅ Para routerLink y queryParams
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="container-responsive py-6">
      <!-- Welcome Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          ¡Bienvenido, {{currentUser?.firstName}}!
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
          <mat-card class="stats-card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total de Tareas</p>
                <p class="text-3xl font-bold text-gray-900">{{stats?.totalTasks || 0}}</p>
              </div>
              <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <mat-icon class="text-blue-600">assignment</mat-icon>
              </div>
            </div>
          </mat-card>

          <!-- Completed Tasks -->
          <mat-card class="stats-card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Completadas</p>
                <p class="text-3xl font-bold text-green-600">{{stats?.completedTasks || 0}}</p>
              </div>
              <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <mat-icon class="text-green-600">check_circle</mat-icon>
              </div>
            </div>
          </mat-card>

          <!-- Pending Tasks -->
          <mat-card class="stats-card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Pendientes</p>
                <p class="text-3xl font-bold text-orange-600">{{stats?.pendingTasks || 0}}</p>
              </div>
              <div class="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <mat-icon class="text-orange-600">schedule</mat-icon>
              </div>
            </div>
          </mat-card>

          <!-- High Priority Tasks -->
          <mat-card class="stats-card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Alta Prioridad</p>
                <p class="text-3xl font-bold text-red-600">{{stats?.highPriorityTasks || 0}}</p>
              </div>
              <div class="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <mat-icon class="text-red-600">priority_high</mat-icon>
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
              <span>Nueva Tarea</span>
            </button>
            
            <!-- ✅ Cambié de button a anchor (a) para queryParams -->
            <a 
              mat-stroked-button 
              routerLink="/tasks"
              [queryParams]="{status: 'PENDING'}"
              class="h-12 flex items-center justify-center space-x-2 no-underline">
              <mat-icon>list</mat-icon>
              <span>Ver Pendientes</span>
            </a>
            
            <a 
              mat-stroked-button 
              routerLink="/tasks"
              [queryParams]="{priority: 'HIGH'}"
              class="h-12 flex items-center justify-center space-x-2 no-underline">
              <mat-icon>priority_high</mat-icon>
              <span>Alta Prioridad</span>
            </a>
            
            <a 
              mat-stroked-button 
              routerLink="/tasks"
              [queryParams]="{status: 'COMPLETED'}"
              class="h-12 flex items-center justify-center space-x-2 no-underline">
              <mat-icon>check_circle</mat-icon>
              <span>Completadas</span>
            </a>
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

    .mat-mdc-card {
      border-radius: 12px;
    }

    .mat-mdc-raised-button,
    .mat-mdc-stroked-button {
      border-radius: 8px;
    }

    .no-underline {
      text-decoration: none;
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  labels = UI_LABELS;
  
  currentUser: User | null = null;
  stats: TaskStats | null = null;
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
    
    // Simular datos por ahora
    setTimeout(() => {
      this.stats = {
        totalTasks: 25,
        completedTasks: 18,
        pendingTasks: 7,
        inProgressTasks: 3,
        highPriorityTasks: 4,
        overdueTasks: 1,
        tasksCompletedThisWeek: 6,
        tasksCompletedThisMonth: 15
      };
      this.isLoading = false;
    }, 1000);
  }
}