import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.interface';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  template: `
    <div class="auth-container">
      <div class="auth-card-container">
        <mat-card class="auth-card">
          <mat-card-header class="auth-header">
            <div class="logo-section">
              <mat-icon class="logo-icon">assignment</mat-icon>
              <h1>Task Manager TCC</h1>
            </div>
            <p class="auth-subtitle">Inicia sesión en tu cuenta</p>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <div class="form-fields">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Usuario</mat-label>
                  <input 
                    matInput 
                    formControlName="username" 
                    placeholder="Ingresa tu usuario"
                    autocomplete="username">
                  <mat-icon matSuffix>person</mat-icon>
                  <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
                    El usuario es requerido
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Contraseña</mat-label>
                  <input 
                    matInput 
                    [type]="hidePassword ? 'password' : 'text'"
                    formControlName="password" 
                    placeholder="Ingresa tu contraseña"
                    autocomplete="current-password">
                  <button 
                    mat-icon-button 
                    matSuffix 
                    type="button"
                    (click)="hidePassword = !hidePassword"
                    [attr.aria-label]="'Hide password'"
                    [attr.aria-pressed]="hidePassword">
                    <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                  </button>
                  <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                    La contraseña es requerida
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-actions">
                <button 
                  mat-raised-button 
                  color="primary" 
                  type="submit"
                  class="login-button"
                  [disabled]="loginForm.invalid || loading">
                  <span *ngIf="!loading">Iniciar Sesión</span>
                  <span *ngIf="loading">Iniciando sesión...</span>
                </button>
              </div>
            </form>

            <mat-progress-bar *ngIf="loading" mode="indeterminate" class="progress-bar"></mat-progress-bar>
          </mat-card-content>

          <mat-card-actions class="auth-actions">
            <p class="register-link">
              ¿No tienes cuenta? 
              <a routerLink="/auth/register" class="link-button">Regístrate aquí</a>
            </p>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .auth-card-container {
      width: 100%;
      max-width: 400px;
    }

    .auth-card {
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      border-radius: 16px;
      overflow: hidden;
    }

    .auth-header {
      text-align: center;
      padding: 32px 24px 24px;
      background: white;
    }

    .logo-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }

    .logo-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #1976d2;
    }

    .auth-header h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
      color: #333;
    }

    .auth-subtitle {
      margin: 0;
      color: rgba(0,0,0,0.6);
      font-size: 0.9rem;
    }

    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .login-button {
      height: 48px;
      font-size: 1rem;
      font-weight: 500;
    }

    .progress-bar {
      margin-top: 16px;
    }

    .auth-actions {
      text-align: center;
      padding: 16px 24px 24px;
      background: #fafafa;
    }

    .register-link {
      margin: 0;
      font-size: 0.9rem;
      color: rgba(0,0,0,0.6);
    }

    .link-button {
      color: #1976d2;
      text-decoration: none;
      font-weight: 500;
    }

    .link-button:hover {
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .auth-container {
        padding: 16px;
      }

      .auth-card-container {
        max-width: 100%;
      }

      .auth-header {
        padding: 24px 16px 16px;
      }

      .logo-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
      }

      .auth-header h1 {
        font-size: 1.3rem;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Redireccionar si ya está autenticado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      
      const loginData: LoginRequest = {
        emailOrUsername: this.loginForm.value.username,
        password: this.loginForm.value.password
      };

      this.authService.login(loginData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }
}