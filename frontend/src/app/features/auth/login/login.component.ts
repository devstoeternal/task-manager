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
    <div class="min-h-screen flex">
      <!-- Left side - Background Image -->
      <div class="hidden lg:flex lg:w-1/2 relative">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"></div>
        <div class="absolute inset-0 bg-black/20"></div>
        <div class="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div class="max-w-md text-center">
            <mat-icon class="text-6xl mb-6 opacity-90">assignment</mat-icon>
            <h1 class="text-4xl font-bold mb-4">Task Manager TCC</h1>
            <p class="text-xl opacity-90 leading-relaxed">
              Organiza, gestiona y completa tus tareas de manera eficiente con nuestra plataforma moderna.
            </p>
          </div>
        </div>
        <!-- Decorative elements -->
        <div class="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div class="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      <!-- Right side - Login Form -->
      <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white dark:bg-gray-900">
        <div class="mx-auto w-full max-w-sm lg:w-96">
          <!-- Mobile logo -->
          <div class="lg:hidden text-center mb-8">
            <mat-icon class="text-5xl text-blue-600 mb-4">assignment</mat-icon>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Task Manager TCC</h1>
          </div>

          <div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Iniciar sesión</h2>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              ¿No tienes cuenta?
              <a routerLink="/auth/register" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                Regístrate aquí
              </a>
            </p>
          </div>

          <div class="mt-8">
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <div>
                <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Usuario o Email
                </label>
                <div class="relative">
                  <input
                    id="username"
                    formControlName="username"
                    type="text"
                    autocomplete="username"
                    placeholder="Ingresa tu usuario o email"
                    class="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    [class.border-red-300]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
                    [class.focus:ring-red-500]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <mat-icon class="h-5 w-5 text-gray-400">person</mat-icon>
                  </div>
                </div>
                <p *ngIf="loginForm.get('username')?.hasError('required') && loginForm.get('username')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                  El usuario es requerido
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
                    autocomplete="current-password"
                    placeholder="Ingresa tu contraseña"
                    class="block w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    [class.border-red-300]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                    [class.focus:ring-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                  <button
                    type="button"
                    (click)="hidePassword = !hidePassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <mat-icon class="h-5 w-5">{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                </div>
                <p *ngIf="loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                  La contraseña es requerida
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  [disabled]="loginForm.invalid || loading"
                  class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  <span *ngIf="!loading" class="flex items-center">
                    <mat-icon class="mr-2">login</mat-icon>
                    Iniciar Sesión
                  </span>
                  <span *ngIf="loading" class="flex items-center">
                    <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Iniciando sesión...
                  </span>
                </button>
              </div>
            </form>

            <!-- Keyboard shortcuts hint -->
            <div class="mt-6 text-center">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Presiona <kbd class="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">Enter</kbd> para iniciar sesión
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
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