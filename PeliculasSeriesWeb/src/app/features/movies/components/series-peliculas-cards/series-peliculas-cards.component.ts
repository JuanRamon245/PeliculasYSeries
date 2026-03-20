import { Component, input, inject } from '@angular/core';

import { Movie } from '../../../../core/models/Movie.model';
import { ModalService }    from '../../../../core/services/ModalService/modal-service.service';
import { UsuariosService } from './../../../../core/services/usuarios/usuarios-firebase.service';
import { ClickEffectDirective } from '../../../shared/directives/click-efect.directives';

@Component({
  selector: 'app-series-peliculas-cards',
  standalone: true,
  imports: [ClickEffectDirective],
  templateUrl: './series-peliculas-cards.component.html',
  styleUrl: './series-peliculas-cards.component.css'
})
export class SeriesPeliculasCardsComponent {
  // ── Variables para las distintas funcionalidades ──
  movie = input.required<Movie>();

  private modalService   = inject(ModalService);
  usuariosService        = inject(UsuariosService);

  // ── Helpers para transformar las fechas y el titulo

  get tipoTexto(): string {
    return `${this.movie().tipo[1]} / ${this.movie().tipo[0]}`;
  }

  get fechaFormateada(): string {
    return new Date(this.movie().fecha).toLocaleDateString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  }

  // ── Metodo para paginar el resultado de cuanto se ha visto de esa serie o pelicula ──

  get vistoTexto(): string {
    const m = this.movie();
    if (!m.minimo && !m.maximo) return '—';
    if (m.minimo && m.maximo)   return `${m.minimo} de ${m.maximo}`;
    return m.maximo || m.minimo;
  }

  // ── Metodos para abrir los modales de editar y eliminar ──

  editar(): void {
    this.modalService.openCreateUpdateFilm(this.movie());
  }

  eliminar(): void {
    this.modalService.openDelete({
      tipo:   'pelicula',
      nombre: this.movie().nombre,
    });
  }
}