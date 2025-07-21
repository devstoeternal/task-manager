import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface KeyboardShortcut {
  keys: string[];
  description: string;
  action?: () => void;
}

@Component({
  selector: 'app-keyboard-shortcuts',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Atajos de teclado</h3>
        <mat-icon class="text-gray-400 text-sm">keyboard</mat-icon>
      </div>
      
      <div class="space-y-2">
        <div *ngFor="let shortcut of shortcuts" class="flex items-center justify-between">
          <span class="text-xs text-gray-600 dark:text-gray-300 flex-1">{{ shortcut.description }}</span>
          <div class="flex items-center space-x-1 ml-2">
            <kbd 
              *ngFor="let key of shortcut.keys; let last = last"
              class="inline-flex items-center px-1.5 py-0.5 text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">
              {{ key }}
            </kbd>
            <span *ngIf="!last" class="text-gray-400 text-xs">+</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class KeyboardShortcutsComponent {
  @Input() shortcuts: KeyboardShortcut[] = [
    { keys: ['Ctrl', 'N'], description: 'Nueva tarea' },
    { keys: ['Ctrl', 'S'], description: 'Guardar' },
    { keys: ['Ctrl', 'F'], description: 'Buscar' },
    { keys: ['Esc'], description: 'Cancelar' },
    { keys: ['Enter'], description: 'Confirmar' }
  ];
}