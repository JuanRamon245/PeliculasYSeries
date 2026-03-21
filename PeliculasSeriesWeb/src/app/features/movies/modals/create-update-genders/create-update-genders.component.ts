import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { GenerosService } from './../../../../core/services/generos/generos-firebase.service';
import { ModalService, GenderModalData } from '../../../../core/services/ModalService/modal-service.service';
import { ClickEffectDirective } from '../../../shared/directives/click-efect.directives';

@Component({
  selector: 'app-create-update-genders',
  standalone: true,
  imports: [FormsModule, MatDialogModule, ClickEffectDirective],
  templateUrl: './create-update-genders.component.html',
  styleUrl: './create-update-genders.component.css',
})
export class CreateUpdateGendersComponent implements OnInit {

  // ── Servicios para las distintas funcionalidades ──

  private dialogRef      = inject(MatDialogRef<CreateUpdateGendersComponent>);
  data: GenderModalData  = inject(MAT_DIALOG_DATA);
  private generosService = inject(GenerosService);
  private modalService   = inject(ModalService);

  nombre  = '';
  loading = signal(false);

  // ── tener datso qde que acción vamos a realizar ──

  get isEdit(): boolean { return this.data.genero !== null; }
  get titulo(): string  { return this.isEdit ? 'Editar Genero' : 'Crear Genero'; }
  get btnLabel(): string { return this.isEdit ? 'Actualizar' : 'Crear'; }

  ngOnInit(): void {
    if (this.data.genero) this.nombre = this.data.genero;
  }

  // ── Eventos del modal ──

  async guardar(): Promise<void> {
    if (this.loading() || !this.nombre.trim()) return;
    this.loading.set(true);

    const res = this.isEdit
      ? await this.generosService.update(this.data.genero!, this.nombre)
      : await this.generosService.create(this.nombre);

    this.loading.set(false);

    this.modalService.openErrorSuccess({ success: res.success, message: res.message });

    if (res.success) this.dialogRef.close(true);
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }
}