import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../core/services/auth.service';
import { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '../../core/models/user.interface';
import { UI_LABELS } from '../../shared/constants/ui-labels.constants';

@Component({
  selector: 'app-profile',
  template: `
    <div class="profile-container">
      <div class="page-header">
        <h1 class="page-title">{{ labels.PROFILE }}</h1>
        <p class="page-subtitle">Gestiona tu información personal y configuración de cuenta</p>
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
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Profile Tabs -->
        <mat-card class="profile-tabs-card">
          <mat-tab-group mat-stretch-tabs="false" class="profile-tabs">
            <!-- Personal Information Tab -->
            <mat-tab label="Información Personal">
              <div class="tab-content">
                <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="profile-form">
                  <div class="form-row">
                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>{{ labels.FIRST_NAME }}</mat-label>
                      <input matInput formControlName="firstName" placeholder="Nombre">
                      <mat-error *ngIf="profileForm.get('firstName')?.hasError('required')">
                        {{ labels.REQUIRED_FIELD }}
                      </mat-error>
                      <mat-error *ngIf="profileForm.get('firstName')?.hasError('minlength')">
                        Mínimo 2 caracteres
                      </mat-error>
                      <mat-error *ngIf="profileForm.get('firstName')?.hasError('pattern')">
                        Solo se permiten letras y espacios
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>{{ labels.LAST_NAME }}</mat-label>
                      <input matInput formControlName="lastName" placeholder="Apellido">
                      <mat-error *ngIf="profileForm.get('lastName')?.hasError('required')">
                        {{ labels.REQUIRED_FIELD }}
                      </mat-error>
                      <mat-error *ngIf="profileForm.get('lastName')?.hasError('minlength')">
                        Mínimo 2 caracteres
                      </mat-error>
                      <mat-error *ngIf="profileForm.get('lastName')?.hasError('pattern')">
                        Solo se permiten letras y espacios
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>{{ labels.EMAIL }}</mat-label>
                    <input matInput type="email" formControlName="email" readonly>
                    <mat-icon matSuffix>email</mat-icon>
                    <mat-hint>El email no se puede cambiar</mat-hint>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>{{ labels.USERNAME }}</mat-label>
                    <input matInput formControlName="username" readonly>
                    <mat-icon matSuffix>alternate_email</mat-icon>
                    <mat-hint>El nombre de usuario no se puede cambiar</mat-hint>
                  </mat-form-field>

                  <div class="form-actions">
                    <button 
                      mat-raised-button 
                      color="primary" 
                      type="submit"
                      [disabled]="profileForm.invalid || isUpdatingProfile">
                      <span *ngIf="!isUpdatingProfile">{{ labels.SAVE }}</span>
                      <span *ngIf="isUpdatingProfile">{{ labels.SAVING }}</span>
                    </button>
                  </div>
                </form>
              </div>
            </mat-tab>

            <!-- Change Password Tab -->
            <mat-tab label="Cambiar Contraseña">
              <div class="tab-content">
                <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="password-form">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Contraseña Actual</mat-label>
                    <input 
                      matInput 
                      [type]="hideCurrentPassword ? 'password' : 'text'"
                      formControlName="currentPassword"
                      placeholder="Tu contraseña actual">
                    <mat-icon 
                      matSuffix 
                      (click)="hideCurrentPassword = !hideCurrentPassword"
                      class="password-toggle">
                      {{ hideCurrentPassword ? 'visibility' : 'visibility_off' }}
                    </mat-icon>
                    <mat-error *ngIf="passwordForm.get('currentPassword')?.hasError('required')">
                      {{ labels.REQUIRED_FIELD }}
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Nueva Contraseña</mat-label>
                    <input 
                      matInput 
                      [type]="hideNewPassword ? 'password' : 'text'"
                      formControlName="newPassword"
                      placeholder="Nueva contraseña segura">
                    <mat-icon 
                      matSuffix 
                      (click)="hideNewPassword = !hideNewPassword"
                      class="password-toggle">
                      {{ hideNewPassword ? 'visibility' : 'visibility_off' }}
                    </mat-icon>
                    <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('required')">
                      {{ labels.REQUIRED_FIELD }}
                    </mat-error>
                    <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('minlength')">
                      {{ labels.PASSWORD_TOO_SHORT }}
                    </mat-error>
                    <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('strongPassword')">
                      La contraseña debe contener al menos: una mayúscula, una minúscula, un número y un símbolo
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Confirmar Nueva Contraseña</mat-label>
                    <input 
                      matInput 
                      [type]="hideConfirmPassword ? 'password' : 'text'"
                      formControlName="confirmPassword"
                      placeholder="Confirma la nueva contraseña">
                    <mat-icon 
                      matSuffix 
                      (click)="hideConfirmPassword = !hideConfirmPassword"
                      class="password-toggle">
                      {{ hideConfirmPassword ? 'visibility' : 'visibility_off' }}
                    </mat-icon>
                    <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('required')">
                      {{ labels.REQUIRED_FIELD }}
                    </mat-error>
                    <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('mismatch')">
                      {{ labels.PASSWORDS_NOT_MATCH }}
                    </mat-error>
                  </mat-form-field>

                  <div class="password-requirements">
                    <h4>Requisitos de la contraseña:</h4>
                    <ul>
                      <li>Al menos 6 caracteres</li>
                      <li>Una letra mayúscula</li>
                      <li>Una letra minúscula</li>
                      <li>Un número</li>
                      <li>Un símbolo especial</li>
                    </ul>
                  </div>

                  <div class="form-actions">
                    <button 
                      mat-raised-button 
                      color="primary" 
                      type="submit"
                      [disabled]="passwordForm.invalid || isChangingPassword">
                      <span *ngIf="!isChangingPassword">Cambiar Contraseña</span>
                      <span *ngIf="isChangingPassword">Cambiando...</span>
                    </button>
                  </div>
                </form>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 8px;
      color: var(--mdc-theme-on-surface);
    }

    .page-subtitle {
      color: var(--mdc-theme-on-surface-variant);
      margin: 0;
      font-size: 1.125rem;
    }

    .profile-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .profile-header-card {
      border-radius: 12px;
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .avatar-section {
      flex-shrink: 0;
    }

    .user-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--mdc-theme-primary);
      color: var(--mdc-theme-on-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 600;
    }

    .user-info {
      flex: 1;
    }

    .user-name {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: var(--mdc-theme-on-surface);
    }

    .user-email {
      color: var(--mdc-theme-on-surface-variant);
      margin: 0 0 4px 0;
      font-size: 1rem;
    }

    .user-username {
      color: var(--mdc-theme-primary);
      margin: 0;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .profile-tabs-card {
      border-radius: 12px;
    }

    .profile-tabs {
      margin: -24px;
    }

    .tab-content {
      padding: 32px 24px;
    }

    .profile-form,
    .password-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      flex: 1;
    }

    .password-toggle {
      cursor: pointer;
      user-select: none;
    }

    .password-requirements {
      background: var(--mdc-theme-surface-variant);
      padding: 16px;
      border-radius: 8px;
      margin-top: 8px;
    }

    .password-requirements h4 {
      margin: 0 0 8px 0;
      font-size: 0.875rem;
      color: var(--mdc-theme-on-surface);
    }

    .password-requirements ul {
      margin: 0;
      padding-left: 20px;
      font-size: 0.875rem;
      color: var(--mdc-theme-on-surface-variant);
    }

    .password-requirements li {
      margin-bottom: 4px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }

    .form-actions button {
      min-width: 120px;
    }

    @media (max-width: 768px) {
      .profile-header {
        flex-direction: column;
        text-align: center;
      }

      .form-row {
        flex-direction: column;
      }

      .tab-content {
        padding: 24px 16px;
      }
    }
  `],
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
  ]
})
export class ProfileComponent implements OnInit {
  labels = UI_LABELS;
  userProfile: UserProfile | null = null;
  
