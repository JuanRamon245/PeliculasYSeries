import { Component, inject, signal } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

import { GenerosService } from './../../../../core/services/generos/generos-firebase.service';
import { ModalService }   from '../../../../core/services/ModalService/modal-service.service';
import { UsuariosService } from '../../../../core/services/usuarios/usuarios-firebase.service';
import { ClickEffectDirective } from '../../../shared/directives/click-efect.directives';

@Component({
  selector: 'app-show-genders',
  standalone: true,
  imports: [MatDialogModule, ClickEffectDirective],
  templateUrl: './show-genders.component.html',
  styleUrl: './show-genders.component.css'
})
export class ShowGendersComponent {
  
  // ── Servicios para las distintas funcionalidades ──
  
  private dialogRef     = inject(MatDialogRef<ShowGendersComponent>);
  generosService        = inject(GenerosService);
  private modalService  = inject(ModalService);
  usuariosService        = inject(UsuariosService);

  selectedGenero = signal<string>('');

  // ── Comprobar si el género existe ──

  private generoSiqueExiste(): boolean {
    return this.generosService.genres().some(g => g.nombre === this.selectedGenero());
  }

  // ── Eventos de seleccionar un genero ──

  select(nombre: string): void {
    this.selectedGenero.set(this.selectedGenero() === nombre ? '' : nombre);
  }

  isSelected(nombre: string): boolean {
    return this.selectedGenero() === nombre;
  }

  // ── Eventos del modal ──

  crear(): void {
    this.modalService.openCreateUpdateGender(null);
  }

  actualizar(): void {
    if (!this.selectedGenero()) {
      this.modalService.openErrorSuccess({
        success: false,
        message: 'Selecciona primero un género para editar.',
      });
      return;
    }

    if (!this.generoSiqueExiste()) {
      this.selectedGenero.set('');
      this.modalService.openErrorSuccess({ success: false, message: 'El género ya no existe, elige otro genero.' });
      return;
    }

    this.modalService.openCreateUpdateGender(this.selectedGenero());
  }

  eliminar(): void {
    if (!this.selectedGenero()) {
      this.modalService.openErrorSuccess({
        success: false,
        message: 'Selecciona primero un género para eliminar.',
      });
      return;
    }

    if (!this.generoSiqueExiste()) {
      this.selectedGenero.set('');
      this.modalService.openErrorSuccess({ success: false, message: 'El género ya no existe, elige otro genero.' });
      return;
    }

    const ref = this.modalService.openDelete({
      tipo:   'genero',
      nombre: this.selectedGenero(),
    });

    ref.afterClosed().subscribe((deleted: boolean) => {
      if (deleted) this.selectedGenero.set('');
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}