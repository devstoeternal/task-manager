import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { AppComponent } from './app/app.component';
import { routes } from './app/app-routing.module';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './app/core/interceptors/error.interceptor';

// Define routes array since we're using standalone components
const routes = [
  // Default redirect
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Authentication routes (accessible only when not authenticated)
  {
    path: 'auth',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./app/features/auth/components/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./app/features/auth/components/register.component').then(m => m.RegisterComponent)
      }
    ]
  },

  // Protected routes (require authentication)
  {
    path: '',
    loadComponent: () => import('./app/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./app/features/dashboard/components/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'tasks',
        children: [
          {
            path: '',
            loadComponent: () => import('./app/features/tasks/components/task-list.component').then(m => m.TaskListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./app/features/tasks/components/task-form.component').then(m => m.TaskFormComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./app/features/tasks/components/task-detail.component').then(m => m.TaskDetailComponent)
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./app/features/tasks/components/task-form.component').then(m => m.TaskFormComponent)
          }
        ]
      },
      {
        path: 'profile',
        loadComponent: () => import('./app/features/profile/components/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./app/features/settings/components/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },

  // Fallback route
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([
        AuthInterceptor,
        ErrorInterceptor
      ])
    ),
    importProvidersFrom(MatSnackBarModule),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ]
}).catch(err => console.error(err));