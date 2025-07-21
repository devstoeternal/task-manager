import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmationModalComponent, ConfirmationData } from '../components/confirmation-modal/confirmation-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  constructor(private dialog: MatDialog) {}

  confirm(data: ConfirmationData): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data,
      disableClose: true,
      panelClass: ['confirmation-dialog'],
      backdropClass: 'confirmation-backdrop'
    });

    return dialogRef.afterClosed();
  }

  confirmDelete(itemName: string = 'este elemento'): Observable<boolean> {
    return this.confirm({
      title: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar ${itemName}? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger',
      icon: 'delete'
    });
  }

  confirmSave(message: string = '¿Deseas guardar los cambios?'): Observable<boolean> {
    return this.confirm({
      title: 'Guardar cambios',
      message,
      confirmText: 'Guardar',
      cancelText: 'Cancelar',
      type: 'info',
      icon: 'save'
    });
  }

  confirmLogout(): Observable<boolean> {
    return this.confirm({
      title: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      confirmText: 'Cerrar sesión',
      cancelText: 'Cancelar',
      type: 'warning',
      icon: 'logout'
    });
  }
}