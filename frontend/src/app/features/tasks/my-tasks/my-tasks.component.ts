import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { TaskService } from '../../../core/services/task.service';
import { AuthService } from '../../../core/services/auth.service';
import { Task, TaskStatus } from '../../../core/models/task.interface';
import { UI_LABELS } from '../../../shared/constants/ui-labels.constants';

@Component({
  selector: 'app-my-tasks',
  template: `
    <div class="my-tasks-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">{{ labels.MY_TASKS }}</h1>
          <button mat-raised-button color="primary" routerLink="/tasks/new">
            <mat-icon>add</mat-icon>
            {{ labels.NEW_TASK }}
          </button>
        </div>
        <p class="page-subtitle">Tareas asignadas a ti</p>
      </div>

      <!-- Task Columns -->
      <div class="kanban-board" *ngIf="tasks$ | async as tasks">
        <!-- TODO Column -->
        <div class="kanban-column">
          <div class="column-header todo-header">
            <h2 class="column-title">
              <mat-icon>schedule</mat-icon>
              {{ labels.TODO }}
            </h2>
            <span class="task-count">{{ getTasksByStatus(tasks, 'TODO').length }}</span>
          </div>
          
          <div class="column-content">
            <mat-card 
              *ngFor="let task of getTasksByStatus(tasks, 'TODO')" 
              class="task-card todo-card"
              [routerLink]="['/tasks', task.id]">
              <mat-card-content>
                <div class="task-header">
                  <h3 class="task-title">{{ task.title }}</h3>
                  <button 
                    mat-icon-button 
                    [matMenuTriggerFor]="taskMenu"
                    (click)="$event.stopPropagation()"
                    class="task-menu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  
                  <mat-menu #taskMenu="matMenu">
                    <button mat-menu-item (click)="changeTaskStatus(task, 'IN_PROGRESS')">
                      <mat-icon>play_arrow</mat-icon>
                      <span>Iniciar</span>
                    </button>
                    <button mat-menu-item [routerLink]="['/tasks', task.id, 'edit']">
                      <mat-icon>edit</mat-icon>
                      <span>{{ labels.EDIT }}</span>
                    </button>
                  </mat-menu>
                </div>

                <p class="task-description">{{ task.description | slice:0:100 }}...</p>

                <div class="task-footer">
                  <mat-chip [class]="'priority-' + task.priority.toLowerCase()">
                    {{ getPriorityLabel(task.priority) }}
                  </mat-chip>
                  <span class="task-date">{{ formatDate(task.dueDate) }}</span>
                </div>
              </mat-card-content>
            </mat-card>

            <div *ngIf="getTasksByStatus(tasks, 'TODO').length === 0" class="empty-column">
              <mat-icon>inbox</mat-icon>
              <p>No hay tareas pendientes</p>
            </div>
          </div>
        </div>

        <!-- IN_PROGRESS Column -->
        <div class="kanban-column">
          <div class="column-header in-progress-header">
            <h2 class="column-title">
              <mat-icon>work_history</mat-icon>
              {{ labels.IN_PROGRESS }}
            </h2>
            <span class="task-count">{{ getTasksByStatus(tasks, 'IN_PROGRESS').length }}</span>
          </div>
          
          <div class="column-content">
            <mat-card 
              *ngFor="let task of getTasksByStatus(tasks, 'IN_PROGRESS')" 
              class="task-card in-progress-card"
              [routerLink]="['/tasks', task.id]">
              <mat-card-content>
                <div class="task-header">
                  <h3 class="task-title">{{ task.title }}</h3>
                  <button 
                    mat-icon-button 
                    [matMenuTriggerFor]="taskMenu"
                    (click)="$event.stopPropagation()"
                    class="task-menu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  
                  <mat-menu #taskMenu="matMenu">
                    <button mat-menu-item (click)="changeTaskStatus(task, 'TODO')">
                      <mat-icon>pause</mat-icon>
                      <span>Pausar</span>
                    </button>
                    <button mat-menu-item (click)="changeTaskStatus(task, 'DONE')">
                      <mat-icon>check_circle</mat-icon>
                      <span>Completar</span>
                    </button>
                    <button mat-menu-item [routerLink]="['/tasks', task.id, 'edit']">
                      <mat-icon>edit</mat-icon>
                      <span>{{ labels.EDIT }}</span>
                    </button>
                  </mat-menu>
                </div>

                <p class="task-description">{{ task.description | slice:0:100 }}...</p>

                <div class="task-footer">
                  <mat-chip [class]="'priority-' + task.priority.toLowerCase()">
                    {{ getPriorityLabel(task.priority) }}
                  </mat-chip>
                  <span class="task-date">{{ formatDate(task.dueDate) }}</span>
                </div>
              </mat-card-content>
            </mat-card>

            <div *ngIf="getTasksByStatus(tasks, 'IN_PROGRESS').length === 0" class="empty-column">
              <mat-icon>work_history</mat-icon>
              <p>No hay tareas en progreso</p>
            </div>
          </div>
        </div>

        <!-- DONE Column -->
        <div class="kanban-column">
          <div class="column-header done-header">
            <h2 class="column-title">
              <mat-icon>check_circle</mat-icon>
              {{ labels.DONE }}
            </h2>
            <span class="task-count">{{ getTasksByStatus(tasks, 'DONE').length }}</span>
          </div>
          
          <div class="column-content">
            <mat-card 
              *ngFor="let task of getTasksByStatus(tasks, 'DONE')" 
              class="task-card done-card"
              [routerLink]="['/tasks', task.id]">
              <mat-card-content>
                <div class="task-header">
                  <h3 class="task-title">{{ task.title }}</h3>
                  <button 
                    mat-icon-button 
                    [matMenuTriggerFor]="taskMenu"
                    (click)="$event.stopPropagation()"
                    class="task-menu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  
                  <mat-menu #taskMenu="matMenu">
                    <button mat-menu-item (click)="changeTaskStatus(task, 'IN_PROGRESS')">
                      <mat-icon>replay</mat-icon>
                      <span>Reabrir</span>
                    </button>
                    <button mat-menu-item [routerLink]="['/tasks', task.id, 'edit']">
                      <mat-icon>edit</mat-icon>
                      <span>{{ labels.EDIT }}</span>
                    </button>
                  </mat-menu>
                </div>

                <p class="task-description">{{ task.description | slice:0:100 }}...</p>

                <div class="task-footer">
                  <mat-chip [class]="'priority-' + task.priority.toLowerCase()">
                    {{ getPriorityLabel(task.priority) }}
                  </mat-chip>
                  <span class="task-date">{{ formatDate(task.dueDate) }}</span>
                </div>
              </mat-card-content>
            </mat-card>

            <div *ngIf="getTasksByStatus(tasks, 'DONE').length === 0" class="empty-column">
              <mat-icon>check_circle_outline</mat-icon>
              <p>No hay tareas completadas</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="(tasks$ | async)?.length === 0" class="empty-state">
        <mat-card>
          <mat-card-content>
            <mat-icon class="empty-icon">assignment_ind</mat-icon>
            <h3>No tienes tareas asignadas</h3>
            <p>Cuando tengas tareas asignadas, aparecerán aquí organizadas por estado</p>
            <button mat-raised-button color="primary" routerLink="/tasks/new">
              <mat-icon>add</mat-icon>
              {{ labels.NEW_TASK }}
            </button>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .my-tasks-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 8px;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
      color: var(--mdc-theme-on-surface);
    }

    .page-subtitle {
      color: var(--mdc-theme-on-surface-variant);
      margin: 0;
      font-size: 1.125rem;
    }

    .kanban-board {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      min-height: 600px;
    }

    .kanban-column {
      background: var(--mdc-theme-surface-variant);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
    }

    .column-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding: 8px 12px;
      border-radius: 8px;
    }

    .todo-header {
      background: #FFF3E0;
      color: #E65100;
    }

    .in-progress-header {
      background: #E3F2FD;
      color: #0277BD;
    }

    .done-header {
      background: #E8F5E8;
      color: #2E7D32;
    }

    .column-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .task-count {
      background: rgba(255, 255, 255, 0.8);
      color: inherit;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .column-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .task-card {
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      border-left: 4px solid transparent;
    }

    .task-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .todo-card {
      border-left-color: #FF9800;
    }

    .in-progress-card {
      border-left-color: #2196F3;
    }

    .done-card {
      border-left-color: #4CAF50;
      opacity: 0.8;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .task-title {
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
      color: var(--mdc-theme-on-surface);
      flex: 1;
      line-height: 1.4;
    }

    .task-menu {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
    }

    .task-description {
      color: var(--mdc-theme-on-surface-variant);
      margin: 0 0 16px 0;
      line-height: 1.5;
      font-size: 0.875rem;
    }

    .task-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
    }

    .task-date {
      color: var(--mdc-theme-on-surface-variant);
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

    .empty-column {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
      color: var(--mdc-theme-on-surface-variant);
      text-align: center;
    }

    .empty-column mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 12px;
      opacity: 0.5;
    }

    .empty-column p {
      margin: 0;
      font-size: 0.875rem;
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
    }

    .empty-state mat-card {
      max-width: 400px;
      margin: 0 auto;
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

    @media (max-width: 1024px) {
      .kanban-board {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: stretch;
      }

      .kanban-column {
        padding: 12px;
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
export class MyTasksComponent implements OnInit {
  labels = UI_LABELS;
  tasks$!: Observable<Task[]>;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.tasks$ = this.taskService.tasks$;
    this.taskService.getMyTasks().subscribe();
  }

  getTasksByStatus(tasks: Task[], status: TaskStatus): Task[] {
    return tasks.filter(task => task.status === status);
  }

  changeTaskStatus(task: Task, newStatus: TaskStatus): void {
    this.taskService.updateTaskStatus(task.id, newStatus).subscribe();
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
      month: 'short'
    });
  }
}