import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="loading-spinner-container">
      <mat-spinner diameter="40"></mat-spinner>
      <p class="loading-text">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .loading-text {
      margin-top: 1rem;
      color: var(--mdc-theme-text-secondary-on-background);
      font-size: 0.875rem;
    }
  `],
  standalone: true,
  imports: [MatProgressSpinnerModule]
})
export class LoadingSpinnerComponent {
  message = 'Cargando...';
}