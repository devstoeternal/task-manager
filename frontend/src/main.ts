import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './app/core/interceptors/error.interceptor';

// Definir rutas aquí mismo para evitar conflictos
const appRoutes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full' as const
  },
  {
    path: 'auth',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full' as const
      },
      {
        path: 'login',
        loadComponent: () => import('./app/features/auth/components/login.component').then(c => c.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./app/features/auth/components/register.component').then(c => c.RegisterComponent)
      }
    ]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./app/features/dashboard/components/dashboard.component').then(c => c.DashboardComponent)
  },
  {
    path: 'tasks',
    children: [
      {
        path: '',
        loadComponent: () => import('./app/features/tasks/components/task-list.component').then(c => c.TaskListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./app/features/tasks/components/task-form.component').then(c => c.TaskFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./app/features/tasks/components/task-detail.component').then(c => c.TaskDetailComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./app/features/tasks/components/task-form.component').then(c => c.TaskFormComponent)
      }
    ]
  },
  {
    path: 'profile',
    loadComponent: () => import('./app/features/profile/components/profile.component').then(c => c.ProfileComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./app/features/settings/components/settings.component').then(c => c.SettingsComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard',
    pathMatch: 'full' as const
  }
];

// Función interceptor para Auth
function authInterceptor(req: any, next: any) {
  const token = localStorage.getItem('token');
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }
  return next(req);
}

// Función interceptor para Errores
function errorInterceptor(req: any, next: any) {
  return next(req); // Simplificado por ahora
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),
    importProvidersFrom(MatSnackBarModule)
  ]
}).catch(err => console.error(err));