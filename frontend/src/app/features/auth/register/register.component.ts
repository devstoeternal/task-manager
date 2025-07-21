import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/auth.interface';
import { UI_LABELS } from '../../../shared/constants/ui-labels.constants';

@Component({
  selector: 'app-register',
  template: `
    <div class="register-container">
      <mat-card-header class="register-header">
        <mat-card-title>{{ labels.REGISTER }}</mat-card-title>
        <mat-card-subtitle>Crea tu cuenta para comenzar</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content class="register-content">
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
          <div class="name-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>{{ labels.FIRST_NAME }}</mat-label>
              <input 
                matInput 
                formControlName="firstName"
                placeholder="Nombre"
                autocomplete="given-name">
              <mat-error *ngIf="registerForm.get('firstName')?.hasError('required')">
                {{ labels.REQUIRED_FIELD }}
              </mat-error>
              <mat-error *ngIf="registerForm.get('firstName')?.hasError('minlength')">
                Mínimo 2 caracteres
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>{{ labels.LAST_NAME }}</mat-label>
              <input 
                matInput 
                formControlName="lastName"
                placeholder="Apellido"
                autocomplete="family-name">
              <mat-error *ngIf="registerForm.get('lastName')?.hasError('required')">
                {{ labels.REQUIRED_FIELD }}
              </mat-error>
              <mat-error *ngIf="registerForm.get('lastName')?.hasError('minlength')">
                Mínimo 2 caracteres
              </mat-error>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ labels.USERNAME }}</mat-label>
            <input 
              matInput 
              formControlName="username"
              placeholder="usuario123"
              autocomplete="username">
            <mat-icon matSuffix>alternate_email</mat-icon>
            <mat-error *ngIf="registerForm.get('username')?.hasError('required')">
              {{ labels.REQUIRED_FIELD }}
            </mat-error>
            <mat-error *ngIf="registerForm.get('username')?.hasError('minlength')">
              {{ labels.USERNAME_TOO_SHORT }}
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ labels.EMAIL }}</mat-label>
            <input 
              matInput 
              type="email"
              formControlName="email"
              placeholder="correo@ejemplo.com"
              autocomplete="email">
            <mat-icon matSuffix>email</mat-icon>
            <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
              {{ labels.REQUIRED_FIELD }}
            </mat-error>
            <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
              {{ labels.INVALID_EMAIL }}
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ labels.PASSWORD }}</mat-label>
            <input 
              matInput 
              [type]="hidePassword ? 'password' : 'text'"
              formControlName="password"
              placeholder="Contraseña segura"
              autocomplete="new-password">
            <mat-icon 
              matSuffix 
              (click)="hidePassword = !hidePassword"
              class="password-toggle">
              {{ hidePassword ? 'visibility' : 'visibility_off' }}
            </mat-icon>
            <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
              {{ labels.REQUIRED_FIELD }}
            </mat-error>
            <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
              {{ labels.PASSWORD_TOO_SHORT }}
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ labels.CONFIRM_PASSWORD }}</mat-label>
            <input 
              matInput 
              [type]="hideConfirmPassword ? 'password' : 'text'"
              formControlName="confirmPassword"
              placeholder="Confirma tu contraseña"
              autocomplete="new-password">
            <mat-icon 
              matSuffix 
              (click)="hideConfirmPassword = !hideConfirmPassword"
              class="password-toggle">
              {{ hideConfirmPassword ? 'visibility' : 'visibility_off' }}
            </mat-icon>
            <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
              {{ labels.REQUIRED_FIELD }}
            </mat-error>
            <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('mismatch')">
              {{ labels.PASSWORDS_NOT_MATCH }}
            </mat-error>
          </mat-form-field>

          <button 
            mat-raised-button 
            color="primary" 
            type="submit"
            class="register-button full-width"
            [disabled]="registerForm.invalid || isLoading">
            <span *ngIf="!isLoading">{{ labels.REGISTER }}</span>
            <span *ngIf="isLoading">{{ labels.LOADING }}</span>
          </button>
        </form>
      </mat-card-content>

      <mat-card-actions class="register-actions">
        <p class="login-link">
          ¿Ya tienes cuenta? 
          <a routerLink="/auth/login" class="link">{{ labels.LOGIN }}</a>
        </p>
      </mat-card-actions>
    </div>
  `,
  styles: [`
    .register-container {
      width: 100%;
    }

    .register-header {
      text-align: center;
      padding: 32px 32px 0;
    }

    .register-content {
      padding: 24px 32px;
    }

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .name-row {
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

    .register-button {
      height: 48px;
      font-size: 1rem;
      font-weight: 600;
      margin-top: 8px;
    }

    .register-actions {
      text-align: center;
      padding: 0 32px 32px;
    }

    .login-link {
      margin: 0;
      color: var(--mdc-theme-on-surface-variant);
    }

    .link {
      color: var(--mdc-theme-primary);
      text-decoration: none;
      font-weight: 600;
    }

    .link:hover {
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .name-row {
        flex-direction: column;
        gap: 16px;
      }

      .register-header,
      .register-content,
      .register-actions {
        padding-left: 24px;
        padding-right: 24px;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class RegisterComponent {
  labels = UI_LABELS;
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const userData: RegisterRequest = {
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      this.authService.register(userData).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open(this.labels.REGISTER_SUCCESS, this.labels.CLOSE, { 
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/auth/login']);
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
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