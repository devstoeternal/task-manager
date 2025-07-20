import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { UI_LABELS } from '../../../shared/constants/ui-labels.constants';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container-responsive py-6">
      
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{labels.SETTINGS}}</h1>
        <p class="text-gray-600">Personaliza tu experiencia en el sistema de gestión de tareas</p>
      </div>

      <!-- Settings Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- General Settings -->
        <mat-card class="p-6 shadow-lg">
          <div class="flex items-center mb-6">
            <mat-icon class="text-primary-500 mr-3">settings</mat-icon>
            <h2 class="text-xl font-semibold text-gray-900">Configuración General</h2>
          </div>

          <form [formGroup]="settingsForm" class="space-y-6">
            
            <!-- Theme Selection -->
            <div class="space-y-3">
              <label class="text-sm font-medium text-gray-700">Tema de la aplicación</label>
              <mat-form-field appearance="outline" class="w-full">
                <mat-select formControlName="theme">
                  <mat-option value="light">
                    <div class="flex items-center">
                      <mat-icon class="mr-2">light_mode</mat-icon>
                      Claro
                    </div>
                  </mat-option>
                  <mat-option value="dark">
                    <div class="flex items-center">
                      <mat-icon class="mr-2">dark_mode</mat-icon>
                      Oscuro
                    </div>
                  </mat-option>
                  <mat-option value="auto">
                    <div class="flex items-center">
                      <mat-icon class="mr-2">brightness_auto</mat-icon>
                      Automático
                    </div>
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <!-- Language Selection -->
            <div class="space-y-3">
              <label class="text-sm font-medium text-gray-700">Idioma</label>
              <mat-form-field appearance="outline" class="w-full">
                <mat-select formControlName="language">
                  <mat-option value="es">
                    <div class="flex items-center">
                      <span class="mr-2">🇪🇸</span>
                      Español
                    </div>
                  </mat-option>
                  <mat-option value="en" disabled>
                    <div class="flex items-center">
                      <span class="mr-2">🇺🇸</span>
                      Inglés (Próximamente)
                    </div>
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <!-- Default Task View -->
            <div class="space-y-3">
              <label class="text-sm font-medium text-gray-700">Vista predeterminada de tareas</label>
              <mat-form-field appearance="outline" class="w-full">
                <mat-select formControlName="defaultTaskView">
                  <mat-option value="list">
                    <div class="flex items-center">
                      <mat-icon class="mr-2">list</mat-icon>
                      Lista
                    </div>
                  </mat-option>
                  <mat-option value="grid">
                    <div class="flex items-center">
                      <mat-icon class="mr-2">grid_view</mat-icon>
                      Cuadrícula
                    </div>
                  </mat-option>
                  <mat-option value="kanban">
                    <div class="flex items-center">
                      <mat-icon class="mr-2">view_kanban</mat-icon>
                      Kanban
                    </div>
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <!-- Tasks per Page -->
            <div class="space-y-3">
              <label class="text-sm font-medium text-gray-700">Tareas por página</label>
              <mat-form-field appearance="outline" class="w-full">
                <mat-select formControlName="tasksPerPage">
                  <mat-option [value]="10">10 tareas</mat-option>
                  <mat-option [value]="20">20 tareas</mat-option>
                  <mat-option [value]="50">50 tareas</mat-option>
                  <mat-option [value]="100">100 tareas</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </form>
        </mat-card>

        <!-- Notifications Settings -->
        <mat-card class="p-6 shadow-lg">
          <div class="flex items-center mb-6">
            <mat-icon class="text-orange-500 mr-3">notifications</mat-icon>
            <h2 class="text-xl font-semibold text-gray-900">Notificaciones</h2>
          </div>

          <form [formGroup]="notificationsForm" class="space-y-6">
            
            <!-- Email Notifications -->
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-900">Notificaciones por email</h3>
                <p class="text-sm text-gray-600">Recibe notificaciones importantes por correo electrónico</p>
              </div>
              <mat-slide-toggle formControlName="emailNotifications" color="primary"></mat-slide-toggle>
            </div>

            <mat-divider></mat-divider>

            <!-- Task Reminders -->
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-900">Recordatorios de tareas</h3>
                <p class="text-sm text-gray-600">Notificaciones cuando una tarea está próxima a vencer</p>
              </div>
              <mat-slide-toggle formControlName="taskReminders" color="primary"></mat-slide-toggle>
            </div>

            <mat-divider></mat-divider>

            <!-- Completion Notifications -->
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-900">Notificaciones de finalización</h3>
                <p class="text-sm text-gray-600">Confirmaciones cuando completes una tarea</p>
              </div>
              <mat-slide-toggle formControlName="completionNotifications" color="primary"></mat-slide-toggle>
            </div>

            <mat-divider></mat-divider>

            <!-- Weekly Summary -->
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-900">Resumen semanal</h3>
                <p class="text-sm text-gray-600">Recibe un resumen de tu productividad cada semana</p>
              </div>
              <mat-slide-toggle formControlName="weeklySummary" color="primary"></mat-slide-toggle>
            </div>

          </form>
        </mat-card>

        <!-- Privacy & Security -->
        <mat-card class="p-6 shadow-lg">
          <div class="flex items-center mb-6">
            <mat-icon class="text-red-500 mr-3">security</mat-icon>
            <h2 class="text-xl font-semibold text-gray-900">Privacidad y Seguridad</h2>
          </div>

          <div class="space-y-6">
            
            <!-- Auto Logout -->
            <div class="space-y-3">
              <label class="text-sm font-medium text-gray-700">Cerrar sesión automáticamente</label>
              <mat-form-field appearance="outline" class="w-full">
                <mat-select formControlName="autoLogout">
                  <mat-option [value]="0">Nunca</mat-option>
                  <mat-option [value]="15">15 minutos</mat-option>
                  <mat-option [value]="30">30 minutos</mat-option>
                  <mat-option [value]="60">1 hora</mat-option>
                  <mat-option [value]="120">2 horas</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <!-- Privacy Options -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="text-sm font-medium text-gray-900">Permitir análisis de uso</h3>
                  <p class="text-sm text-gray-600">Ayúdanos a mejorar la aplicación compartiendo datos de uso anónimos</p>
                </div>
                <mat-slide-toggle formControlName="allowAnalytics" color="primary"></mat-slide-toggle>
              </div>

              <mat-divider></mat-divider>

              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="text-sm font-medium text-gray-900">Recordar sesión</h3>
                  <p class="text-sm text-gray-600">Mantener la sesión iniciada en este dispositivo</p>
                </div>
                <mat-slide-toggle formControlName="rememberSession" color="primary"></mat-slide-toggle>
              </div>
            </div>

          </div>
        </mat-card>

        <!-- Data Management -->
        <mat-card class="p-6 shadow-lg">
          <div class="flex items-center mb-6">
            <mat-icon class="text-purple-500 mr-3">storage</mat-icon>
            <h2 class="text-xl font-semibold text-gray-900">Gestión de Datos</h2>
          </div>

          <div class="space-y-6">
            
            <!-- Export Data -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-gray-700">Exportar mis datos</h3>
              <p class="text-sm text-gray-600">Descarga una copia de todos tus datos en formato JSON</p>
              <button 
                mat-stroked-button 
                color="primary"
                (click)="exportUserData()"
                [disabled]="isExporting">
                <mat-icon class="mr-2">download</mat-icon>
                {{isExporting ? 'Exportando...' : 'Exportar Datos'}}
              </button>
            </div>

            <mat-divider></mat-divider>

            <!-- Clear Cache -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-gray-700">Limpiar caché local</h3>
              <p class="text-sm text-gray-600">Elimina los datos almacenados localmente para liberar espacio</p>
              <button 
                mat-stroked-button 
                color="accent"
                (click)="clearCache()">
                <mat-icon class="mr-2">clear_all</mat-icon>
                Limpiar Caché
              </button>
            </div>

            <mat-divider></mat-divider>

            <!-- Delete Account -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-red-700">Eliminar cuenta</h3>
              <p class="text-sm text-gray-600">Elimina permanentemente tu cuenta y todos los datos asociados</p>
              <button 
                mat-stroked-button 
                color="warn"
                (click)="confirmDeleteAccount()"
                class="text-red-600 border-red-300 hover:bg-red-50">
                <mat-icon class="mr-2">delete_forever</mat-icon>
                Eliminar Cuenta
              </button>
            </div>

          </div>
        </mat-card>

      </div>

      <!-- Save Settings Button -->
      <div class="mt-8 flex justify-end">
        <div class="space-x-4">
          <button 
            mat-stroked-button 
            (click)="resetSettings()">
            Restablecer
          </button>
          
          <button 
            mat-raised-button 
            color="primary"
            (click)="saveSettings()"
            [disabled]="isSaving">
            <mat-icon class="mr-2" *ngIf="!isSaving">save</mat-icon>
            <mat-spinner diameter="16" class="mr-2" *ngIf="isSaving"></mat-spinner>
            {{isSaving ? 'Guardando...' : 'Guardar Configuración'}}
          </button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .container-responsive {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .mat-mdc-card {
      border-radius: 12px;
    }

    .text-primary-500 {
      color: #2196F3;
    }

    .text-orange-500 {
      color: #FF9800;
    }

    .text-red-500 {
      color: #F44336;
    }

    .text-purple-500 {
      color: #9C27B0;
    }

    @media (max-width: 640px) {
      .container-responsive {
        padding: 0 0.75rem;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  labels = UI_LABELS;
  
  settingsForm: FormGroup;
  notificationsForm: FormGroup;
  
  isSaving = false;
  isExporting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.settingsForm = this.createSettingsForm();
    this.notificationsForm = this.createNotificationsForm();
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  private createSettingsForm(): FormGroup {
    return this.fb.group({
      theme: ['light'],
      language: ['es'],
      defaultTaskView: ['list'],
      tasksPerPage: [20],
      autoLogout: [30],
      allowAnalytics: [true],
      rememberSession: [true]
    });
  }

  private createNotificationsForm(): FormGroup {
    return this.fb.group({
      emailNotifications: [true],
      taskReminders: [true],
      completionNotifications: [false],
      weeklySummary: [true]
    });
  }

  private loadSettings(): void {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        this.settingsForm.patchValue(settings.general || {});
        this.notificationsForm.patchValue(settings.notifications || {});
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }

  saveSettings(): void {
    this.isSaving = true;

    const settings = {
      general: this.settingsForm.value,
      notifications: this.notificationsForm.value,
      lastUpdated: new Date().toISOString()
    };

    // Save to localStorage (in a real app, this would be sent to the API)
    localStorage.setItem('userSettings', JSON.stringify(settings));

    // Simulate API call
    setTimeout(() => {
      this.isSaving = false;
      this.snackBar.open('Configuración guardada exitosamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }, 1000);
  }

  resetSettings(): void {
    // Reset to default values
    this.settingsForm.reset({
      theme: 'light',
      language: 'es',
      defaultTaskView: 'list',
      tasksPerPage: 20,
      autoLogout: 30,
      allowAnalytics: true,
      rememberSession: true
    });

    this.notificationsForm.reset({
      emailNotifications: true,
      taskReminders: true,
      completionNotifications: false,
      weeklySummary: true
    });

    this.snackBar.open('Configuración restablecida a valores predeterminados', 'Cerrar', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }

  exportUserData(): void {
    this.isExporting = true;

    // Simulate data export
    setTimeout(() => {
      const userData = {
        profile: this.authService.getCurrentUser(),
        settings: {
          general: this.settingsForm.value,
          notifications: this.notificationsForm.value
        },
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `task-manager-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      this.isExporting = false;
      this.snackBar.open('Datos exportados exitosamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }, 2000);
  }

  clearCache(): void {
    // Clear application cache
    try {
      // Clear specific app data, but keep authentication
      const keysToKeep = ['auth_token', 'refresh_token', 'current_user'];
      const allKeys = Object.keys(localStorage);
      
      allKeys.forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });

      this.snackBar.open('Caché local limpiado exitosamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
      this.snackBar.open('Error al limpiar el caché', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  confirmDeleteAccount(): void {
    const confirmed = confirm(
      '⚠️ ADVERTENCIA: Esta acción eliminará permanentemente tu cuenta y todos los datos asociados.\n\n' +
      'Esta acción NO se puede deshacer.\n\n' +
      '¿Estás completamente seguro de que deseas continuar?'
    );

    if (confirmed) {
      const doubleConfirm = confirm(
        'Por favor confirma una vez más:\n\n' +
        '✅ Entiendo que esta acción es irreversible\n' +
        '✅ Entiendo que perderé todas mis tareas y datos\n' +
        '✅ Deseo eliminar mi cuenta definitivamente\n\n' +
        '¿Proceder con la eliminación?'
      );

      if (doubleConfirm) {
        this.deleteAccount();
      }
    }
  }

  private deleteAccount(): void {
    // In a real application, this would call an API endpoint
    this.snackBar.open(
      'Función de eliminación de cuenta no implementada en esta demo. ' +
      'En una aplicación real, esto eliminaría la cuenta permanentemente.',
      'Cerrar',
      {
        duration: 5000,
        panelClass: ['info-snackbar']
      }
    );
  }
}