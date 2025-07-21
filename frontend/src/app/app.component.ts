import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ThemeService } from './core/services/theme.service';
import { LoadingService } from './core/services/loading.service';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container" [class.loading]="isLoading">
      <router-outlet></router-outlet>
      
      <!-- Global Loading Overlay -->
      <div class="loading-overlay" *ngIf="isLoading">
        <app-loading-spinner></app-loading-spinner>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      transition: all 0.3s ease;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(2px);
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSnackBarModule,
    LoadingSpinnerComponent
  ]
})
export class AppComponent implements OnInit {
  isLoading = false;

  constructor(
    private themeService: ThemeService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    // Subscribe to loading state
    this.loadingService.loading$.subscribe(loading => {
      this.isLoading = loading;
    });
  }
}