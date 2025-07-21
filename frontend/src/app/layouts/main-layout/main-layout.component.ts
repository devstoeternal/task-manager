import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { AuthService } from '../../core/services/auth.service';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { UI_LABELS } from '../../shared/constants/ui-labels.constants';
import { UserProfile } from '../../core/models/user.interface';

@Component({
  selector: 'app-main-layout',
  template: `
    <mat-sidenav-container class="sidenav-container">
      <!-- Sidebar -->
      <mat-sidenav 
        #drawer 
        class="sidenav" 
        fixedInViewport 
        [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
        [mode]="(isHandset$ | async) ? 'over' : 'side'"
        [opened]="(isHandset$ | async) === false">
        
        <mat-toolbar class="sidebar-header">
          <img src="/assets/logo.png" alt="Logo" class="logo" />
          <span class="app-name">Task Manager</span>
        </mat-toolbar>

        <mat-nav-list class="nav-list">
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>{{ labels.DASHBOARD }}</span>
          </a>

          <a mat-list-item routerLink="/tasks" routerLinkActive="active-link">
            <mat-icon matListItemIcon>task_alt</mat-icon>
            <span matListItemTitle>{{ labels.TASKS }}</span>
          </a>

          <a mat-list-item routerLink="/tasks/my" routerLinkActive="active-link">
            <mat-icon matListItemIcon>assignment_ind</mat-icon>
            <span matListItemTitle>{{ labels.MY_TASKS }}</span>
          </a>

          <mat-divider></mat-divider>

          <a mat-list-item routerLink="/profile" routerLinkActive="active-link">
            <mat-icon matListItemIcon>person</mat-icon>
            <span matListItemTitle>{{ labels.PROFILE }}</span>
          </a>

          <a mat-list-item routerLink="/settings" routerLinkActive="active-link">
            <mat-icon matListItemIcon>settings</mat-icon>
            <span matListItemTitle>{{ labels.SETTINGS }}</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <!-- Main Content -->
      <mat-sidenav-content>
        <!-- Header -->
        <mat-toolbar color="primary" class="main-toolbar">
          <button
            type="button"
            aria-label="Toggle sidenav"
            mat-icon-button
            (click)="drawer.toggle()"
            *ngIf="isHandset$ | async">
            <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
          </button>

          <span class="spacer"></span>

          <!-- Theme Toggle -->
          <app-theme-toggle></app-theme-toggle>

          <!-- User Menu -->
          <button mat-button [matMenuTriggerFor]="userMenu" class="user-menu-button">
            <div class="user-avatar">
              {{ userProfile?.initials || 'U' }}
            </div>
            <span class="user-name">{{ userProfile?.fullName || 'Usuario' }}</span>
            <mat-icon>arrow_drop_down</mat-icon>
          </button>

          <mat-menu #userMenu="matMenu">
            <button mat-menu-item routerLink="/profile">
              <mat-icon>person</mat-icon>
              <span>{{ labels.PROFILE }}</span>
            </button>
            <button mat-menu-item routerLink="/settings">
              <mat-icon>settings</mat-icon>
              <span>{{ labels.SETTINGS }}</span>
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>{{ labels.LOGOUT }}</span>
            </button>
          </mat-menu>
        </mat-toolbar>

        <!-- Page Content -->
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }

    .sidenav {
      width: 260px;
      background: var(--mdc-theme-surface);
      border-right: 1px solid var(--mdc-theme-outline);
    }

    .sidebar-header {
      background: var(--mdc-theme-primary);
      color: var(--mdc-theme-on-primary);
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 16px;
      min-height: 64px;
    }

    .logo {
      width: 32px;
      height: 32px;
      border-radius: 4px;
    }

    .app-name {
      font-weight: 600;
      font-size: 1.1rem;
    }

    .nav-list {
      padding-top: 8px;
    }

    .nav-list a {
      margin: 4px 8px;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .nav-list a:hover {
      background-color: var(--mdc-theme-primary-container);
    }

    .active-link {
      background-color: var(--mdc-theme-primary-container) !important;
      color: var(--mdc-theme-on-primary-container) !important;
    }

    .main-toolbar {
      position: sticky;
      top: 0;
      z-index: 10;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .spacer {
      flex: 1 1 auto;
    }

    .user-menu-button {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--mdc-theme-on-primary);
      text-transform: none;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--mdc-theme-secondary);
      color: var(--mdc-theme-on-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .user-name {
      font-weight: 500;
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .main-content {
      padding: 24px;
      min-height: calc(100vh - 64px);
      background: var(--mdc-theme-surface-variant);
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 16px;
      }

      .user-name {
        display: none;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatDividerModule,
    ThemeToggleComponent
  ]
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  labels = UI_LABELS;
  userProfile: UserProfile | null = null;
  
  private destroy$ = new Subject<void>();

  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService
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
}