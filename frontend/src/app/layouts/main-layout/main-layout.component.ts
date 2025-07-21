import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { KeyboardShortcutsComponent } from '../../shared/components/keyboard-shortcuts/keyboard-shortcuts.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { AuthService } from '../../core/services/auth.service';
import { UserProfile } from '../../core/models/user.interface';

@Component({
  selector: 'app-main-layout',
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <mat-sidenav-container class="h-screen">
      <!-- Sidebar -->
      <mat-sidenav 
        #drawer 
        class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700" 
        fixedInViewport
        [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
        [mode]="(isHandset$ | async) ? 'over' : 'side'"
        [opened]="(isHandset$ | async) === false">
        
        <!-- Sidebar Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center space-x-3">
            <div class="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <mat-icon class="text-white text-xl">assignment</mat-icon>
            </div>
            <div>
              <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Task Manager</h1>
              <p class="text-xs text-gray-500 dark:text-gray-400">TCC System</p>
            </div>
          </div>
        </div>
        
        <!-- Navigation -->
        <nav class="mt-6 px-3">
          <div class="space-y-1">
            <a routerLink="/dashboard" 
               routerLinkActive="bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600"
               class="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <mat-icon class="mr-3 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300">dashboard</mat-icon>
              Dashboard
            </a>
            
            <a routerLink="/tasks" 
               routerLinkActive="bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600"
               class="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <mat-icon class="mr-3 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300">assignment</mat-icon>
              Mis Tareas
            </a>
          </div>
          
          <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div class="space-y-1">
              <a routerLink="/profile" 
                 routerLinkActive="bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600"
                 class="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <mat-icon class="mr-3 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300">person</mat-icon>
                Mi Perfil
              </a>
            </div>
          </div>
        </nav>

        <!-- Sidebar Footer -->
        <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <app-theme-toggle></app-theme-toggle>
            <div class="relative group">
              <button class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors">
                <mat-icon class="text-sm">help_outline</mat-icon>
              </button>
              <div class="absolute bottom-full left-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                <app-keyboard-shortcuts></app-keyboard-shortcuts>
              </div>
            </div>
          </div>
        </div>
      </mat-sidenav>

      <!-- Main content -->
      <mat-sidenav-content class="bg-gray-50 dark:bg-gray-900">
        <!-- Top Navigation Bar -->
        <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div class="flex items-center">
              <button
                type="button"
                (click)="drawer.toggle()"
                *ngIf="isHandset$ | async"
                class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <mat-icon>menu</mat-icon>
              </button>
              
              <div class="ml-4 lg:ml-0">
                <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
                  {{ getPageTitle() }}
                </h1>
              </div>
            </div>
            
            <!-- User menu -->
            <div class="flex items-center space-x-4">
              <!-- Notifications -->
              <button class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative">
                <mat-icon>notifications</mat-icon>
                <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <!-- User Profile Dropdown -->
              <div class="relative" *ngIf="userProfile">
                <button 
                  [matMenuTriggerFor]="userMenu"
                  class="flex items-center space-x-3 p-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {{ userProfile.initials }}
                  </div>
                  <div class="hidden md:block text-left">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ userProfile.firstName }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ userProfile.email }}</p>
                  </div>
                  <mat-icon class="text-gray-400">arrow_drop_down</mat-icon>
                </button>
                
                <mat-menu #userMenu="matMenu" class="mt-2">
                  <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ userProfile.fullName }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ userProfile.email }}</p>
                  </div>
                  
                  <button mat-menu-item routerLink="/profile" class="flex items-center space-x-3 px-4 py-2">
                    <mat-icon class="text-gray-400">person</mat-icon>
                    <span>Mi Perfil</span>
                  </button>
                  
                  <button mat-menu-item (click)="logout()" class="flex items-center space-x-3 px-4 py-2 text-red-600 dark:text-red-400">
                    <mat-icon class="text-red-600 dark:text-red-400">logout</mat-icon>
                    <span>Cerrar Sesión</span>
                  </button>
                </mat-menu>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1">
          <div class="py-6">
            <router-outlet></router-outlet>
          </div>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
    </div>
  `,
  styles: []
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  userProfile: UserProfile | null = null;
  
  private destroy$ = new Subject<void>();

  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.userProfile = user ? this.authService.getUserProfile() : null;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.authService.logout();
  }

  getPageTitle(): string {
    const url = this.router.url;
    if (url.includes('/dashboard')) return 'Dashboard';
    if (url.includes('/tasks')) return 'Mis Tareas';
    if (url.includes('/profile')) return 'Mi Perfil';
    return 'Task Manager';
  }
}