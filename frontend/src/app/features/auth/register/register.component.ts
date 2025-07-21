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
    <div class="min-h-screen flex">
      <!-- Left side - Background Image -->
      <div class="hidden lg:flex lg:w-1/2 relative">
        <div class="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700"></div>
        <div class="absolute inset-0 bg-black/20"></div>
        <div class="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div class="max-w-md text-center">
            <mat-icon class="text-6xl mb-6 opacity-90">assignment</mat-icon>
            <h1 class="text-4xl font-bold mb-4">Únete a nosotros</h1>
            <p class="text-xl opacity-90 leading-relaxed">
              Crea tu cuenta y comienza a gestionar tus tareas de manera más eficiente que nunca.
            </p>
          </div>
        </div>
        <!-- Decorative elements -->
        <div class="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div class="absolute bottom-20 left-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      <!-- Right side - Register Form -->
      <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white dark:bg-gray-900">
        <div class="mx-auto w-full max-w-sm lg:w-96">
          <!-- Mobile logo -->
          <div class="lg:hidden text-center mb-8">
            <mat-icon class="text-5xl text-purple-600 mb-4">assignment</mat-icon>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Task Manager TCC</h1>
          </div>

          <div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Crear cuenta</h2>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              ¿Ya tienes cuenta?
              <a routerLink="/auth/login" class="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors">
                Inicia sesión
              </a>
            </p>
          </div>

          <div class="mt-8">
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre
                  </label>
                  <input
                    id="firstName"
                    formControlName="firstName"
                    type="text"
                    autocomplete="given-name"
                    placeholder="Tu nombre"
                    class="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    [class.border-red-300]="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched"
                    [class.focus:ring-red-500]="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched">
                  <p *ngIf="registerForm.get('firstName')?.hasError('required') && registerForm.get('firstName')?.touched" 
                     class="mt-1 text-sm text-red-600 dark:text-red-400">
                    El nombre es requerido
                  </p>
                </div>

                <div>
                  <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Apellido
                  </label>
                  <input
                    id="lastName"
                    formControlName="lastName"
                    type="text"
                    autocomplete="family-name"
                    placeholder="Tu apellido"
                    class="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    [class.border-red-300]="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched"
                    [class.focus:ring-red-500]="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched">
                  <p *ngIf="registerForm.get('lastName')?.hasError('required') && registerForm.get('lastName')?.touched" 
                     class="mt-1 text-sm text-red-600 dark:text-red-400">
                    El apellido es requerido
                  </p>
                </div>
              </div>

              <div>
                <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Usuario
                </label>
                <div class="relative">
                  <input
                    id="username"
                    formControlName="username"
                    type="text"
                    autocomplete="username"
                    placeholder="Elige un nombre de usuario"
                    class="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    [class.border-red-300]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched"
                    [class.focus:ring-red-500]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched">
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <mat-icon class="h-5 w-5 text-gray-400">person</mat-icon>
                  </div>
                </div>
                <p *ngIf="registerForm.get('username')?.hasError('required') && registerForm.get('username')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                  El usuario es requerido
                </p>
                <p *ngIf="registerForm.get('username')?.hasError('minlength') && registerForm.get('username')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                  Mínimo 3 caracteres
                </p>
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div class="relative">
                  <input
                    id="email"
                    formControlName="email"
                    type="email"
                    autocomplete="email"
                    placeholder="tu@email.com"
                    class="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    [class.border-red-300]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                    [class.focus:ring-red-500]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <mat-icon class="h-5 w-5 text-gray-400">email</mat-icon>
                  </div>
                </div>
                <p *ngIf="registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                  El email es requerido
                </p>
                <p *ngIf="registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                  Email inválido
                </p>
              </div>

              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contraseña
                </label>
                <div class="relative">
                  <input
                    id="password"
                    formControlName="password"
                    [type]="hidePassword ? 'password' : 'text'"
                    autocomplete="new-password"
                    placeholder="Crea una contraseña"
                    class="block w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    [class.border-red-300]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                    [class.focus:ring-red-500]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                  <button
                    type="button"
                    (click)="hidePassword = !hidePassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <mat-icon class="h-5 w-5">{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                </div>
                <p *ngIf="registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                  La contraseña es requerida
                </p>
                <p *ngIf="registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                  Mínimo 6 caracteres
                </p>
              </div>

              <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmar Contraseña
                </label>
                <div class="relative">
                  <input
                    id="confirmPassword"
                    formControlName="confirmPassword"
                    [type]="hideConfirmPassword ? 'password' : 'text'"
                    autocomplete="new-password"
                    placeholder="Confirma tu contraseña"
                    class="block w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    [class.border-red-300]="(registerForm.get('confirmPassword')?.invalid || registerForm.hasError('passwordMismatch')) && registerForm.get('confirmPassword')?.touched"
                    [class.focus:ring-red-500]="(registerForm.get('confirmPassword')?.invalid || registerForm.hasError('passwordMismatch')) && registerForm.get('confirmPassword')?.touched">
                  <button
                    type="button"
                    (click)="hideConfirmPassword = !hideConfirmPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <mat-icon class="h-5 w-5">{{ hideConfirmPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                </div>
                <p *ngIf="registerForm.get('confirmPassword')?.hasError('required') && registerForm.get('confirmPassword')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                  Confirma tu contraseña
                </p>
                <p *ngIf="registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                  Las contraseñas no coinciden
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  [disabled]="registerForm.invalid || loading"
                  class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  <span *ngIf="!loading" class="flex items-center">
                    <mat-icon class="mr-2">person_add</mat-icon>
                    Crear Cuenta
                  </span>
                  <span *ngIf="loading" class="flex items-center">
                    <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Creando cuenta...
                  </span>
                </button>
              </div>
            </form>

            <!-- Keyboard shortcuts hint -->
            <div class="mt-6 text-center">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Presiona <kbd class="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">Enter</kbd> para crear cuenta
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
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