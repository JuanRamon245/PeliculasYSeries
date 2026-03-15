import { Component, inject, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { PeliculasSeriesService } from './../../../../core/services/peliculasSeries/pelicula-serie-firebase.service';
import { GenerosService } from './../../../../core/services/generos/generos-firebase.service';
import { ModalService, DeleteModalData } from '../../../../core/services/ModalService/modal-service.service';

@Component({
  selector: 'app-delete-films-genders',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './delete-films-genders.component.html',
  styleUrl: './delete-films-genders.component.css',
})
export class DeleteFilmsGendersComponent {
  private dialogRef        = inject(MatDialogRef<DeleteFilmsGendersComponent>);
  data: DeleteModalData    = inject(MAT_DIALOG_DATA);
  private pelisService     = inject(PeliculasSeriesService);
  private generosService   = inject(GenerosService);
  private modalService     = inject(ModalService);

  loading = signal(false);

  get titulo(): string {
    return this.data.tipo === 'pelicula' ? 'Eliminar Pelicula / Serie' : 'Eliminar Genero';
  }

  async eliminar(): Promise<void> {
    if (this.loading()) return;
    this.loading.set(true);

    const res = this.data.tipo === 'pelicula'
      ? await this.pelisService.delete(this.data.nombre)
      : await this.generosService.delete(this.data.nombre);

    this.loading.set(false);
    this.dialogRef.close(res.success);

    // Feedback al usuario
    this.modalService.openErrorSuccess({ success: res.success, message: res.message });
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }
}