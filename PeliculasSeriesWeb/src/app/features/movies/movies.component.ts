import {
  Component, inject, signal, computed, effect, HostListener
} from '@angular/core';

import { PeliculasSeriesService } from './../../core/services/peliculasSeries/pelicula-serie-firebase.service';
import { FilterState, DEFAULT_FILTERS, Movie } from '../../core/models/Movie.model';

import { HeaderComponent }               from './components/header/header.component';
import { MenuFiltersComponent }          from './components/menu-filters/menu-filters.component';
import { SeriesPeliculasCardsComponent } from './components/series-peliculas-cards/series-peliculas-cards.component';
import { PaginationsComponent }          from './components/paginations/paginations.component';

// ── Lógica de paginación responsive ──────────────────────────
type Breakpoint = 'desktop' | 'tablet' | 'mobile';

const PAGE_SIZES: Record<Breakpoint, number> = {
  desktop: 30,
  tablet:  15,
  mobile:  10,
};

function getBreakpoint(w: number): Breakpoint {
  if (w >= 1024) return 'desktop';
  if (w >= 768)  return 'tablet';
  return 'mobile';
}

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [
    HeaderComponent,
    MenuFiltersComponent,
    SeriesPeliculasCardsComponent,
    PaginationsComponent,
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css'
})
export class MoviesComponent {
  pelisService = inject(PeliculasSeriesService);

  // ── Estado de la página ───────────────────────────────────────
  currentPage   = signal(1);
  searchQuery   = signal('');
  activeFilters = signal<FilterState>({ ...DEFAULT_FILTERS });
  breakpoint    = signal<Breakpoint>(getBreakpoint(window.innerWidth));

  // ── Derivados con computed ────────────────────────────────────

  /** Tamaño de página según el dispositivo */
  pageSize = computed(() => PAGE_SIZES[this.breakpoint()]);

  /**
   * Aplica búsqueda + filtros sobre el array que ya viene de Firestore.
   * La búsqueda por texto se maneja por separado (viene del header)
   * y se combina aquí con el FilterState del menú lateral.
   */
  filteredMovies = computed(() => {
    const filtersWithSearch: FilterState = {
      ...this.activeFilters(),
      search: this.searchQuery(),
    };
    return this.pelisService.applyFilters(
      this.pelisService.movies(),
      filtersWithSearch,
    );
  });

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredMovies().length / this.pageSize())),
  );

  /** Página actual recortada para evitar páginas vacías */
  pagedMovies = computed(() => {
    const page  = Math.min(this.currentPage(), this.totalPages());
    const size  = this.pageSize();
    const start = (page - 1) * size;
    return this.filteredMovies().slice(start, start + size);
  });

  constructor() {
    // Volver a la página 1 cada vez que cambian los datos filtrados
    effect(() => {
      this.filteredMovies();      // traquear la dependencia
      this.currentPage.set(1);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(e: Event): void {
    this.breakpoint.set(getBreakpoint((e.target as Window).innerWidth));
  }

  // ── Handlers de eventos hijo ──────────────────────────────────

  /** Recibe el texto del buscador (header) */
  onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  /** Recibe el FilterState del panel de filtros */
  onFiltersApplied(filters: FilterState): void {
    this.activeFilters.set(filters);
  }

  /** Navega a la página indicada */
  onPageChange(page: number): void {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  trackByNombre(_: number, m: Movie): string {
    return m.nombre;
  }
}