import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { UI_LABELS } from '../../shared/constants/ui-labels.constants';
import { User } from '../../shared/models/user.interface';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <div class="layout-container">
      <mat-sidenav-container class="sidenav-container">
        
        <!-- Side Navigation -->
        <mat-sidenav 
          #drawer 
          class="sidenav"
          fixedInViewport
          [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
          [mode]="(isHandset$ | async) ? 'over' : 'side'"
          [opened]="(isHandset$ | async) === false">
          
          <!-- Sidebar Header -->
          <div class="sidebar-header p-4 bg-primary-500 text-white">
            <div class="flex items-center space-x-3">
              <div class="h-10 w-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <mat-icon class="text-white">task_alt</mat-icon>
              </div>
              <div *ngIf="!(isHandset$ | async)">
                <h2 class="text-lg font-semibold">Sistema de Tareas</h2>
                <p class="text-primary-100 text-sm">Gestión Empresarial</p>
              </div>
            </div>
          </div>

          <!-- Navigation Menu -->
          <mat-nav-list class="p-0">
            <a 
              mat-list-item 
              routerLink="/dashboard" 
              routerLinkActive="active-link"
              class="nav-item">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <div matListItemTitle>{{labels.DASHBOARD}}</div>
            </a>
            
            <a 
              mat-list-item 
              routerLink="/tasks" 
              routerLinkActive="active-link"
              class="nav-item">
              <mat-icon matListItemIcon>assignment</mat-icon>
              <div matListItemTitle>{{labels.MY_TASKS}}</div>
            </a>
            
            <mat-divider class="my-2"></mat-divider>
            
            <!-- Quick Actions -->
            <div class="px-4 py-2">
              <p class="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                Acciones Rápidas
              </p>
            </div>
            
            <a 
              mat-list-item 
              routerLink="/tasks/new"
              class="nav-item">
              <mat-icon matListItemIcon>add_circle</mat-icon>
              <div matListItemTitle>{{labels.NEW_TASK}}</div>
            </a>
            
            <a 
              mat-list-item 
              [routerLink]="['/tasks']"
              [queryParams]="{status: 'PENDING'}"
              class="nav-item">
              <mat-icon matListItemIcon>schedule</mat-icon>
              <div matListItemTitle>Tareas Pendientes</div>
            </a>
            
            <a 
              mat-list-item 
              [routerLink]="['/tasks']"
              [queryParams]="{priority: 'HIGH'}"
              class="nav-item">
              <mat-icon matListItemIcon>priority_high</mat-icon>
              <div matListItemTitle>Alta Prioridad</div>
            </a>
          </mat-nav-list>

          <!-- Sidebar Footer -->
          <div class="sidebar-footer mt-auto p-4 border-t border-gray-200">
            <div class="flex items-center space-x-3" *ngIf="currentUser">
              <div class="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-semibold">
                  {{currentUser.firstName.charAt(0)}}{{currentUser.lastName.charAt(0)}}
                </span>
              </div>
              <div class="flex-1 min-w-0" *ngIf="!(isHandset$ | async)">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{currentUser.firstName}} {{currentUser.lastName}}
                </p>
                <p class="text-xs text-gray-500 truncate">
                  {{currentUser.email}}
                </p>
              </div>
            </div>
          </div>
        </mat-sidenav>

        <!-- Main Content -->
        <mat-sidenav-content class="main-content">
          
          <!-- Top Toolbar -->
          <mat-toolbar class="toolbar shadow-sm bg-white border-b border-gray-200">
            
            <!-- Menu Button (Mobile) -->
            <button
              type="button"
              aria-label="Toggle sidenav"
              mat-icon-button
              (click)="drawer.toggle()"
              *ngIf="isHandset$ | async">
              <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
            </button>
            
            <!-- Page Title -->
            <span class="flex-1 text-lg font-semibold text-gray-900">
              {{getPageTitle()}}
            </span>

            <!-- Toolbar Actions -->
            <div class="flex items-center space-x-2">
              
              <!-- Notifications (placeholder) -->
              <button mat-icon-button [matMenuTriggerFor]="notificationMenu">
                <mat-icon>notifications</mat-icon>
              </button>
              
              <!-- User Menu -->
              <button 
                mat-button 
                [matMenuTriggerFor]="userMenu"
                class="user-menu-button">
                <div class="flex items-center space-x-2">
                  <div class="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-semibold" *ngIf="currentUser">
                      {{currentUser.firstName.charAt(0)}}{{currentUser.lastName.charAt(0)}}
                    </span>
                  </div>
                  <span class="hidden md:block text-sm font-medium" *ngIf="currentUser">
                    {{currentUser.firstName}}
                  </span>
                  <mat-icon class="hidden md:block">keyboard_arrow_down</mat-icon>
                </div>
              </button>
            </div>
          </mat-toolbar>

          <!-- Page Content -->
          <main class="page-content">
            <router-outlet></router-outlet>
          </main>
        </mat-sidenav-content>
      </mat-sidenav-container>

      <!-- Notification Menu -->
      <mat-menu #notificationMenu="matMenu">
        <div class="p-4 min-w-80">
          <h3 class="font-semibold text-gray-900 mb-3">Notificaciones</h3>
          <div class="text-sm text-gray-500">
            No hay notificaciones nuevas
          </div>
        </div>
      </mat-menu>

      <!-- User Menu -->
      <mat-menu #userMenu="matMenu">
        <div class="p-3 border-b border-gray-200" *ngIf="currentUser">
          <div class="font-medium text-gray-900">
            {{currentUser.firstName}} {{currentUser.lastName}}
          </div>
          <div class="text-sm text-gray-500">
            {{currentUser.email}}
          </div>
        </div>
        
        <button mat-menu-item routerLink="/profile">
          <mat-icon>person</mat-icon>
          <span>{{labels.PROFILE}}</span>
        </button>
        
        <button mat-menu-item routerLink="/settings">
          <mat-icon>settings</mat-icon>
          <span>{{labels.SETTINGS}}</span>
        </button>
        
        <mat-divider></mat-divider>
        
        <button mat-menu-item (click)="logout()" class="text-red-600">
          <mat-icon>logout</mat-icon>
          <span>{{labels.LOGOUT}}</span>
        </button>
      </mat-menu>
    </div>
  `,
  styles: [`
    .layout-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .sidenav-container {
      flex: 1;
    }

    .sidenav {
      width: 280px;
      background: white;
      border-right: 1px solid #e5e7eb;
    }

    .sidebar-header {
      background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
    }

    .sidebar-footer {
      margin-top: auto;
    }

    .nav-item {
      padding: 12px 24px;
      margin: 2px 8px;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .nav-item:hover {
      background-color: #f3f4f6;
    }

    .active-link {
      background-color: #e3f2fd !important;
      color: #1976d2;
    }

    .active-link .mat-icon {
      color: #1976d2;
    }

    .toolbar {
      position: sticky;
      top: 0;
      z-index: 2;
      height: 64px;
    }

    .page-content {
      min-height: calc(100vh - 64px);
      background-color: #fafafa;
    }

    .user-menu-button {
      border-radius: 24px;
      padding: 4px 8px;
    }

    .user-menu-button:hover {
      background-color: #f5f5f5;
    }

    /* Mobile adjustments */
    @media (max-width: 768px) {
      .sidenav {
        width: 100vw;
        max-width: 320px;
      }
      
      .toolbar {
        padding: 0 8px;
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .nav-item {
        border: 1px solid transparent;
      }
      
      .active-link {
        border-color: #1976d2;
      }
    }
  `]
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  labels = UI_LABELS;
  
  currentUser: User | null = null;
  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset);
  
  private destroy$ = new Subject<void>();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to current user
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getPageTitle(): string {
    const url = this.router.url;
    
    if (url.includes('/dashboard')) {
      return this.labels.DASHBOARD;
    } else if (url.includes('/tasks/new')) {
      return this.labels.NEW_TASK;
    } else if (url.includes('/tasks') && url.includes('/edit')) {
      return this.labels.EDIT_TASK;
    } else if (url.includes('/tasks')) {
      return this.labels.MY_TASKS;
    } else if (url.includes('/profile')) {
      return this.labels.PROFILE;
    } else if (url.includes('/settings')) {
      return this.labels.SETTINGS;
    }
    
    return this.labels.APP_TITLE;
  }

  logout(): void {
    if (confirm(this.labels.LOGOUT_CONFIRM)) {
      this.authService.logout();
    }
  }
}