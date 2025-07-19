import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, NoAuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  // Default redirect
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Authentication routes (accessible only when not authenticated)
  {
    path: 'auth',
    canActivate: [NoAuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/components/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/components/register.component').then(m => m.RegisterComponent)
      }
    ]
  },

  // Protected routes (require authentication)
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/components/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'tasks',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/tasks/components/task-list.component').then(m => m.TaskListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/tasks/components/task-form.component').then(m => m.TaskFormComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/tasks/components/task-detail.component').then(m => m.TaskDetailComponent)
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./features/tasks/components/task-form.component').then(m => m.TaskFormComponent)
          }
        ]
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/components/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/components/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },

  // Fallback route
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false, // Set to true for debugging
    scrollPositionRestoration: 'top',
    preloadingStrategy: 2 // PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export { routes }