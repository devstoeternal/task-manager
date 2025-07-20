import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { TaskService } from '../../../core/services/task.service';
import { UI_LABELS } from '../../../shared/constants/ui-labels.constants';
import { User } from '../../../shared/models/user.interface';
import { TaskStats } from '../../../shared/models/task.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatDividerModule
  ],
  template: `
    <div class="container-responsive py-6">
      
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{labels.PROFILE}}</h1>
        <p class="text-gray-600">Gestiona tu información personal y configuración de cuenta</p>
      </div>

      <!-- Profile Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Profile Summary Card -->
        <div class="lg:col-span-1">
          <mat-card class="p-6 text-center shadow-lg">
            <div class="mb-6">
              <!-- Avatar -->
              <div class="inline-flex items-center justify-center w-24 h-24 bg-primary-500 rounded-full mb-4">
                <span class="text-white text-2xl font-bold" *ngIf="currentUser">
                  {{currentUser.firstName.charAt(0)}}{{currentUser.lastName.charAt(0)}}
                </span>
              </div>
              
              <!-- User Info -->
              <h2 class="text-xl font-semibold text-gray-900 mb-1" *ngIf="currentUser">
                {{currentUser.firstName}} {{currentUser.lastName}}
              </h2>
              <p class="text-gray-600 mb-4" *ngIf="currentUser">{{currentUser.email}}</p>
              
              <!-- Member Since -->
              <div class="text-sm text-gray-500" *ngIf="currentUser">
                <mat-icon class="text-base mr-1">event</mat-icon>
                Miembro desde {{formatDate(currentUser.createdAt)}}
              </div>
            </div>

            <!-- Quick Stats -->
            <mat-divider class="mb-4"></mat-divider>
            <div class="grid grid-cols-2 gap-4 text-center" *ngIf="userStats">
              <div>
                <div class="text-2xl font-bold text-primary-600">{{userStats.totalTasks}}</div>
                <div class="text-sm text-gray-600">Total Tareas</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-green-600">{{userStats.completedTasks}}</div>
                <div class="text-sm text-gray-600">Completadas</div>
              </div>
            </div>
          </mat-card>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-2">
          <mat-card class="shadow-lg">
            
            <!-- Tabs -->
            <mat-tab-group class="profile-tabs">
              
              <!-- Personal Information Tab -->
              <mat-tab label="Información Personal">
                <div class="p-6">
                  <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="space-y-6">
                    
                    <!-- Error Message -->
                    <div *ngIf="profileErrorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div class="flex items-start">
                        <mat-icon class="text-red-500 mt-0.5 mr-2">error_outline</mat-icon>
                        <div>
                          <h3 class="text-red-800 font-medium">Error al actualizar</h3>
                          <p class="text-red-700 text-sm mt-1">{{profileErrorMessage}}</p>
                        </div>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      <!-- First Name -->
                      <mat-form-field appearance="outline" class="w-full">
                        <mat-label>{{labels.FIRST_NAME}}</mat-label>
                        <input 
                          matInput 
                          formControlName="firstName"
                          placeholder="Tu nombre">
                        <mat-icon matSuffix>person</mat-icon>
                        <mat-error *ngIf="profileForm.get('firstName')?.hasError('required')">
                          {{labels.REQUIRED_FIELD}}
                        </mat-error>
                        <mat-error *ngIf="profileForm.get('firstName')?.hasError('minlength')">
                          Mínimo 2 caracteres
                        </mat-error>
                      </mat-form-field>

                      <!-- Last Name -->
                      <mat-form-field appearance="outline" class="w-full">
                        <mat-label>{{labels.LAST_NAME}}</mat-label>
                        <input 
                          matInput 
                          formControlName="lastName"
                          placeholder="Tu apellido">
                        <mat-icon matSuffix>person</mat-icon>
                        <mat-error *ngIf="profileForm.get('lastName')?.hasError('required')">
                          {{labels.REQUIRED_FIELD}}
                        </mat-error>
                        <mat-error *ngIf="profileForm.get('lastName')?.hasError('minlength')">
                          Mínimo 2 caracteres
                        </mat-error>
                      </mat-form-field>

                      <!-- Email -->
                      <mat-form-field appearance="outline" class="w-full md:col-span-2">
                        <mat-label>{{labels.EMAIL}}</mat-label>
                        <input 
                          matInput 
                          type="email"
                          formControlName="email"
                          placeholder="tu@email.com">
                        <mat-icon matSuffix>email</mat-icon>
                        <mat-error *ngIf="profileForm.get('email')?.hasError('required')">
                          {{labels.REQUIRED_FIELD}}
                        </mat-error>
                        <mat-error *ngIf="profileForm.get('email')?.hasError('email')">
                          {{labels.INVALID_EMAIL}}
                        </mat-error>
                      </mat-form-field>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end space-x-4 pt-4">
                      <button 
                        mat-stroked-button 
                        type="button"
                        (click)="resetProfileForm()">
                        {{labels.CANCEL}}
                      </button>
                      
                      <button 
                        mat-raised-button 
                        color="primary"
                        type="submit"
                        [disabled]="profileForm.invalid || isUpdatingProfile">
                        
                        <mat-spinner diameter="16" class="mr-2" *ngIf="isUpdatingProfile"></mat-spinner>
                        <mat-icon class="mr-2" *ngIf="!isUpdatingProfile">save</mat-icon>
                        {{isUpdatingProfile ? 'Guardando...' : labels.SAVE}}
                      </button>
                    </div>
                  </form>
                </div>
              </mat-tab>

              <!-- Change Password Tab -->
              <mat-tab label="Cambiar Contraseña">
                <div class="p-6">
                  <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="space-y-6">
                    
                    <!-- Error Message -->
                    <div *ngIf="passwordErrorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div class="flex items-start">
                        <mat-icon class="text-red-500 mt-0.5 mr-2">error_outline</mat-icon>
                        <div>
                          <h3 class="text-red-800 font-medium">Error al cambiar contraseña</h3>
                          <p class="text-red-700 text-sm mt-1">{{passwordErrorMessage}}</p>
                        </div>
                      </div>
                    </div>

                    <div class="space-y-6 max-w-md">
                      
                      <!-- Current Password -->
                      <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Contraseña Actual</mat-label>
                        <input 
                          matInput 
                          [type]="hideCurrentPassword ? 'password' : 'text'"
                          formControlName="currentPassword"
                          placeholder="Tu contraseña actual">
                        <button 
                          mat-icon-button 
                          matSuffix 
                          type="button"
                          (click)="hideCurrentPassword = !hideCurrentPassword">
                          <mat-icon>{{hideCurrentPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                        </button>
                        <mat-error *ngIf="passwordForm.get('currentPassword')?.hasError('required')">
                          {{labels.REQUIRED_FIELD}}
                        </mat-error>
                      </mat-form-field>

                      <!-- New Password -->
                      <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Nueva Contraseña</mat-label>
                        <input 
                          matInput 
                          [type]="hideNewPassword ? 'password' : 'text'"
                          formControlName="newPassword"
                          placeholder="Tu nueva contraseña">
                        <button 
                          mat-icon-button 
                          matSuffix 
                          type="button"
                          (click)="hideNewPassword = !hideNewPassword">
                          <mat-icon>{{hideNewPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                        </button>
                        <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('required')">
                          {{labels.REQUIRED_FIELD}}
                        </mat-error>
                        <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('minlength')">
                          Mínimo 6 caracteres
                        </mat-error>
                        <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('pattern')">
                          Debe contener al menos: 1 mayúscula, 1 minúscula y 1 número
                        </mat-error>
                      </mat-form-field>

                      <!-- Confirm New Password -->
                      <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Confirmar Nueva Contraseña</mat-label>
                        <input 
                          matInput 
                          [type]="hideConfirmPassword ? 'password' : 'text'"
                          formControlName="confirmNewPassword"
                          placeholder="Confirma tu nueva contraseña">
                        <button 
                          mat-icon-button 
                          matSuffix 
                          type="button"
                          (click)="hideConfirmPassword = !hideConfirmPassword">
                          <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                        </button>
                        <mat-error *ngIf="passwordForm.get('confirmNewPassword')?.hasError('required')">
                          {{labels.REQUIRED_FIELD}}
                        </mat-error>
                        <mat-error *ngIf="passwordForm.get('confirmNewPassword')?.hasError('passwordMismatch')">
                          {{labels.PASSWORDS_MUST_MATCH}}
                        </mat-error>
                      </mat-form-field>
                    </div>

                    <!-- Password Requirements -->
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 class="text-blue-800 font-medium mb-2">Requisitos de la contraseña:</h4>
                      <ul class="text-blue-700 text-sm space-y-1">
                        <li>• Mínimo 6 caracteres</li>
                        <li>• Al menos una letra mayúscula</li>
                        <li>• Al menos una letra minúscula</li>
                        <li>• Al menos un número</li>
                      </ul>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end space-x-4 pt-4">
                      <button 
                        mat-stroked-button 
                        type="button"
                        (click)="resetPasswordForm()">
                        {{labels.CANCEL}}
                      </button>
                      
                      <button 
                        mat-raised-button 
                        color="primary"
                        type="submit"
                        [disabled]="passwordForm.invalid || isChangingPassword">
                        
                        <mat-spinner diameter="16" class="mr-2" *ngIf="isChangingPassword"></mat-spinner>
                        <mat-icon class="mr-2" *ngIf="!isChangingPassword">lock</mat-icon>
                        {{isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}}
                      </button>
                    </div>
                  </form>
                </div>
              </mat-tab>

              <!-- Account Statistics Tab -->
              <mat-tab label="Estadísticas">
                <div class="p-6" *ngIf="userStats">
                  
                  <!-- Stats Overview -->
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div class="text-center p-4 bg-blue-50 rounded-lg">
                      <div class="text-2xl font-bold text-blue-600">{{userStats.totalTasks}}</div>
                      <div class="text-sm text-blue-700">Total Tareas</div>
                    </div>
                    <div class="text-center p-4 bg-green-50 rounded-lg">
                      <div class="text-2xl font-bold text-green-600">{{userStats.completedTasks}}</div>
                      <div class="text-sm text-green-700">Completadas</div>
                    </div>
                    <div class="text-center p-4 bg-orange-50 rounded-lg">
                      <div class="text-2xl font-bold text-orange-600">{{userStats.pendingTasks}}</div>
                      <div class="text-sm text-orange-700">Pendientes</div>
                    </div>
                    <div class="text-center p-4 bg-purple-50 rounded-lg">
                      <div class="text-2xl font-bold text-purple-600">{{userStats.inProgressTasks}}</div>
                      <div class="text-sm text-purple-700">En Progreso</div>
                    </div>
                  </div>

                  <!-- Detailed Stats -->
                  <div class="space-y-6">
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 mb-4">Estadísticas Detalladas</h3>
                      
                      <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div class="flex justify-between items-center">
                          <span class="text-gray-600">Tareas de alta prioridad:</span>
                          <span class="font-semibold text-red-600">{{userStats.highPriorityTasks}}</span>
                        </div>
                        <div class="flex justify-between items-center">
                          <span class="text-gray-600">Tareas vencidas:</span>
                          <span class="font-semibold text-red-600">{{userStats.overdueTasks}}</span>
                        </div>
                        <div class="flex justify-between items-center">
                          <span class="text-gray-600">Completadas esta semana:</span>
                          <span class="font-semibold text-green-600">{{userStats.tasksCompletedThisWeek}}</span>
                        </div>
                        <div class="flex justify-between items-center">
                          <span class="text-gray-600">Completadas este mes:</span>
                          <span class="font-semibold text-green-600">{{userStats.tasksCompletedThisMonth}}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Completion Rate -->
                    <div>
                      <h4 class="text-md font-semibold text-gray-900 mb-2">Tasa de Finalización</h4>
                      <div class="bg-gray-200 rounded-full h-3 mb-2">
                        <div 
                          class="bg-green-500 h-3 rounded-full transition-all duration-300"
                          [style.width.%]="getCompletionRate()">
                        </div>
                      </div>
                      <div class="text-sm text-gray-600">
                        {{getCompletionRate()}}% de tareas completadas
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Loading State -->
                <div *ngIf="!userStats" class="flex justify-center items-center py-12">
                  <mat-spinner diameter="32"></mat-spinner>
                  <span class="ml-4 text-gray-600">Cargando estadísticas...</span>
                </div>
              </mat-tab>
            </mat-tab-group>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container-responsive {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .mat-mdc-card {
      border-radius: 12px;
    }

    .profile-tabs {
      .mat-mdc-tab-body-wrapper {
        padding: 0;
      }
    }

    .bg-primary-500 {
      background-color: #2196F3;
    }

    .text-primary-600 {
      color: #1976D2;
    }

    @media (max-width: 640px) {
      .container-responsive {
        padding: 0 0.75rem;
      }
    }
  `]
})
export class ProfileComponent implements OnInit, OnDestroy {
  labels = UI_LABELS;
  
