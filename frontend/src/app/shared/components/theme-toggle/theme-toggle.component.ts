import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button
      mat-icon-button
      (click)="toggleTheme()"
      [matTooltip]="tooltipText"
      class="theme-toggle-btn"
    >
      <mat-icon>{{ isDarkMode ? 'light_mode' : 'dark_mode' }}</mat-icon>
    </button>
  `,
  styles: [`
    .theme-toggle-btn {
      transition: transform 0.2s ease;
    }
    
    .theme-toggle-btn:hover {
      transform: scale(1.1);
    }
  `],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule]
})
export class ThemeToggleComponent {
  isDarkMode = false;

  constructor(private themeService: ThemeService) {
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  get tooltipText(): string {
    return this.isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  }
}