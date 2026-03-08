import { Component, input, inject } from '@angular/core';

import { Movie } from '../../../../core/models/Movie.model';
import { ModalService }    from '../../../../core/services/ModalService/modal-service.service';
import { UsuariosService } from './../../../../core/services/usuarios/usuarios-firebase.service';

@Component({
  selector: 'app-series-peliculas-cards',
  standalone: true,
  imports: [],
  templateUrl: './series-peliculas-cards.component.html',
  styleUrl: './series-peliculas-cards.component.css'
})
export class SeriesPeliculasCardsComponent {
  /** La película o serie que representa esta tarjeta */
  movie = input.required<Movie>();

  private modalService   = inject(ModalService);
  usuariosService        = inject(UsuariosService);

  // ── Helpers de presentación ───────────────────────────────────

  get tipoTexto(): string {
    return `${this.movie().tipo[1]} / ${this.movie().tipo[0]}`;
  }

  get fechaFormateada(): string {
    return new Date(this.movie().fecha).toLocaleDateString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  }

  get vistoTexto(): string {
    const m = this.movie();
    if (!m.minimo && !m.maximo) return '—';
    if (m.minimo && m.maximo)   return `${m.minimo} de ${m.maximo}`;
    return m.maximo || m.minimo;
  }

  // ── Acciones ──────────────────────────────────────────────────

  /** Abre el modal de edición con los datos de esta tarjeta precargados */
  editar(): void {
    this.modalService.openCreateUpdateFilm(this.movie());
  }

  /** Abre la confirmación de borrado */
  eliminar(): void {
    this.modalService.openDelete({
      tipo:   'pelicula',
      nombre: this.movie().nombre,
    });
  }
}