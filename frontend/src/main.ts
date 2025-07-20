import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';
import { importProvidersFrom, inject } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './app/core/interceptors/error.interceptor';
import { AuthGuard, NoAuthGuard } from './app/core/guards/auth.guard';

// 🔧 RUTAS CORREGIDAS CON GUARDS APLICADOS
const appRoutes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full' as const
  },

  // 🔓 Rutas públicas (solo accesibles cuando NO estás autenticado)
  {
    path: 'auth',
    canActivate: [(route: any, state: any) => inject(AuthGuard).canActivate(route, state)],
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

  // 🔒 Rutas protegidas (requieren autenticación)
  {
    path: '',
    canActivate: [(route: any, state: any) => inject(AuthGuard).canActivate(route, state)],
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

// 🔧 INTERCEPTORS CORREGIDOS - Usar las clases reales
function createAuthInterceptor() {
  return (req: any, next: any) => {
    const authInterceptor = inject(AuthInterceptor);
    return authInterceptor.intercept(req, next);
  };
}

function createErrorInterceptor() {
  return (req: any, next: any) => {
    const errorInterceptor = inject(ErrorInterceptor);
    return errorInterceptor.intercept(req, next);
  };
}

// 🚀 BOOTSTRAP DE LA APLICACIÓN
bootstrapApplication(AppComponent, {
  providers: [
    // Router con rutas protegidas
    provideRouter(appRoutes),

    // Animaciones para Material Design
    provideAnimations(),

    // HTTP Client con interceptors corregidos
    provideHttpClient(
      withInterceptors([
        createAuthInterceptor(),
        createErrorInterceptor()
      ])
    ),

    // Material Design modules
    importProvidersFrom(
      MatSnackBarModule,
      MatNativeDateModule
    ),

    // Guards como providers
    AuthGuard,
    NoAuthGuard,

    // Interceptors como providers (backup)
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