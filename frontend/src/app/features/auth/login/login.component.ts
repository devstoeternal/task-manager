import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.interface';
import { UI_LABELS } from '../../../shared/constants/ui-labels.constants';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <mat-card-header class="login-header">
        <mat-card-title>{{ labels.LOGIN }}</mat-card-title>
        <mat-card-subtitle>Ingresa tus credenciales para continuar</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content class="login-content">
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ labels.EMAIL_OR_USERNAME }}</mat-label>
            <input 
              matInput 
              formControlName="emailOrUsername"
              placeholder="correo@ejemplo.com o usuario"
              autocomplete="username">
            <mat-icon matSuffix>person</mat-icon>
            <mat-error *ngIf="loginForm.get('emailOrUsername')?.hasError('required')">
              {{ labels.REQUIRED_FIELD }}
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ labels.PASSWORD }}</mat-label>
            <input 
              matInput 
              [type]="hidePassword ? 'password' : 'text'"
              formControlName="password"
              placeholder="Tu contraseña"
              autocomplete="current-password">
            <mat-icon 
              matSuffix 
              (click)="hidePassword = !hidePassword"
              class="password-toggle">
              {{ hidePassword ? 'visibility' : 'visibility_off' }}
            </mat-icon>
            <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
              {{ labels.REQUIRED_FIELD }}
            </mat-error>
            <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
              {{ labels.PASSWORD_TOO_SHORT }}
            </mat-error>
          </mat-form-field>

          <button 
            mat-raised-button 
            color="primary" 
            type="submit"
            class="login-button full-width"
            [disabled]="loginForm.invalid || isLoading">
            <span *ngIf="!isLoading">{{ labels.LOGIN }}</span>
            <span *ngIf="isLoading">{{ labels.LOADING }}</span>
          </button>
        </form>
      </mat-card-content>

      <mat-card-actions class="login-actions">
        <p class="register-link">
          ¿No tienes cuenta? 
          <a routerLink="/auth/register" class="link">{{ labels.REGISTER }}</a>
        </p>
      </mat-card-actions>
    </div>
  `,
  styles: [`
    .login-container {
      width: 100%;
    }

    .login-header {
      text-align: center;
      padding: 32px 32px 0;
    }

    .login-content {
      padding: 24px 32px;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .full-width {
      width: 100%;
    }

    .password-toggle {
      cursor: pointer;
      user-select: none;
    }

    .login-button {
      height: 48px;
      font-size: 1rem;
      font-weight: 600;
      margin-top: 8px;
    }

    .login-actions {
      text-align: center;
      padding: 0 32px 32px;
    }

    .register-link {
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
      .login-header,
      .login-content,
      .login-actions {
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
export class LoginComponent implements OnInit {
  labels = UI_LABELS;
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      emailOrUsername: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // If already authenticated, redirect to dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const credentials: LoginRequest = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open(this.labels.LOGIN_SUCCESS, this.labels.CLOSE, { 
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          
          // Redirect to intended page or dashboard
          const redirectUrl = sessionStorage.getItem('redirectUrl') || '/dashboard';
          sessionStorage.removeItem('redirectUrl');
          this.router.navigate([redirectUrl]);
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }
}