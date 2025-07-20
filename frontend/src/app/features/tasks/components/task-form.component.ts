import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
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
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatToolbarModule
  ],
  template: `
    <div class="container-responsive py-6">
      
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-4">
          <button 
            mat-icon-button 
            (click)="goBack()"
            class="text-gray-600 hover:text-gray-800">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ isEditMode ? labels.EDIT_TASK : labels.NEW_TASK }}
            </h1>
            <p class="text-gray-600 mt-1">
              {{ isEditMode ? 'Modifica los datos de tu tarea' : 'Crea una nueva tarea para gestionar' }}
            </p>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <mat-icon class="text-primary-500">
            {{ isEditMode ? 'edit' : 'add_task' }}
          </mat-icon>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading && isEditMode" class="flex justify-center items-center py-12">
        <mat-spinner diameter="40"></mat-spinner>
        <span class="ml-4 text-gray-600">Cargando tarea...</span>
      </div>

      <!-- Task Form -->
      <div *ngIf="!isLoading || !isEditMode">
        <mat-card class="p-6 shadow-lg">
          <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <!-- Error Message -->
            <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex items-start">
                <mat-icon class="text-red-500 mt-0.5 mr-2">error_outline</mat-icon>
                <div>
                  <h3 class="text-red-800 font-medium">Error al guardar</h3>
                  <p class="text-red-700 text-sm mt-1">{{errorMessage}}</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <!-- Left Column -->
              <div class="space-y-6">
                
                <!-- Title -->
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>{{labels.TASK_TITLE}}</mat-label>
                  <input 
                    matInput 
                    formControlName="title"
                    placeholder="Ej: Completar reporte mensual"
                    maxlength="100">
                  <mat-icon matSuffix>title</mat-icon>
                  <mat-hint align="end">{{taskForm.get('title')?.value?.length || 0}}/100</mat-hint>
                  <mat-error *ngIf="taskForm.get('title')?.hasError('required')">
                    {{labels.REQUIRED_FIELD}}
                  </mat-error>
                  <mat-error *ngIf="taskForm.get('title')?.hasError('minlength')">
                    Mínimo 3 caracteres
                  </mat-error>
                  <mat-error *ngIf="taskForm.get('title')?.hasError('maxlength')">
                    Máximo 100 caracteres
                  </mat-error>
                </mat-form-field>

                <!-- Description -->
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>{{labels.TASK_DESCRIPTION}}</mat-label>
                  <textarea 
                    matInput 
                    formControlName="description"
                    placeholder="Describe los detalles y objetivos de la tarea..."
                    rows="4"
                    maxlength="500"></textarea>
                  <mat-icon matSuffix>description</mat-icon>
                  <mat-hint align="end">{{taskForm.get('description')?.value?.length || 0}}/500</mat-hint>
                </mat-form-field>

              </div>

              <!-- Right Column -->
              <div class="space-y-6">
                
                <!-- Priority -->
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>{{labels.PRIORITY}}</mat-label>
                  <mat-select formControlName="priority">
                    <mat-option [value]="Priority.LOW">
                      <div class="flex items-center">
                        <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        {{labels.LOW}}
                      </div>
                    </mat-option>
                    <mat-option [value]="Priority.MEDIUM">
                      <div class="flex items-center">
                        <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        {{labels.MEDIUM}}
                      </div>
                    </mat-option>
                    <mat-option [value]="Priority.HIGH">
                      <div class="flex items-center">
                        <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        {{labels.HIGH}}
                      </div>
                    </mat-option>
                  </mat-select>
                  <mat-icon matSuffix>flag</mat-icon>
                  <mat-error *ngIf="taskForm.get('priority')?.hasError('required')">
                    {{labels.REQUIRED_FIELD}}
                  </mat-error>
                </mat-form-field>

                <!-- Status -->
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>{{labels.STATUS}}</mat-label>
                  <mat-select formControlName="status">
                    <mat-option [value]="Status.PENDING">
                      <div class="flex items-center">
                        <mat-icon class="text-orange-500 mr-2 text-lg">schedule</mat-icon>
                        {{labels.PENDING}}
                      </div>
                    </mat-option>
                    <mat-option [value]="Status.IN_PROGRESS">
                      <div class="flex items-center">
                        <mat-icon class="text-blue-500 mr-2 text-lg">play_circle</mat-icon>
                        {{labels.IN_PROGRESS}}
                      </div>
                    </mat-option>
                    <mat-option [value]="Status.COMPLETED">
                      <div class="flex items-center">
                        <mat-icon class="text-green-500 mr-2 text-lg">check_circle</mat-icon>
                        {{labels.COMPLETED}}
                      </div>
                    </mat-option>
                  </mat-select>
                  <mat-icon matSuffix>update</mat-icon>
                  <mat-error *ngIf="taskForm.get('status')?.hasError('required')">
                    {{labels.REQUIRED_FIELD}}
                  </mat-error>
                </mat-form-field>

                <!-- Due Date -->
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>{{labels.DUE_DATE}}</mat-label>
                  <input 
                    matInput 
                    [matDatepicker]="picker"
                    formControlName="dueDate"
                    placeholder="Selecciona fecha límite">
                  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                  <mat-hint>Opcional - Fecha límite para completar</mat-hint>
                  <mat-error *ngIf="taskForm.get('dueDate')?.hasError('matDatepickerParse')">
                    {{labels.INVALID_DATE}}
                  </mat-error>
                </mat-form-field>

              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
              
              <!-- Cancel Button -->
              <button 
                mat-stroked-button 
                type="button"
                (click)="goBack()"
                class="sm:w-auto w-full">
                <mat-icon class="mr-2">close</mat-icon>
                {{labels.CANCEL}}
              </button>

              <!-- Save Button -->
              <button 
                mat-raised-button 
                color="primary"
                type="submit"
                class="sm:w-auto w-full"
                [disabled]="taskForm.invalid || isSaving">
                
                <mat-spinner diameter="16" class="mr-2" *ngIf="isSaving"></mat-spinner>
                <mat-icon class="mr-2" *ngIf="!isSaving">{{isEditMode ? 'save' : 'add'}}</mat-icon>
                {{isSaving ? 'Guardando...' : (isEditMode ? labels.UPDATE : labels.CREATE)}}
              </button>
            </div>

          </form>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .container-responsive {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .mat-mdc-form-field {
      margin-bottom: 0;
    }

    .mat-mdc-card {
      border-radius: 12px;
    }

    .text-primary-500 {
      color: #2196F3;
    }

    @media (max-width: 640px) {
      .container-responsive {
        padding: 0 0.75rem;
      }
    }
  `]
})
export class TaskFormComponent implements OnInit, OnDestroy {
  labels = UI_LABELS;
  Priority = Priority;
  Status = Status;
  
  taskForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  taskId?: number;
  
  private destroy$ = new Subject<void>();

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
    // Check if we're in edit mode
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.taskId && !isNaN(this.taskId);

    if (this.isEditMode) {
      this.loadTask();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      priority: [Priority.MEDIUM, [Validators.required]],
      status: [Status.PENDING, [Validators.required]],
      dueDate: [null] // Optional
    });
  }

  private loadTask(): void {
    if (!this.taskId) return;

    this.isLoading = true;
    this.taskService.getTask(this.taskId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (task) => {
          this.isLoading = false;
          this.populateForm(task);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Error al cargar la tarea';
          console.error('Load task error:', error);
          
          this.snackBar.open('Error al cargar la tarea', 'Cerrar', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  private populateForm(task: Task): void {
    this.taskForm.patchValue({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate || null
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.isSaving = true;
      this.errorMessage = '';

      const formValue = this.taskForm.value;
      
      if (this.isEditMode && this.taskId) {
        // Update existing task
        const updateRequest: UpdateTaskRequest = {
          id: this.taskId,
          title: formValue.title,
          description: formValue.description || undefined,
          priority: formValue.priority,
          status: formValue.status,
          dueDate: formValue.dueDate || undefined
        };

        this.taskService.updateTask(updateRequest)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (task) => {
              this.isSaving = false;
              this.snackBar.open('Tarea actualizada exitosamente', 'Cerrar', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
              this.router.navigate(['/tasks', task.id]);
            },
            error: (error) => {
              this.isSaving = false;
              this.errorMessage = error.message || 'Error al actualizar la tarea';
              console.error('Update task error:', error);
            }
          });
      } else {
        // Create new task
        const createRequest: CreateTaskRequest = {
          title: formValue.title,
          description: formValue.description || undefined,
          priority: formValue.priority,
          status: formValue.status,
          dueDate: formValue.dueDate || undefined
        };

        this.taskService.createTask(createRequest)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (task) => {
              this.isSaving = false;
              this.snackBar.open('Tarea creada exitosamente', 'Cerrar', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
              this.router.navigate(['/tasks', task.id]);
            },
            error: (error) => {
              this.isSaving = false;
              this.errorMessage = error.message || 'Error al crear la tarea';
              console.error('Create task error:', error);
            }
          });
      }
    } else {
      // Mark all fields as touched to show validation errors
      this.taskForm.markAllAsTouched();
    }
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }
}