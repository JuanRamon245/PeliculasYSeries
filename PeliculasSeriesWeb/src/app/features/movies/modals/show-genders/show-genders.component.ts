import { Component, inject, signal } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

import { GenerosService } from './../../../../core/services/generos/generos-firebase.service';
import { ModalService }   from '../../../../core/services/ModalService/modal-service.service';
import { UsuariosService } from '../../../../core/services/usuarios/usuarios-firebase.service';

@Component({
  selector: 'app-show-genders',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './show-genders.component.html',
  styleUrl: './show-genders.component.css'
})
export class ShowGendersComponent {
  private dialogRef     = inject(MatDialogRef<ShowGendersComponent>);
  generosService        = inject(GenerosService);
  private modalService  = inject(ModalService);
  usuariosService        = inject(UsuariosService);

  // Género seleccionado en el panel (radio button)
  selectedGenero = signal<string>('');

  private generoSiqueExiste(): boolean {
    return this.generosService.genres().some(g => g.nombre === this.selectedGenero());
  }

  select(nombre: string): void {
    // Permitir deseleccionar clickando el mismo
    this.selectedGenero.set(this.selectedGenero() === nombre ? '' : nombre);
  }

  isSelected(nombre: string): boolean {
    return this.selectedGenero() === nombre;
  }

  // ── Acciones del footer ───────────────────────────────────────

  /** Abre el modal de creación de género */
  crear(): void {
    // No cerramos este modal — el usuario puede seguir añadiendo géneros
    this.modalService.openCreateUpdateGender(null);
  }

  /** Abre el modal de edición con el género seleccionado precargado */
  actualizar(): void {
    if (!this.selectedGenero()) {
      this.modalService.openErrorSuccess({
        success: false,
        message: 'Selecciona primero un género para editar.',
      });
      return;
    }

    if (!this.generoSiqueExiste()) {
      this.selectedGenero.set('');  // limpiamos el estado huérfano
      this.modalService.openErrorSuccess({ success: false, message: 'El género ya no existe, elige otro genero.' });
      return;
    }

    this.modalService.openCreateUpdateGender(this.selectedGenero());
  }

  /** Abre la confirmación de borrado para el género seleccionado */
  eliminar(): void {
    if (!this.selectedGenero()) {
      this.modalService.openErrorSuccess({
        success: false,
        message: 'Selecciona primero un género para eliminar.',
      });
      return;
    }

    if (!this.generoSiqueExiste()) {
      this.selectedGenero.set('');  // limpiamos el estado huérfano
      this.modalService.openErrorSuccess({ success: false, message: 'El género ya no existe, elige otro genero.' });
      return;
    }

    const ref = this.modalService.openDelete({
      tipo:   'genero',
      nombre: this.selectedGenero(),
    });

    // Si se confirmó el borrado, deseleccionamos
    ref.afterClosed().subscribe((deleted: boolean) => {
      if (deleted) this.selectedGenero.set('');
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}