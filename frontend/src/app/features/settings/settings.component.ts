import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ThemeService, Theme } from '../../core/services/theme.service';
import { UI_LABELS } from '../../shared/constants/ui-labels.constants';

@Component({
  selector: 'app-settings',
  template: `
    <div class="settings-container">
      <div class="page-header">
        <h1 class="page-title">{{ labels.SETTINGS }}</h1>
        <p class="page-subtitle">Personaliza tu experiencia en la aplicación</p>
      </div>

      <div class="settings-content">
        <!-- Theme Settings -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>palette</mat-icon>
              {{ labels.THEME_SETTINGS }}
            </mat-card-title>
            <mat-card-subtitle>Personaliza la apariencia de la aplicación</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="setting-item">
              <div class="setting-info">
                <h3 class="setting-title">Tema de la aplicación</h3>
                <p class="setting-description">Elige entre modo claro, oscuro o automático</p>
              </div>
              <mat-form-field appearance="outline">
                <mat-label>Tema</mat-label>
                <mat-select [formControl]="themeControl" (selectionChange)="onThemeChange()">
                  <mat-option value="light">
                    <mat-icon>light_mode</mat-icon>
                    {{ labels.LIGHT_MODE }}
                  </mat-option>
                  <mat-option value="dark">
                    <mat-icon>dark_mode</mat-icon>
                    {{ labels.DARK_MODE }}
                  </mat-option>
                  <mat-option value="auto">
                    <mat-icon>brightness_auto</mat-icon>
                    Automático
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="theme-preview">
              <h4>Vista previa del tema</h4>
              <div class="preview-cards">
                <div class="preview-card light-preview" [class.active]="currentTheme === 'light'">
                  <div class="preview-header"></div>
                  <div class="preview-content">
                    <div class="preview-line"></div>
                    <div class="preview-line short"></div>
                  </div>
                  <span class="preview-label">Claro</span>
                </div>
                
                <div class="preview-card dark-preview" [class.active]="currentTheme === 'dark'">
                  <div class="preview-header"></div>
                  <div class="preview-content">
                    <div class="preview-line"></div>
                    <div class="preview-line short"></div>
                  </div>
                  <span class="preview-label">Oscuro</span>
                </div>
                
                <div class="preview-card auto-preview" [class.active]="currentTheme === 'auto'">
                  <div class="preview-header"></div>
                  <div class="preview-content">
                    <div class="preview-line"></div>
                    <div class="preview-line short"></div>
                  </div>
                  <span class="preview-label">Auto</span>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Application Settings -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>settings</mat-icon>
              Configuración de la aplicación
            </mat-card-title>
            <mat-card-subtitle>Ajustes generales de funcionamiento</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="setting-item">
              <div class="setting-info">
                <h3 class="setting-title">Notificaciones</h3>
                <p class="setting-description">Recibe notificaciones de tareas y actualizaciones</p>
              </div>
              <mat-slide-toggle [formControl]="notificationsControl">
                Habilitar notificaciones
              </mat-slide-toggle>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3 class="setting-title">Auto-guardar</h3>
                <p class="setting-description">Guarda automáticamente los cambios en formularios</p>
              </div>
              <mat-slide-toggle [formControl]="autoSaveControl">
                Auto-guardar cambios
              </mat-slide-toggle>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3 class="setting-title">Animaciones</h3>
                <p class="setting-description">Mostrar animaciones y transiciones suaves</p>
              </div>
              <mat-slide-toggle [formControl]="animationsControl">
                Habilitar animaciones
              </mat-slide-toggle>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- About -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>info</mat-icon>
              Acerca de la aplicación
            </mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <div class="about-info">
              <div class="app-info">
                <h3>Sistema de Gestión de Tareas</h3>
                <p class="version">Versión 1.0.0</p>
                <p class="description">
                  Una aplicación moderna para gestionar tareas y proyectos de manera eficiente.
                  Desarrollada con Angular 17 y Material Design.
                </p>
              </div>

              <div class="tech-stack">
                <h4>Tecnologías utilizadas:</h4>
                <div class="tech-chips">
                  <span class="tech-chip">Angular 17</span>
                  <span class="tech-chip">Material Design</span>
                  <span class="tech-chip">TypeScript</span>
                  <span class="tech-chip">RxJS</span>
                  <span class="tech-chip">Tailwind CSS</span>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 8px;
      color: var(--mdc-theme-on-surface);
    }

    .page-subtitle {
      color: var(--mdc-theme-on-surface-variant);
      margin: 0;
      font-size: 1.125rem;
    }

    .settings-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .settings-card {
      border-radius: 12px;
    }

    .settings-card mat-card-header {
      margin-bottom: 16px;
    }

    .settings-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.25rem;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid var(--mdc-theme-outline-variant);
    }

    .setting-item:last-child {
      border-bottom: none;
    }

    .setting-info {
      flex: 1;
      margin-right: 24px;
    }

    .setting-title {
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: var(--mdc-theme-on-surface);
    }

    .setting-description {
      font-size: 0.875rem;
      color: var(--mdc-theme-on-surface-variant);
      margin: 0;
      line-height: 1.4;
    }

    .theme-preview {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--mdc-theme-outline-variant);
    }

    .theme-preview h4 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 16px 0;
      color: var(--mdc-theme-on-surface);
    }

    .preview-cards {
      display: flex;
      gap: 16px;
    }

    .preview-card {
      flex: 1;
      border: 2px solid var(--mdc-theme-outline-variant);
      border-radius: 8px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }

    .preview-card:hover {
      transform: translateY(-2px);
    }

    .preview-card.active {
      border-color: var(--mdc-theme-primary);
      box-shadow: 0 0 0 1px var(--mdc-theme-primary);
    }

    .preview-header {
      height: 20px;
      border-radius: 4px;
      margin-bottom: 8px;
    }

    .preview-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .preview-line {
      height: 8px;
      border-radius: 4px;
    }

    .preview-line.short {
      width: 60%;
    }

    .preview-label {
      position: absolute;
      bottom: -24px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.75rem;
      color: var(--mdc-theme-on-surface-variant);
    }

    /* Light theme preview */
    .light-preview .preview-header {
      background: #2196F3;
    }

    .light-preview .preview-line {
      background: #E0E0E0;
    }

    .light-preview {
      background: #FFFFFF;
    }

    /* Dark theme preview */
    .dark-preview .preview-header {
      background: #64B5F6;
    }

    .dark-preview .preview-line {
      background: #424242;
    }

    .dark-preview {
      background: #1E1E1E;
    }

    /* Auto theme preview */
    .auto-preview {
      background: linear-gradient(45deg, #FFFFFF 50%, #1E1E1E 50%);
    }

    .auto-preview .preview-header {
      background: linear-gradient(45deg, #2196F3 50%, #64B5F6 50%);
    }

    .auto-preview .preview-line {
      background: linear-gradient(45deg, #E0E0E0 50%, #424242 50%);
    }

    .about-info {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .app-info h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: var(--mdc-theme-on-surface);
    }

    .version {
      font-size: 0.875rem;
      color: var(--mdc-theme-primary);
      font-weight: 600;
      margin: 0 0 12px 0;
    }

    .description {
      color: var(--mdc-theme-on-surface-variant);
      line-height: 1.6;
      margin: 0;
    }

    .tech-stack h4 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 12px 0;
      color: var(--mdc-theme-on-surface);
    }

    .tech-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tech-chip {
      background: var(--mdc-theme-primary-container);
      color: var(--mdc-theme-on-primary-container);
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .setting-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .setting-info {
        margin-right: 0;
      }

      .preview-cards {
        flex-direction: column;
      }

      .preview-card {
        margin-bottom: 32px;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule
  ]
})
export class SettingsComponent implements OnInit {
  labels = UI_LABELS;
  currentTheme: Theme = 'light';
  
  themeControl = new FormControl<Theme>('light');
  notificationsControl = new FormControl(true);
  autoSaveControl = new FormControl(true);
  animationsControl = new FormControl(true);

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeControl.setValue(this.currentTheme);
    
    // Subscribe to theme changes
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  onThemeChange(): void {
    const selectedTheme = this.themeControl.value;
    if (selectedTheme) {
      this.themeService.setTheme(selectedTheme);
    }
  }
}