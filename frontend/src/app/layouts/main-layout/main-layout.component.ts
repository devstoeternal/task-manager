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
        
        <mat-toolbar class="sidenav-header">
          <mat-icon class="app-icon">assignment</mat-icon>
          <span class="app-title">Task Manager</span>
        </mat-toolbar>
        
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <div matListItemTitle>Dashboard</div>
          </a>
          
          <a mat-list-item routerLink="/tasks" routerLinkActive="active">
            <mat-icon matListItemIcon>assignment</mat-icon>
            <div matListItemTitle>Mis Tareas</div>
          </a>
          
          <mat-divider></mat-divider>
          
          <a mat-list-item routerLink="/profile" routerLinkActive="active">
            <mat-icon matListItemIcon>person</mat-icon>
            <div matListItemTitle>Mi Perfil</div>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <!-- Main content -->
      <mat-sidenav-content>
        <!-- Toolbar -->
        <mat-toolbar color="primary" class="main-toolbar">
          <button
            type="button"
            aria-label="Toggle sidenav"
            mat-icon-button
            (click)="drawer.toggle()"
            *ngIf="isHandset$ | async">
            <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
          </button>
          
          <span class="toolbar-spacer"></span>
          
          <!-- User menu -->
          <div class="user-menu" *ngIf="userProfile">
            <button mat-button [matMenuTriggerFor]="userMenu" class="user-button">
              <div class="user-avatar">{{ userProfile.initials }}</div>
              <span class="user-name">{{ userProfile.firstName }}</span>
              <mat-icon>arrow_drop_down</mat-icon>
            </button>
            
            <mat-menu #userMenu="matMenu">
              <div class="user-menu-header">
                <div class="user-info">
                  <div class="user-display-name">{{ userProfile.fullName }}</div>
                  <div class="user-email">{{ userProfile.email }}</div>
                </div>
              </div>
              
              <mat-divider></mat-divider>
              
              <button mat-menu-item routerLink="/profile">
                <mat-icon>person</mat-icon>
                <span>Mi Perfil</span>
              </button>
              
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Cerrar Sesión</span>
              </button>
            </mat-menu>
          </div>
        </mat-toolbar>

        <!-- Page content -->
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100%;
    }

    .sidenav {
      width: 250px;
      background: #fafafa;
      border-right: 1px solid #e0e0e0;
    }

    .sidenav-header {
      background: #1976d2;
      color: white;
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 64px;
    }

    .app-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .app-title {
      font-size: 1.2rem;
      font-weight: 500;
    }

    .main-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .toolbar-spacer {
      flex: 1 1 auto;
    }

    .user-menu {
      display: flex;
      align-items: center;
    }

    .user-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 8px;
      color: white;
    }

    .user-button:hover {
      background: rgba(255,255,255,0.1);
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      color: white;
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

    .user-menu-header {
      padding: 16px;
      background: #f5f5f5;
    }

    .user-display-name {
      font-weight: 500;
      color: #333;
    }

    .user-email {
      font-size: 0.875rem;
      color: #666;
      margin-top: 4px;
    }

    .main-content {
      padding: 0;
      min-height: calc(100vh - 64px);
      background: #f5f5f5;
    }

    .mat-mdc-list-item.active {
      background: rgba(25, 118, 210, 0.1);
      color: #1976d2;
    }

    .mat-mdc-list-item.active .mat-icon {
      color: #1976d2;
    }

    @media (max-width: 768px) {
      .user-name {
        display: none;
      }
      
      .main-content {
        padding: 0;
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
    MatDividerModule
  ]
})
export class MainLayoutComponent implements OnInit, OnDestroy {
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