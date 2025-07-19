import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { UI_LABELS } from '../../../shared/constants/ui-labels.constants';
import { LoginRequest } from '../../../shared/models/user.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 animate-fade-in">
        <!-- Logo and Title -->
        <div class="text-center">
          <div class="mx-auto h-12 w-12 bg-primary-500 rounded-full flex items-center justify-center mb-4">
            <mat-icon class="text-white text-2xl">task_alt</mat-icon>
          </div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">{{labels.APP_TITLE}}</h2>
          <p class="text-gray-600">{{labels.LOGIN}}</p>
        </div>

        <!-- Login Form -->
        <mat-card class="p-8 shadow-xl border-0">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Email Field -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{labels.EMAIL}}</mat-label>
              <input 
                matInput 
                type="email" 
                formControlName="email"
                [placeholder]="labels.EMAIL"
                autocomplete="email">
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                {{labels.REQUIRED_FIELD}}
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                {{labels.INVALID_EMAIL}}
              </mat-error>
            </mat-form-field>

            <!-- Password Field -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{labels.PASSWORD}}</mat-label>
              <input 
                matInput 
                [type]="hidePassword ? 'password' : 'text'"
                formControlName="password"
                [placeholder]="labels.PASSWORD"
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
                {{labels.REQUIRED_FIELD}}
              </mat-error>
              <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
                Mínimo 6 caracteres
              </mat-error>
            </mat-form-field>

            <!-- Remember Me -->
            <div class="flex items-center justify-between">
              <mat-checkbox formControlName="rememberMe" color="primary">
                {{labels.REMEMBER_ME}}
              </mat-checkbox>
              <button type="button" mat-button color="primary" class="text-sm">
                {{labels.FORGOT_PASSWORD}}
              </button>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-3">
              <div class="flex">
                <mat-icon class="text-red-400 mr-2">error</mat-icon>
                <div class="text-sm text-red-700">{{errorMessage}}</div>
              </div>
            </div>

            <!-- Submit Button -->
            <button 
              mat-raised-button 
              color="primary" 
              type="submit"
              [disabled]="loginForm.invalid || isLoading"
              class="w-full h-12 text-base font-medium">
              <div class="flex items-center justify-center space-x-2">
                <mat-spinner *ngIf="isLoading" diameter="20" class="mr-2"></mat-spinner>
                <span>{{isLoading ? labels.LOADING : labels.LOGIN}}</span>
              </div>
            </button>

            <!-- Sign Up Link -->
            <div class="text-center">
              <p class="text-sm text-gray-600">
                {{labels.SIGN_UP_ALTERNATIVE}}
                <button 
                  type="button" 
                  mat-button 
                  color="primary" 
                  (click)="navigateToRegister()"
                  class="ml-1">
                  {{labels.REGISTER}}
                </button>
              </p>
            </div>
          </form>
        </mat-card>

        <!-- Footer -->
        <div class="text-center">
          <p class="text-xs text-gray-500">
            © 2025 Sistema de Gestión de Tareas. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-snackbar {
      background-color: #f44336;
      color: white;
    }

    .mat-mdc-form-field {
      margin-bottom: 0;
    }

    .mat-mdc-card {
      border-radius: 12px;
    }

    .mat-mdc-raised-button {
      border-radius: 8px;
    }

    .animate-fade-in {
      animation: fadeIn 0.5s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class LoginComponent implements OnInit {
  labels = UI_LABELS;
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage = '';
  returnUrl = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.createForm();
  }

  ngOnInit(): void {
    // Get return URL from route parameters or default to dashboard
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginRequest: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open(this.labels.LOGIN_SUCCESS, 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });

          // Redirect to return URL or dashboard
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || this.labels.LOGIN_ERROR;
          console.error('Login error:', error);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.loginForm.markAllAsTouched();
    }
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register'], {
      queryParams: { returnUrl: this.returnUrl }
    });
  }
}