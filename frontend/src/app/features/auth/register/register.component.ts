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
import { RegisterRequest } from '../../../core/models/auth.interface';


@Component({
  selector: 'app-register',
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
            <p class="auth-subtitle">Crea tu cuenta</p>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              <div class="form-fields">
                <div class="name-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Nombre</mat-label>
                    <input 
                      matInput 
                      formControlName="firstName" 
                      placeholder="Tu nombre"
                      autocomplete="given-name">
                    <mat-error *ngIf="registerForm.get('firstName')?.hasError('required')">
                      El nombre es requerido
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Apellido</mat-label>
                    <input 
                      matInput 
                      formControlName="lastName" 
                      placeholder="Tu apellido"
                      autocomplete="family-name">
                    <mat-error *ngIf="registerForm.get('lastName')?.hasError('required')">
                      El apellido es requerido
                    </mat-error>
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Usuario</mat-label>
                  <input 
                    matInput 
                    formControlName="username" 
                    placeholder="Elige un nombre de usuario"
                    autocomplete="username">
                  <mat-icon matSuffix>person</mat-icon>
                  <mat-error *ngIf="registerForm.get('username')?.hasError('required')">
                    El usuario es requerido
                  </mat-error>
                  <mat-error *ngIf="registerForm.get('username')?.hasError('minlength')">
                    Mínimo 3 caracteres
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email</mat-label>
                  <input 
                    matInput 
                    formControlName="email" 
                    placeholder="tu@email.com"
                    autocomplete="email">
                  <mat-icon matSuffix>email</mat-icon>
                  <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                    El email es requerido
                  </mat-error>
                  <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                    Email inválido
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Contraseña</mat-label>
                  <input 
                    matInput 
                    [type]="hidePassword ? 'password' : 'text'"
                    formControlName="password" 
                    placeholder="Crea una contraseña"
                    autocomplete="new-password">
                  <button 
                    mat-icon-button 
                    matSuffix 
                    type="button"
                    (click)="hidePassword = !hidePassword">
                    <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                  </button>
                  <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                    La contraseña es requerida
                  </mat-error>
                  <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                    Mínimo 6 caracteres
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Confirmar Contraseña</mat-label>
                  <input 
                    matInput 
                    [type]="hideConfirmPassword ? 'password' : 'text'"
                    formControlName="confirmPassword" 
                    placeholder="Confirma tu contraseña"
                    autocomplete="new-password">
                  <button 
                    mat-icon-button 
                    matSuffix 
                    type="button"
                    (click)="hideConfirmPassword = !hideConfirmPassword">
                    <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                  </button>
                  <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
                    Confirma tu contraseña
                  </mat-error>
                  <mat-error *ngIf="registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched">
                    Las contraseñas no coinciden
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-actions">
                <button 
                  mat-raised-button 
                  color="primary" 
                  type="submit"
                  class="register-button"
                  [disabled]="registerForm.invalid || loading">
                  <span *ngIf="!loading">Crear Cuenta</span>
                  <span *ngIf="loading">Creando cuenta...</span>
                </button>
              </div>
            </form>

            <mat-progress-bar *ngIf="loading" mode="indeterminate" class="progress-bar"></mat-progress-bar>
          </mat-card-content>

          <mat-card-actions class="auth-actions">
            <p class="login-link">
              ¿Ya tienes cuenta? 
              <a routerLink="/auth/login" class="link-button">Inicia sesión</a>
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
      max-width: 500px;
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

    .name-row {
      display: flex;
      gap: 12px;
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      flex: 1;
    }

    .form-actions {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .register-button {
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

    .login-link {
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

    @media (max-width: 580px) {
      .auth-container {
        padding: 16px;
      }

      .auth-card-container {
        max-width: 100%;
      }

      .name-row {
        flex-direction: column;
        gap: 16px;
      }

      .auth-header {
        padding: 24px 16px 16px;
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Redireccionar si ya está autenticado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      
      const registerData: RegisterRequest = {
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      this.authService.register(registerData).subscribe({
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