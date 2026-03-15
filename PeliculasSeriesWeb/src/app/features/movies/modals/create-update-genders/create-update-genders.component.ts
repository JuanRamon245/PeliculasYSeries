import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { GenerosService } from './../../../../core/services/generos/generos-firebase.service';
import { ModalService, GenderModalData } from '../../../../core/services/ModalService/modal-service.service';

@Component({
  selector: 'app-create-update-genders',
  standalone: true,
  imports: [FormsModule, MatDialogModule],
  templateUrl: './create-update-genders.component.html',
  styleUrl: './create-update-genders.component.css',
})
export class CreateUpdateGendersComponent implements OnInit {
  private dialogRef      = inject(MatDialogRef<CreateUpdateGendersComponent>);
  data: GenderModalData  = inject(MAT_DIALOG_DATA);
  private generosService = inject(GenerosService);
  private modalService   = inject(ModalService);

  // ── Estado ────────────────────────────────────────────────────
  nombre  = '';
  loading = signal(false);

  get isEdit(): boolean { return this.data.genero !== null; }
  get titulo(): string  { return this.isEdit ? 'Editar Genero' : 'Crear Genero'; }
  get btnLabel(): string { return this.isEdit ? 'Actualizar' : 'Crear'; }

  ngOnInit(): void {
    // Si estamos editando, precargamos el nombre actual
    if (this.data.genero) this.nombre = this.data.genero;
  }

  // ── Acción ────────────────────────────────────────────────────

  async guardar(): Promise<void> {
    if (this.loading() || !this.nombre.trim()) return;
    this.loading.set(true);

    const res = this.isEdit
      ? await this.generosService.update(this.data.genero!, this.nombre)
      : await this.generosService.create(this.nombre);

    this.loading.set(false);

    // Siempre mostramos feedback
    this.modalService.openErrorSuccess({ success: res.success, message: res.message });

    // Solo cerramos si la operación fue exitosa
    if (res.success) this.dialogRef.close(true);
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }
}