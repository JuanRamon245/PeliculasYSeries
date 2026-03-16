import { Component, inject, signal, output, OnInit } from '@angular/core';

import { GenerosService } from './../../../../core/services/generos/generos-firebase.service';
import { FormsModule } from '@angular/forms';
import {
  FilterState, DEFAULT_FILTERS, Animacion, Formato, Estado, ESTADOS
} from '../../../../core/models/Movie.model';
import { ClickEffectDirective } from '../../../shared/directives/click-efect.directives';

@Component({
  selector: 'app-menu-filters',
  standalone: true,
  imports: [FormsModule, ClickEffectDirective],
  templateUrl: './menu-filters.component.html',
  styleUrl: './menu-filters.component.css',
})
export class MenuFiltersComponent implements OnInit {
  generosService = inject(GenerosService);

  /** Emite el FilterState al componente padre cuando el usuario pulsa "Buscar" */
  filtersApplied = output<FilterState>();

  // ── Estado local (pendiente de aplicar) ───────────────────────
  orden:     FilterState['orden'] = 'az';

  // Tipo: animación y formato se pueden combinar independientemente
  selectedAnimacion = signal<Set<Animacion>>(new Set(['Anime', 'Normal']));
  selectedFormato   = signal<Set<Formato>>(new Set(['Pelicula', 'Serie']));
  selectedGeneros   = signal<Set<string>>(new Set());   // vacío = todos
  selectedEstados   = signal<Set<Estado>>(new Set(ESTADOS));

  ngOnInit(): void {
    // Emitir los filtros por defecto en cuanto se monta el componente
    this.aplicar();
  }

  // ── Toggles ───────────────────────────────────────────────────

  toggleAnimacion(value: Animacion): void {
    this.selectedAnimacion.update(s => {
      const next = new Set(s);
      // Al menos uno debe quedar activo
      if (next.has(value) && next.size > 1) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  toggleFormato(value: Formato): void {
    this.selectedFormato.update(s => {
      const next = new Set(s);
      if (next.has(value) && next.size > 1) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  toggleGenero(nombre: string): void {
    this.selectedGeneros.update(s => {
      const next = new Set(s);
      if (next.has(nombre)) next.delete(nombre);
      else next.add(nombre);
      return next;
    });
  }

  toggleEstado(estado: Estado): void {
    this.selectedEstados.update(s => {
      const next = new Set(s);
      if (next.has(estado) && next.size > 1) next.delete(estado);
      else next.add(estado);
      return next;
    });
  }

  // ── Helpers para la plantilla ─────────────────────────────────
  isAnimacionActive(v: Animacion): boolean { return this.selectedAnimacion().has(v); }
  isFormatoActive(v: Formato): boolean     { return this.selectedFormato().has(v); }
  isGeneroActive(v: string): boolean        { return this.selectedGeneros().size === 0 || this.selectedGeneros().has(v); }
  isEstadoActive(v: Estado): boolean        { return this.selectedEstados().has(v); }

  // ── Aplicar filtros ───────────────────────────────────────────

  // Sobreescribe aplicar para que cierre el panel al buscar
  aplicar(): void {
      const anim = [...this.selectedAnimacion()];
      const fmt  = [...this.selectedFormato()];

      const filters: FilterState = {
          search:    '',
          orden:     this.orden,
          animacion: anim.length === 2 ? 'Todas' : (anim[0] ?? 'Todas'),
          formato:   fmt.length  === 2 ? 'Todas' : (fmt[0]  ?? 'Todas'),
          generos:   [...this.selectedGeneros()],
          estados:   [...this.selectedEstados()],
      };

      this.filtersApplied.emit(filters);
      this.abierto.set(false); // ← cierra al pulsar Buscar
  }

  abierto = signal(false);

  toggleMenu(): void {
      this.abierto.update(v => !v);
  }
}