import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="container-responsive py-6">
      <mat-card class="p-6">
        <h2 class="text-2xl font-bold mb-4">Configuración</h2>
        <p>Esta funcionalidad estará disponible próximamente.</p>
      </mat-card>
    </div>
  `
})
export class SettingsComponent {}