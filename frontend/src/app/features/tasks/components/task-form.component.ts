import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../../../core/services/task.service';
import { UI_LABELS } from '../../../shared/constants/ui-labels.constants';
import { Task, Priority, Status, CreateTaskRequest, UpdateTaskRequest } from '../../../shared/models/task.interface';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container-responsive py-6">
      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center space-x-4 mb-4">
          <button 
            mat-icon-button 
            (click)="goBack()"
            class="bg-gray-100 hover:bg-gray-200">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              {{isEditMode ? labels.EDIT_TASK : labels.NEW_TASK}}
            </h1>
            <p class="text-gray-600 mt-1">
              {{isEditMode ? 'Modifica los detalles de la tarea' : 'Crea una nueva tarea para tu lista'}}
            </p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="flex justify-center items-center py-12">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <!-- Task Form -->
      <div *ngIf="!isLoading" class="max-w-2xl">
        <mat-card class="p-6">
          <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <!-- Title -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{labels.TASK_TITLE}} *</mat-label>
              <input 
                matInput 
                formControlName="title"
                [placeholder]="labels.TASK_TITLE"
                maxlength="255">
              <mat-hint align="end">{{taskForm.get('title')?.value?.length || 0}}/255</mat-hint>
              <mat-error *ngIf="taskForm.get('title')?.hasError('required')">
                {{labels.REQUIRED_FIELD}}
              </mat-error>
              <mat-error *ngIf="taskForm.get('title')?.hasError('maxlength')">
                Máximo 255 caracteres
              </mat-error>
            </mat-form-field>

            <!-- Description -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{labels.TASK_DESCRIPTION}}</mat-label>
              <textarea 
                matInput 
                formControlName="description"
                [placeholder]="labels.TASK_DESCRIPTION"
                rows="4"
                maxlength="1000">
              </textarea>
              <mat-hint align="end">{{taskForm.get('description')?.value?.length || 0}}/1000</mat-hint>
              <mat-error *ngIf="taskForm.get('description')?.hasError('maxlength')">
                Máximo 1000 caracteres
              </mat-error>
            </mat-form-field>

            <!-- Priority and Status Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <!-- Priority -->
              <mat-form-field appearance="outline">
                <mat-label>{{labels.PRIORITY}} *</mat-label>
                <mat-select formControlName="priority">
                  <mat-option value="LOW">
                    <div class="flex items-center space-x-2">
                      <span class="priority-low px-2 py-1 rounded text-xs">{{labels.LOW}}</span>
                    </div>
                  </mat-option>
                  <mat-option value="MEDIUM">
                    <div class="flex items-center space-x-2">
                      <span class="priority-medium px-2 py-1 rounded text-xs">{{labels.MEDIUM}}</span>
                    </div>
                  </mat-option>
                  <mat-option value="HIGH">
                    <div class="flex items-center space-x-2">
                      <span class="priority-high px-2 py-1 rounded text-xs">{{labels.HIGH}}</span>
                    </div>
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="taskForm.get('priority')?.hasError('required')">
                  {{labels.REQUIRED_FIELD}}
                </mat-error>
              </mat-form-field>

              <!-- Status -->
              <mat-form-field appearance="outline">
                <mat-label>{{labels.STATUS}} *</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="PENDING">
                    <div class="flex items-center space-x-2">
                      <span class="status-pending px-2 py-1 rounded text-xs">{{labels.PENDING}}</span>
                    </div>
                  </mat-option>
                  <mat-option value="IN_PROGRESS">
                    <div class="flex items-center space-x-2">
                      <span class="status-in-progress px-2 py-1 rounded text-xs">{{labels.IN_PROGRESS}}</span>
                    </div>
                  </mat-option>
                  <mat-option value="COMPLETED">
                    <div class="flex items-center space-x-2">
                      <span class="status-completed px-2 py-1 rounded text-xs">{{labels.COMPLETED}}</span>
                    </div>
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="taskForm.get('status')?.hasError('required')">
                  {{labels.REQUIRED_FIELD}}
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Due Date -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{labels.DUE_DATE}}</mat-label>
              <input 
                matInput 
                [matDatepicker]="picker" 
                formControlName="dueDate"
                [min]="minDate">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-hint>Opcional - Selecciona una fecha límite para la tarea</mat-hint>
              <mat-error *ngIf="taskForm.get('dueDate')?.hasError('matDatepickerMin')">
                La fecha no puede ser anterior a hoy
              </mat-error>
            </mat-form-field>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-3">
              <div class="flex">
                <mat-icon class="text-red-400 mr-2">error</mat-icon>
                <div class="text-sm text-red-700">{{errorMessage}}</div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
              <button 
                type="button"
                mat-stroked-button 
                (click)="goBack()"
                [disabled]="isSubmitting"
                class="w-full sm:w-auto">
                {{labels.CANCEL}}
              </button>
              
              <button 
                type="submit"
                mat-raised-button 
                color="primary"
                [disabled]="taskForm.invalid || isSubmitting"
                class="w-full sm:w-auto">
                <div class="flex items-center justify-center space-x-2">
                  <mat-spinner *ngIf="isSubmitting" diameter="20" class="mr-2"></mat-spinner>
                  <span>
                    {{isSubmitting ? labels.LOADING : (isEditMode ? labels.UPDATE : labels.CREATE)}}
                  </span>
                </div>
              </button>
            </div>
          </form>
        </mat-card>

        <!-- Help Card -->
        <mat-card class="mt-6 p-4 bg-blue-50">
          <div class="flex items-start space-x-3">
            <mat-icon class="text-blue-600 mt-1">info</mat-icon>
            <div>
              <h3 class="font-semibold text-blue-900 mb-2">Consejos para crear tareas efectivas</h3>
              <ul class="text-sm text-blue-800 space-y-1">
                <li>• Usa títulos claros y descriptivos</li>
                <li>• Establece prioridades según la importancia</li>
                <li>• Incluye fechas límite para tareas urgentes</li>
                <li>• Añade descripciones detalladas para tareas complejas</li>
              </ul>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .mat-mdc-card {
      border-radius: 12px;
    }

    .mat-mdc-form-field {
      margin-bottom: 0;
    }

    .mat-mdc-raised-button,
    .mat-mdc-stroked-button {
      border-radius: 8px;
    }

    .priority-low,
    .priority-medium,
    .priority-high,
    .status-pending,
    .status-in-progress,
    .status-completed {
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 12px;
    }

    textarea.mat-mdc-input-element {
      resize: vertical;
      min-height: 100px;
    }

    /* Loading state animation */
    .mat-progress-spinner {
      display: inline-block;
    }
  `]
})
export class TaskFormComponent implements OnInit {
  labels = UI_LABELS;
  
  taskForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  taskId: number | null = null;
  minDate = new Date(); // Minimum date is today

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.createForm();
  }

  ngOnInit(): void {
    this.checkRouteMode();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.maxLength(1000)]],
      priority: ['MEDIUM', [Validators.required]],
      status: ['PENDING', [Validators.required]],
      dueDate: ['']
    });
  }

  private checkRouteMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.isEditMode = true;
      this.taskId = parseInt(id, 10);
      this.loadTask();
    }
  }

  private loadTask(): void {
    if (!this.taskId) return;

    this.isLoading = true;
    this.taskService.getTask(this.taskId).subscribe({
      next: (task) => {
        this.populateForm(task);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading task:', error);
        this.errorMessage = 'Error al cargar la tarea';
        this.isLoading = false;
      }
    });
  }

  private populateForm(task: Task): void {
    this.taskForm.patchValue({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate || ''
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      if (this.isEditMode) {
        this.updateTask();
      } else {
        this.createTask();
      }
    } else {
      // Mark all fields as touched to show validation errors
      this.taskForm.markAllAsTouched();
    }
  }

  private createTask(): void {
    const formValue = this.taskForm.value;
    
    const createRequest: CreateTaskRequest = {
      title: formValue.title.trim(),
      description: formValue.description?.trim() || undefined,
      priority: formValue.priority as Priority,
      status: formValue.status as Status,
      dueDate: formValue.dueDate || undefined
    };

    this.taskService.createTask(createRequest).subscribe({
      next: (task) => {
        this.isSubmitting = false;
        this.snackBar.open(this.labels.TASK_CREATED, 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/tasks', task.id]);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || this.labels.TASK_CREATE_ERROR;
        console.error('Create task error:', error);
      }
    });
  }

  private updateTask(): void {
    if (!this.taskId) return;

    const formValue = this.taskForm.value;
    
    const updateRequest: UpdateTaskRequest = {
      id: this.taskId,
      title: formValue.title.trim(),
      description: formValue.description?.trim() || undefined,
      priority: formValue.priority as Priority,
      status: formValue.status as Status,
      dueDate: formValue.dueDate || undefined
    };

    this.taskService.updateTask(updateRequest).subscribe({
      next: (task) => {
        this.isSubmitting = false;
        this.snackBar.open(this.labels.TASK_UPDATED, 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/tasks', task.id]);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || this.labels.TASK_UPDATE_ERROR;
        console.error('Update task error:', error);
      }
    });
  }

  goBack(): void {
    if (this.taskForm.dirty) {
      if (confirm('¿Estás seguro de que deseas salir? Se perderán los cambios no guardados.')) {
        this.navigateBack();
      }
    } else {
      this.navigateBack();
    }
  }

  private navigateBack(): void {
    if (this.isEditMode && this.taskId) {
      this.router.navigate(['/tasks', this.taskId]);
    } else {
      this.router.navigate(['/tasks']);
    }
  }
}