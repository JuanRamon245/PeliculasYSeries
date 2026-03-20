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

  // ── Servicios para las distintas funcionalidades ──

  generosService = inject(GenerosService);

  // ── Emitir la busqueda en base a los filtros elegidos por el usuario ──
  filtersApplied = output<FilterState>();

  // ── Orden del filtro de busqueda ──
  orden:     FilterState['orden'] = 'az';

  // ── Metodos recoger los datos de cada filtro ──
  selectedAnimacion = signal<Set<Animacion>>(new Set(['Anime', 'Normal']));
  selectedFormato = signal<Set<Formato>>(new Set(['Pelicula', 'Serie']));
  selectedGeneros = signal<Set<string>>(new Set());
  selectedEstados = signal<Set<Estado>>(new Set(ESTADOS));

  ngOnInit(): void {
    this.aplicar();
  }

  // ── Metodo para realizar los distintos cambios en el componente al tocar el radiobutton ──

  toggleAnimacion(value: Animacion): void {
    this.selectedAnimacion.update(s => {
      const next = new Set(s);
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

  // ── Metodo para realizar los distintos cambios en el componente al seleccionar los generos ──

  toggleGenero(nombre: string): void {
    this.selectedGeneros.update(s => {
      const next = new Set(s);
      if (next.has(nombre)) next.delete(nombre);
      else next.add(nombre);
      return next;
    });
  }

  // ── Metodo para realizar los distintos cambios en el componente al variar entre el estado de visualización ──

  toggleEstado(estado: Estado): void {
    this.selectedEstados.update(s => {
      const next = new Set(s);
      if (next.has(estado) && next.size > 1) next.delete(estado);
      else next.add(estado);
      return next;
    });
  }

  // ── Metodo para realizar los distintos cambios en el componente para abrir el menú con los distintas funciones de la sección ──

  toggleMenu(): void {
    this.abierto.update(v => !v);
  }

  // ── Helpers para seleccionar la información en cada campo cuando se pulse ──

  isAnimacionActive(v: Animacion): boolean { return this.selectedAnimacion().has(v); }
  isFormatoActive(v: Formato): boolean     { return this.selectedFormato().has(v); }
  isGeneroActive(v: string): boolean        { return this.selectedGeneros().size === 0 || this.selectedGeneros().has(v); }
  isEstadoActive(v: Estado): boolean        { return this.selectedEstados().has(v); }

  // ── Sobreescribe aplicar para que cierre el panel al buscar ──

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
      this.abierto.set(false);
  }

  abierto = signal(false);
}