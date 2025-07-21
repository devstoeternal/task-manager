import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { TaskService } from '../../../core/services/task.service';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus, TaskPriority } from '../../../core/models/task.interface';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  template: `
    <div class="task-form-overlay" (click)="cancel()">
      <div class="task-form-container" (click)="$event.stopPropagation()">
        <div class="form-header">
          <h2>{{ isEditing ? 'Editar Tarea' : 'Nueva Tarea' }}</h2>
          <button mat-icon-button (click)="cancel()">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
          <div class="form-content">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Título</mat-label>
              <input matInput formControlName="title" placeholder="Ingresa el título de la tarea">
              <mat-error *ngIf="taskForm.get('title')?.hasError('required')">
                El título es requerido
              </mat-error>
              <mat-error *ngIf="taskForm.get('title')?.hasError('maxlength')">
                El título no puede exceder 100 caracteres
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descripción</mat-label>
              <textarea 
                matInput 
                formControlName="description" 
                rows="4"
                placeholder="Describe la tarea">
              </textarea>
              <mat-error *ngIf="taskForm.get('description')?.hasError('required')">
                La descripción es requerida
              </mat-error>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Prioridad</mat-label>
                <mat-select formControlName="priority">
                  <mat-option value="LOW">Baja</mat-option>
                  <mat-option value="MEDIUM">Media</mat-option>
                  <mat-option value="HIGH">Alta</mat-option>
                  <mat-option value="URGENT">Urgente</mat-option>
                </mat-select>
                <mat-error *ngIf="taskForm.get('priority')?.hasError('required')">
                  La prioridad es requerida
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" *ngIf="isEditing">
                <mat-label>Estado</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="TODO">Por Hacer</mat-option>
                  <mat-option value="IN_PROGRESS">En Progreso</mat-option>
                  <mat-option value="IN_REVIEW">En Revisión</mat-option>
                  <mat-option value="DONE">Completada</mat-option>
                  <mat-option value="CANCELLED">Cancelada</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Fecha de vencimiento</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="dueDate">
              <mat-hint>Opcional</mat-hint>
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>
          </div>

          <div class="form-actions">
            <button mat-button type="button" (click)="cancel()">
              Cancelar
            </button>
            <button 
              mat-raised-button 
              color="primary" 
              type="submit"
              [disabled]="taskForm.invalid || saving">
              <mat-icon *ngIf="saving">hourglass_empty</mat-icon>
              {{ saving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .task-form-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .task-form-container {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 11px 15px -7px rgba(0,0,0,.2), 
                  0 24px 38px 3px rgba(0,0,0,.14), 
                  0 9px 46px 8px rgba(0,0,0,.12);
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 0;
      border-bottom: 1px solid #e0e0e0;
      margin-bottom: 24px;
    }

    .form-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
    }

    .form-content {
      padding: 0 24px;
    }

    .full-width {
      width: 100%;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 24px;
      border-top: 1px solid #e0e0e0;
      margin-top: 24px;
    }

    @media (max-width: 768px) {
      .task-form-container {
        width: 95%;
        margin: 20px;
      }

      .form-row {
        flex-direction: column;
        gap: 0;
      }

      .form-header,
      .form-content,
      .form-actions {
        padding-left: 16px;
        padding-right: 16px;
      }
    }
  `]
})
export class TaskFormComponent implements OnInit {
  @Input() task: Task | null = null;
  @Output() taskSaved = new EventEmitter<Task>();
  @Output() cancelled = new EventEmitter<void>();

  taskForm!: FormGroup;
  saving = false;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.isEditing = !!this.task;
    if (this.task) {
      this.loadTaskData();
    }
  }

  private initForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.required],
      priority: ['MEDIUM', Validators.required],
      status: ['TODO'],
      dueDate: [null]
    });
  }

  private loadTaskData(): void {
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        priority: this.task.priority,
        status: this.task.status,
        dueDate: this.task.dueDate ? new Date(this.task.dueDate) : null
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.saving = true;

      const formValue = this.taskForm.value;
      const taskData = {
        title: formValue.title,
        description: formValue.description,
        priority: formValue.priority,
        dueDate: formValue.dueDate ? formValue.dueDate.toISOString() : null
      };

      if (this.isEditing && this.task) {
        const updateData: UpdateTaskRequest = {
          ...taskData,
          status: formValue.status
        };

        this.taskService.updateTask(this.task.id, updateData).subscribe({
          next: (updatedTask) => {
            this.saving = false;
            this.taskSaved.emit(updatedTask);
          },
          error: () => {
            this.saving = false;
          }
        });
      } else {
        const createData: CreateTaskRequest = taskData;

        this.taskService.createTask(createData).subscribe({
          next: (newTask) => {
            this.saving = false;
            this.taskSaved.emit(newTask);
          },
          error: () => {
            this.saving = false;
          }
        });
      }
    }
  }

  cancel(): void {
    this.cancelled.emit();
  }
}