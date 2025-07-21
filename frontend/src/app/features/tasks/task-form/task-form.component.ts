import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TaskService } from '../../../core/services/task.service';
import { AuthService } from '../../../core/services/auth.service';
import { CreateTaskRequest, UpdateTaskRequest, Task, TaskPriority } from '../../../core/models/task.interface';
import { UI_LABELS } from '../../../shared/constants/ui-labels.constants';

@Component({
  selector: 'app-task-form',
  template: `
    <div class="task-form-container">
      <div class="page-header">
        <h1 class="page-title">{{ isEditMode ? labels.EDIT_TASK : labels.NEW_TASK }}</h1>
      </div>

      <mat-card class="form-card">
        <mat-card-content>
          <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="task-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ labels.TASK_TITLE }}</mat-label>
              <input matInput formControlName="title" placeholder="Ingresa el título de la tarea">
              <mat-error *ngIf="taskForm.get('title')?.hasError('required')">
                {{ labels.REQUIRED_FIELD }}
              </mat-error>
              <mat-error *ngIf="taskForm.get('title')?.hasError('minlength')">
                El título debe tener al menos 3 caracteres
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ labels.TASK_DESCRIPTION }}</mat-label>
              <textarea 
                matInput 
                formControlName="description" 
                placeholder="Describe la tarea"
                rows="4">
              </textarea>
              <mat-error *ngIf="taskForm.get('description')?.hasError('required')">
                {{ labels.REQUIRED_FIELD }}
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ labels.TASK_PRIORITY }}</mat-label>
              <mat-select formControlName="priority">
                <mat-option value="LOW">{{ labels.LOW }}</mat-option>
                <mat-option value="MEDIUM">{{ labels.MEDIUM }}</mat-option>
                <mat-option value="HIGH">{{ labels.HIGH }}</mat-option>
              </mat-select>
              <mat-error *ngIf="taskForm.get('priority')?.hasError('required')">
                {{ labels.REQUIRED_FIELD }}
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ labels.TASK_DUE_DATE }}</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="dueDate">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="taskForm.get('dueDate')?.hasError('required')">
                {{ labels.REQUIRED_FIELD }}
              </mat-error>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">
                {{ labels.CANCEL }}
              </button>
              <button 
                mat-raised-button 
                color="primary" 
                type="submit"
                [disabled]="taskForm.invalid || isLoading">
                <span *ngIf="!isLoading">{{ labels.SAVE }}</span>
                <span *ngIf="isLoading">{{ labels.SAVING }}</span>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .task-form-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
      color: var(--mdc-theme-on-surface);
    }

    .form-card {
      border-radius: 12px;
    }

    .task-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 16px;
    }

    @media (max-width: 768px) {
      .form-actions {
        flex-direction: column;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ]
})
export class TaskFormComponent implements OnInit {
  labels = UI_LABELS;
  taskForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  taskId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      priority: ['MEDIUM', Validators.required],
      dueDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.taskId;

    if (this.isEditMode && this.taskId) {
      this.loadTask(this.taskId);
    }
  }

  loadTask(id: number): void {
    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          priority: task.priority,
          dueDate: new Date(task.dueDate)
        });
      },
      error: () => {
        this.snackBar.open('Error al cargar la tarea', this.labels.CLOSE, {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.router.navigate(['/tasks']);
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.isLoading = true;
      const formValue = this.taskForm.value;
      
      const taskData = {
        title: formValue.title,
        description: formValue.description,
        priority: formValue.priority as TaskPriority,
        dueDate: formValue.dueDate.toISOString()
      };

      if (this.isEditMode && this.taskId) {
        const updateData: UpdateTaskRequest = {
          ...taskData,
          status: 'TODO' // Default status for update
        };
        
        this.taskService.updateTask(this.taskId, updateData).subscribe({
          next: () => {
            this.isLoading = false;
            this.snackBar.open(this.labels.TASK_UPDATED, this.labels.CLOSE, {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/tasks']);
          },
          error: () => {
            this.isLoading = false;
          }
        });
      } else {
        const createData: CreateTaskRequest = taskData;
        
        this.taskService.createTask(createData).subscribe({
          next: () => {
            this.isLoading = false;
            this.snackBar.open(this.labels.TASK_CREATED, this.labels.CLOSE, {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/tasks']);
          },
          error: () => {
            this.isLoading = false;
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }
}