import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { UI_LABELS } from '../../../shared/constants/ui-labels.constants';
import { RegisterRequest } from '../../../shared/models/user.interface';

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
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div class="w-full max-w-md animate-fade-in">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full mb-4">
            <mat-icon class="text-white text-3xl">person_add</mat-icon>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{labels.CREATE_ACCOUNT}}</h1>
          <p class="text-gray-600">{{labels.JOIN_PLATFORM}}</p>
        </div>

        <!-- Registration Form -->
        <mat-card class="p-8 shadow-xl border-0">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <!-- Error Message -->
            <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex items-start">
                <mat-icon class="text-red-500 mt-0.5 mr-2">error_outline</mat-icon>
                <div>
                  <h3 class="text-red-800 font-medium">Error en el registro</h3>
                  <p class="text-red-700 text-sm mt-1">{{errorMessage}}</p>
                </div>
              </div>
            </div>

            <!-- First Name -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{labels.FIRST_NAME}}</mat-label>
              <input 
                matInput 
                formControlName="firstName"
                [placeholder]="labels.FIRST_NAME_PLACEHOLDER"
                autocomplete="given-name">
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="registerForm.get('firstName')?.hasError('required')">
                {{labels.REQUIRED_FIELD}}
              </mat-error>
              <mat-error *ngIf="registerForm.get('firstName')?.hasError('minlength')">
                Mínimo 2 caracteres
              </mat-error>
            </mat-form-field>

            <!-- Last Name -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{labels.LAST_NAME}}</mat-label>
              <input 
                matInput 
                formControlName="lastName"
                [placeholder]="labels.LAST_NAME_PLACEHOLDER"
                autocomplete="family-name">
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="registerForm.get('lastName')?.hasError('required')">
                {{labels.REQUIRED_FIELD}}
              </mat-error>
              <mat-error *ngIf="registerForm.get('lastName')?.hasError('minlength')">
                Mínimo 2 caracteres
              </mat-error>
            </mat-form-field>

            <!-- Email -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{labels.EMAIL}}</mat-label>
              <input 
                matInput 
                type="email"
                formControlName="email"
                [placeholder]="labels.EMAIL_PLACEHOLDER"
                autocomplete="email">
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                {{labels.REQUIRED_FIELD}}
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                {{labels.INVALID_EMAIL}}
              </mat-error>
            </mat-form-field>

            <!-- Password -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{labels.PASSWORD}}</mat-label>
              <input 
                matInput 
                [type]="hidePassword ? 'password' : 'text'"
                formControlName="password"
                [placeholder]="labels.PASSWORD_PLACEHOLDER"
                autocomplete="new-password">
              <button 
                mat-icon-button 
                matSuffix 
                type="button"
                (click)="hidePassword = !hidePassword"
                [attr.aria-label]="'Hide password'"
                [attr.aria-pressed]="hidePassword">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                {{labels.REQUIRED_FIELD}}
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                Mínimo 6 caracteres
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('pattern')">
                Debe contener al menos: 1 mayúscula, 1 minúscula y 1 número
              </mat-error>
            </mat-form-field>

            <!-- Confirm Password -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{labels.CONFIRM_PASSWORD}}</mat-label>
              <input 
                matInput 
                [type]="hideConfirmPassword ? 'password' : 'text'"
                formControlName="confirmPassword"
                [placeholder]="labels.CONFIRM_PASSWORD_PLACEHOLDER"
                autocomplete="new-password">
              <button 
                mat-icon-button 
                matSuffix 
                type="button"
                (click)="hideConfirmPassword = !hideConfirmPassword"
                [attr.aria-label]="'Hide password'"
                [attr.aria-pressed]="hideConfirmPassword">
                <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
                {{labels.REQUIRED_FIELD}}
              </mat-error>
              <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('passwordMismatch')">
                {{labels.PASSWORDS_MUST_MATCH}}
              </mat-error>
            </mat-form-field>

            <!-- Terms Acceptance -->
            <div class="flex items-start space-x-3">
              <mat-checkbox 
                formControlName="acceptTerms"
                color="primary"
                class="mt-1">
              </mat-checkbox>
              <div class="text-sm text-gray-600">
                <p>
                  Acepto los 
                  <a href="#" class="text-primary-600 hover:text-primary-700 font-medium">términos y condiciones</a> 
                  y la 
                  <a href="#" class="text-primary-600 hover:text-primary-700 font-medium">política de privacidad</a>
                </p>
                <mat-error *ngIf="registerForm.get('acceptTerms')?.hasError('required') && registerForm.get('acceptTerms')?.touched">
                  Debes aceptar los términos y condiciones
                </mat-error>
              </div>
            </div>

            <!-- Submit Button -->
            <button 
              mat-raised-button 
              color="primary"
              type="submit"
              class="w-full h-12 text-lg font-medium"
              [disabled]="registerForm.invalid || isLoading">
              
              <mat-spinner diameter="20" class="mr-2" *ngIf="isLoading"></mat-spinner>
              {{isLoading ? 'Creando cuenta...' : labels.CREATE_ACCOUNT}}
            </button>

            <!-- Login Link -->
            <div class="text-center pt-4">
              <p class="text-gray-600">
                ¿Ya tienes cuenta? 
                <button 
                  type="button"
                  (click)="navigateToLogin()"
                  class="text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus:underline">
                  {{labels.SIGN_IN_ALTERNATIVE}}
                </button>
              </p>
            </div>
          </form>
        </mat-card>

        <!-- Footer -->
        <div class="text-center mt-8">
          <p class="text-sm text-gray-500">
            Sistema de Gestión de Tareas v1.0 &copy; 2025.<br>
            Todos los derechos reservados.
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

    .success-snackbar {
      background-color: #4caf50;
      color: white;
    }

    .mat-mdc-form-field {
      margin-bottom: 0;
    }

    .mat-mdc-card {
      border-radius: 16px;
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

    .bg-primary-500 {
      background-color: #2196F3;
    }

    .text-primary-600 {
      color: #1976D2;
    }

    .text-primary-700 {
      color: #1565C0;
    }

    .hover\\:text-primary-700:hover {
      color: #1565C0;
    }
  `]
})
export class RegisterComponent implements OnInit {
  labels = UI_LABELS;
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
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
    this.registerForm = this.createForm();
  }

  ngOnInit(): void {
    // Get return URL from route parameters or default to dashboard
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      ]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  /**
   * Custom validator to check if passwords match
   */
  private passwordMatchValidator(control: AbstractControl): {[key: string]: any} | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    // Clear the error if passwords match
    if (confirmPassword?.hasError('passwordMismatch')) {
      const errors = { ...confirmPassword.errors };
      delete errors['passwordMismatch'];
      const hasErrors = Object.keys(errors).length > 0;
      confirmPassword.setErrors(hasErrors ? errors : null);
    }

    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const registerRequest: RegisterRequest = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName
      };

      this.authService.register(registerRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('¡Cuenta creada exitosamente! Bienvenido al sistema.', 'Cerrar', {
            duration: 4000,
            panelClass: ['success-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });

          // Redirect to return URL or dashboard
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Error al crear la cuenta. Inténtalo de nuevo.';
          console.error('Registration error:', error);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.registerForm.markAllAsTouched();
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: this.returnUrl }
    });
  }
}