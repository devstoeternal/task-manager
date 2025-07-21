import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-auth-layout',
  template: `
    <div class="auth-layout">
      <div class="auth-header">
        <div class="theme-toggle-container">
          <app-theme-toggle></app-theme-toggle>
        </div>
      </div>

      <div class="auth-content">
        <div class="auth-branding">
          <img src="/assets/logo.png" alt="Logo" class="logo" />
          <h1 class="app-title">Sistema de Gestión de Tareas</h1>
          <p class="app-subtitle">Organiza y gestiona tus tareas de manera eficiente</p>
        </div>

        <mat-card class="auth-card">
          <router-outlet></router-outlet>
        </mat-card>
      </div>

      <div class="auth-footer">
        <p>&copy; 2025 Task Manager. Todos los derechos reservados.</p>
      </div>
    </div>
  `,
  styles: [`
    .auth-layout {
      min-height: 100vh;
      background: linear-gradient(135deg, 
        var(--mdc-theme-primary) 0%, 
        var(--mdc-theme-primary-container) 100%);
      display: flex;
      flex-direction: column;
    }

    .auth-header {
      display: flex;
      justify-content: flex-end;
      padding: 16px 24px;
    }

    .theme-toggle-container {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      padding: 4px;
    }

    .auth-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 64px;
      padding: 0 24px;
    }

    .auth-branding {
      text-align: center;
      color: white;
      max-width: 400px;
    }

    .logo {
      width: 80px;
      height: 80px;
      margin-bottom: 24px;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }

    .app-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 16px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .app-subtitle {
      font-size: 1.125rem;
      opacity: 0.9;
      line-height: 1.6;
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      padding: 0;
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
      border-radius: 16px;
      overflow: hidden;
    }

    .auth-footer {
      text-align: center;
      padding: 16px 24px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .auth-content {
        flex-direction: column;
        gap: 32px;
        text-align: center;
      }

      .auth-branding {
        max-width: 100%;
      }

      .app-title {
        font-size: 2rem;
      }

      .auth-card {
        max-width: 90%;
      }
    }

    @media (max-width: 480px) {
      .auth-header,
      .auth-footer {
        padding: 12px 16px;
      }

      .auth-content {
        padding: 0 16px;
      }

      .app-title {
        font-size: 1.75rem;
      }
    }
  `],
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatCardModule, ThemeToggleComponent]
})
export class AuthLayoutComponent {}