import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './app/core/interceptors/error.interceptor';
import { AuthGuard, NoAuthGuard } from './app/core/guards/auth.guard';

// 🔧 RUTAS CORREGIDAS
const appRoutes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full' as const
  },

  // 🔓 Rutas públicas - USAR NoAuthGuard
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

  // 🔒 Rutas protegidas - USAR AuthGuard
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('./app/layouts/main-layout/main-layout.component').then(c => c.MainLayoutComponent),
    children: [
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
      }
    ]
  },

  // Fallback route
  {
    path: '**',
    redirectTo: '/dashboard',
    pathMatch: 'full' as const
  }
];

// 🚀 BOOTSTRAP DE LA APLICACIÓN
bootstrapApplication(AppComponent, {
  providers: [
    // Router con rutas
    provideRouter(appRoutes),
    
    // Animaciones para Material Design
    provideAnimations(),
    
    // HTTP Client SIN interceptors funcionales
    provideHttpClient(),
    
    // Material Design modules
    importProvidersFrom(
      MatSnackBarModule,
      MatNativeDateModule
    ),
    
    // Guards como providers
    AuthGuard,
    NoAuthGuard,
    
    // 🔧 INTERCEPTORS USANDO HTTP_INTERCEPTORS (método clásico)
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ]
}).catch(err => {
  console.error('Error starting application:', err);
});