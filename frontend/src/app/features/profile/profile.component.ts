import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '../../core/models/user.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="profile-container">
      <div class="page-header">
        <h1>Mi Perfil</h1>
        <p>Gestiona tu información personal y configuración de cuenta</p>
      </div>

      <div class="profile-content" *ngIf="userProfile">
        <!-- Profile Header -->
        <mat-card class="profile-header-card">
          <mat-card-content>
            <div class="profile-header">
              <div class="avatar-section">
                <div class="user-avatar">
                  {{ userProfile.initials }}
                </div>
              </div>
              <div class="user-info">
                <h2 class="user-name">{{ userProfile.fullName }}</h2>
                <p class="user-email">{{ userProfile.email }}</p>
                <p class="user-username">@{{ userProfile.username }}</p>
                <span class="user-role">{{ userProfile.role }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Profile Tabs -->
        <mat-card class="profile-tabs-card">
          <mat-tab-group>
            <!-- Información Personal -->
            <mat-tab label="Información Personal">
              <div class="tab-content">
                <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
                  <div class="form-row">
                    <mat-form-field appearance="outline" class="form-field">
                      <mat-label>Nombre</mat-label>
                      <input matInput formControlName="firstName" placeholder="Ingresa tu nombre">
                      <mat-error *ngIf="profileForm.get('firstName')?.hasError('required')">
                        El nombre es requerido
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="form-field">
                      <mat-label>Apellido</mat-label>
                      <input matInput formControlName="lastName" placeholder="Ingresa tu apellido">
                      <mat-error *ngIf="profileForm.get('lastName')?.hasError('required')">
                        El apellido es requerido
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="form-field">
                      <mat-label>Usuario</mat-label>
                      <input matInput formControlName="username" placeholder="Ingresa tu nombre de usuario">
                    </mat-form-field>


                    <mat-form-field appearance="outline" class="form-field">
                      <mat-label>Email</mat-label>
                      <input matInput formControlName="email" placeholder="Ingresa tu email">
                    </mat-form-field>
                  </div>

                  <div class="form-actions">
                    <button mat-raised-button color="primary" type="submit" 
                            [disabled]="profileForm.invalid || updatingProfile">
                      <mat-icon>save</mat-icon>
                      {{ updatingProfile ? 'Guardando...' : 'Guardar Cambios' }}
                    </button>
                  </div>
                </form>
              </div>
            </mat-tab>

            <!-- Cambiar Contraseña -->
            <mat-tab label="Seguridad">
              <div class="tab-content">
                <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
                  <mat-form-field appearance="outline" class="form-field-full">
                    <mat-label>Contraseña Actual</mat-label>
                    <input matInput type="password" formControlName="oldPassword" 
                           placeholder="Ingresa tu contraseña actual">
                    <mat-error *ngIf="passwordForm.get('oldPassword')?.hasError('required')">
                      La contraseña actual es requerida
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="form-field-full">
                    <mat-label>Nueva Contraseña</mat-label>
                    <input matInput type="password" formControlName="newPassword" 
                           placeholder="Ingresa tu nueva contraseña">
                    <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('required')">
                      La nueva contraseña es requerida
                    </mat-error>
                    <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('minlength')">
                      Mínimo 6 caracteres
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="form-field-full">
                    <mat-label>Confirmar Nueva Contraseña</mat-label>
                    <input matInput type="password" formControlName="confirmPassword" 
                           placeholder="Confirma tu nueva contraseña">
                    <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('required')">
                      Confirma tu nueva contraseña
                    </mat-error>
                    <mat-error *ngIf="passwordForm.hasError('passwordMismatch') && passwordForm.get('confirmPassword')?.touched">
                      Las contraseñas no coinciden
                    </mat-error>
                  </mat-form-field>

                  <div class="form-actions">
                    <button mat-raised-button color="primary" type="submit" 
                            [disabled]="passwordForm.invalid || changingPassword">
                      <mat-icon>security</mat-icon>
                      {{ changingPassword ? 'Cambiando...' : 'Cambiar Contraseña' }}
                    </button>
                  </div>
                </form>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card>
      </div>

      <!-- Loading state -->
      <div class="loading-state" *ngIf="loading">
        <mat-card>
          <mat-card-content>
            <p>Cargando perfil...</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 32px;
      text-align: center;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 500;
      margin: 0 0 8px 0;
      color: #333;
    }

    .page-header p {
      color: rgba(0,0,0,0.6);
      margin: 0;
    }

    .profile-header-card {
      margin-bottom: 24px;
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .avatar-section {
      display: flex;
      align-items: center;
    }

    .user-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 600;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .user-info {
      flex: 1;
    }

    .user-name {
      font-size: 1.5rem;
      font-weight: 500;
      margin: 0 0 8px 0;
      color: #333;
    }

    .user-email {
      color: rgba(0,0,0,0.7);
      margin: 0 0 4px 0;
      font-size: 1rem;
    }

    .user-username {
      color: rgba(0,0,0,0.6);
      margin: 0 0 8px 0;
      font-size: 0.9rem;
    }

    .user-role {
      padding: 4px 12px;
      background: #e3f2fd;
      color: #1976d2;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .profile-tabs-card {
      margin-bottom: 24px;
    }

    .tab-content {
      padding: 24px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-field {
      flex: 1;
    }

    .form-field-full {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 24px;
    }

    .form-actions button {
      min-width: 160px;
    }

    .loading-state {
      text-align: center;
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 16px;
      }

      .profile-header {
        flex-direction: column;
        text-align: center;
        gap: 16px;
      }

      .form-row {
        flex-direction: column;
        gap: 0;
      }

      .tab-content {
        padding: 16px;
      }

      .form-actions {
        justify-content: center;
      }

      .user-avatar {
        width: 60px;
        height: 60px;
        font-size: 1.5rem;
      }

      .user-name {
        font-size: 1.3rem;
      }
    }
  `]
})
export class ProfileComponent implements OnInit, OnDestroy {
  userProfile: UserProfile | null = null;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  loading = false;
  updatingProfile = false;
  changingPassword = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForms(): void {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }


  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  }

  private loadProfile(): void {
    this.loading = true;

    this.userService.getProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profile: UserProfile) => {
          this.userProfile = profile;
          this.profileForm.patchValue({
            firstName: profile.firstName,
            lastName: profile.lastName,
            username: profile.username,
            email: profile.email
          });

          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Error al cargar el perfil', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  updateProfile(): void {
  if (this.profileForm.valid) {
    this.updatingProfile = true;

    const updateData: UpdateProfileRequest = {
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName,
      username: this.profileForm.value.username,
      email: this.profileForm.value.email
    };

    this.userService.updateProfile(updateData)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.updatingProfile = false)
      )
      .subscribe({
        next: (response: { user: UserProfile; token: string }) => {
          const updatedProfile = response.user;
          const newToken = response.token;

          this.authService.setToken(newToken); 
          this.authService.updateCurrentUser(updatedProfile);

          this.snackBar.open('Perfil actualizado exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: () => {
          this.snackBar.open('Error al actualizar el perfil', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }
}

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.changingPassword = true;

      const passwordData: ChangePasswordRequest = {
        oldPassword: this.passwordForm.value.oldPassword,
        newPassword: this.passwordForm.value.newPassword
      };

      this.userService.changePassword(passwordData)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.changingPassword = false)
        )
        .subscribe({
          next: () => {
            this.passwordForm.reset();
            this.snackBar.open('Contraseña cambiada exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: () => {
            this.snackBar.open('Error al cambiar la contraseña', 'Cerrar', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
    }
  }
}