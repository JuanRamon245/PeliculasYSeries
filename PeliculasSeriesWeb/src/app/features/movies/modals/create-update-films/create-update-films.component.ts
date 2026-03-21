import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule }  from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { PeliculasSeriesService } from './../../../../core/services/peliculasSeries/pelicula-serie-firebase.service';
import { GenerosService } from './../../../../core/services/generos/generos-firebase.service';
import { ModalService, FilmModalData } from './../../../../core/services/ModalService/modal-service.service';
import {
  Movie, Animacion, Formato, Estado, ESTADOS
} from '../../../../core/models/Movie.model';
import { ClickEffectDirective } from '../../../shared/directives/click-efect.directives';

@Component({
  selector: 'app-create-update-films',
  standalone: true,
  imports: [FormsModule, MatDialogModule, ClickEffectDirective],
  templateUrl: './create-update-films.component.html',
  styleUrl: './create-update-films.component.css'
})
export class CreateUpdateFilmsComponent implements OnInit {

  // ── Servicios para las distintas funcionalidades ──

  private dialogRef = inject(MatDialogRef<CreateUpdateFilmsComponent>);
  data: FilmModalData = inject(MAT_DIALOG_DATA);
  private pelisService = inject(PeliculasSeriesService);
  generosService = inject(GenerosService);
  private modalService = inject(ModalService);

  // ── Campos del formulario ──

  nombre = '';
  formato: Animacion = 'Normal';
  categoria: Formato = 'Pelicula';
  maximo = '';
  minimo = '';
  genero = '';
  estado: Estado = 'No visto';

  readonly estadosDisponibles = ESTADOS

  loading = signal(false);

  // ── Saber que acción vamos a realizar ──

  get isEdit(): boolean  { return this.data.movie !== null; }
  get titulo(): string   { return this.isEdit ? 'Editar Titulo' : 'Crear Titulo'; }
  get btnLabel(): string { return this.isEdit ? 'Actualizar' : 'Crear'; }

  get maximoPlaceholder(): string {
    return this.categoria === 'Serie' ? 'Ej: 4T x 25C (temporadas x caps)' : 'Ej: 148 (minutos)';
  }
  get minimoPlaceholder(): string {
    return this.categoria === 'Serie' ? 'Ej: 2T x 10C (progreso actual)' : 'Ej: 90 (minutos vistos)';
  }

  ngOnInit(): void {
    if (this.data.movie) {
      const m = this.data.movie;
      this.nombre = m.nombre;
      this.formato = m.tipo[0];
      this.categoria = m.tipo[1];
      this.maximo = m.maximo;
      this.minimo = m.minimo;
      this.genero = m.genero;
      this.estado = m.estado;
    } else {
      const nombres = this.generosService.genreNames();
      if (nombres.length) this.genero = nombres[0];
    }
  }

  // ── Validaciones ──

  private validar(): string | null {
    if (!this.nombre.trim())  return 'El nombre es obligatorio.';
    if (!this.genero)         return 'Selecciona un género.';
    return null;
  }

  // ── Eventos del modal ──

  async guardar(): Promise<void> {
    const error = this.validar();
    if (error) {
      this.modalService.openErrorSuccess({ success: false, message: error });
      return;
    }

    if (this.loading()) return;
    this.loading.set(true);

    const movieData: Omit<Movie, 'fecha'> = {
      nombre:  this.nombre.trim(),
      tipo:    [this.formato, this.categoria],
      genero:  this.genero,
      estado:  this.estado,
      maximo:  this.maximo.trim(),
      minimo:  this.minimo.trim(),
    };

    const res = this.isEdit
      ? await this.pelisService.update(this.data.movie!.nombre, movieData)
      : await this.pelisService.create(movieData);

    this.loading.set(false);

    this.modalService.openErrorSuccess({ success: res.success, message: res.message });

    if (res.success) this.dialogRef.close(true);
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }
}