  profileForm: FormGroup;
  passwordForm: FormGroup;
  
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  
  isUpdatingProfile = false;
  isChangingPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      lastName: ['', [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      email: [{ value: '', disabled: true }],
      username: [{ value: '', disabled: true }]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6), this.strongPasswordValidator]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.userProfile = this.authService.getUserProfile();
    
    if (this.userProfile) {
      this.profileForm.patchValue({
        firstName: this.userProfile.firstName,
        lastName: this.userProfile.lastName,
        email: this.userProfile.email,
        username: this.userProfile.username
      });
    }
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      this.isUpdatingProfile = true;
      
      const updateData: UpdateProfileRequest = {
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName
      };

      // Simulate API call since endpoint doesn't exist yet
      setTimeout(() => {
        // Update the user in AuthService
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            firstName: updateData.firstName,
            lastName: updateData.lastName
          };
          
          this.authService.updateCurrentUser(updatedUser);
          this.userProfile = this.authService.getUserProfile();
        }

        this.isUpdatingProfile = false;
        this.snackBar.open(this.labels.PROFILE_UPDATED, this.labels.CLOSE, { 
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }, 1000);
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.isChangingPassword = true;
      
      const passwordData: ChangePasswordRequest = {
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword
      };

      // Simulate API call since endpoint doesn't exist yet
      setTimeout(() => {
        this.isChangingPassword = false;
        this.passwordForm.reset();
        this.snackBar.open(this.labels.PASSWORD_CHANGED, this.labels.CLOSE, { 
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }, 1000);
    }
  }

  private strongPasswordValidator(control: any) {
    const value = control.value;
    if (!value) return null;
    
    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    const valid = hasNumber && hasUpper && hasLower && hasSymbol;
    return !valid ? { strongPassword: true } : null;
  }

  private passwordMatchValidator(control: any) {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }

    if (confirmPassword?.hasError('mismatch')) {
      const errors = { ...confirmPassword.errors };
      delete errors['mismatch'];
      confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
    }

    return null;
  }
}