  currentUser?: User;
  userStats?: TaskStats;
  
  profileForm: FormGroup;
  passwordForm: FormGroup;
  
  isUpdatingProfile = false;
  isChangingPassword = false;
  
  profileErrorMessage = '';
  passwordErrorMessage = '';
  
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.createProfileForm();
    this.passwordForm = this.createPasswordForm();
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadUserStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createProfileForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  private createPasswordForm(): FormGroup {
    return this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      ]],
      confirmNewPassword: ['', [Validators.required]]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  private passwordMatchValidator(control: any): {[key: string]: any} | null {
    const newPassword = control.get('newPassword');
    const confirmNewPassword = control.get('confirmNewPassword');

    if (newPassword && confirmNewPassword && newPassword.value !== confirmNewPassword.value) {
      confirmNewPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmNewPassword?.hasError('passwordMismatch')) {
      const errors = { ...confirmNewPassword.errors };
      delete errors['passwordMismatch'];
      const hasErrors = Object.keys(errors).length > 0;
      confirmNewPassword.setErrors(hasErrors ? errors : null);
    }

    return null;
  }

  private loadUserData(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.currentUser = user;
          this.profileForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          });
        }
      });
  }

  private loadUserStats(): void {
    this.taskService.getTaskStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.userStats = stats;
        },
        error: (error) => {
          console.error('Load stats error:', error);
        }
      });
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      this.isUpdatingProfile = true;
      this.profileErrorMessage = '';

      const userData = this.profileForm.value;
      
      this.authService.updateProfile(userData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedUser) => {
            this.isUpdatingProfile = false;
            this.currentUser = updatedUser;
            this.snackBar.open('Perfil actualizado exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            this.isUpdatingProfile = false;
            this.profileErrorMessage = error.message || 'Error al actualizar el perfil';
            console.error('Update profile error:', error);
          }
        });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.isChangingPassword = true;
      this.passwordErrorMessage = '';

      const { currentPassword, newPassword } = this.passwordForm.value;
      
      this.authService.changePassword(currentPassword, newPassword)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.isChangingPassword = false;
            this.resetPasswordForm();
            this.snackBar.open('Contraseña cambiada exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            this.isChangingPassword = false;
            this.passwordErrorMessage = error.message || 'Error al cambiar la contraseña';
            console.error('Change password error:', error);
          }
        });
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }

  resetProfileForm(): void {
    if (this.currentUser) {
      this.profileForm.patchValue({
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email
      });
    }
    this.profileErrorMessage = '';
  }

  resetPasswordForm(): void {
    this.passwordForm.reset();
    this.passwordErrorMessage = '';
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }

  getCompletionRate(): number {
    if (!this.userStats || this.userStats.totalTasks === 0) return 0;
    return Math.round((this.userStats.completedTasks / this.userStats.totalTasks) * 100);
  }
}