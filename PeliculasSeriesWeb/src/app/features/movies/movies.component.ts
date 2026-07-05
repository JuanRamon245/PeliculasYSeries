import {
  Component, inject, signal, computed, effect, HostListener
} from '@angular/core';

import { PeliculasSeriesService } from './../../core/services/peliculasSeries/pelicula-serie-firebase.service';
import { FilterState, DEFAULT_FILTERS, Movie } from '../../core/models/Movie.model';

import { HeaderComponent }               from './components/header/header.component';
import { MenuFiltersComponent }          from './components/menu-filters/menu-filters.component';
import { SeriesPeliculasCardsComponent } from './components/series-peliculas-cards/series-peliculas-cards.component';
import { PaginationsComponent }          from './components/paginations/paginations.component';
import { FormsModule } from '@angular/forms';

// ── Lógica de paginación responsive ──────────────────────────
type Breakpoint = 'desktop' | 'tablet' | 'mobile';

const PAGE_SIZES: Record<Breakpoint, number> = {
  desktop: 30,
  tablet:  16,
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
    FormsModule,
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css'
})
export class MoviesComponent {
  pelisService = inject(PeliculasSeriesService);

  // ── Estado de la página ──
  currentPage   = signal(1);
  searchQuery   = signal('');
  activeFilters = signal<FilterState>({ ...DEFAULT_FILTERS });
  breakpoint    = signal<Breakpoint>(getBreakpoint(window.innerWidth));

  searchValue = '';
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  pageSize = computed(() => PAGE_SIZES[this.breakpoint()]);

  // ── Metodo para aplicar los filtros a las series y peliculas obtenidas de firebase ──
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

  // ── Recortar la paginas para obtener el numero limitado de objjetos en ellas ──
  pagedMovies = computed(() => {
    const page  = Math.min(this.currentPage(), this.totalPages());
    const size  = this.pageSize();
    const start = (page - 1) * size;
    return this.filteredMovies().slice(start, start + size);
  });

  constructor() {
    effect(() => {
      this.filteredMovies();
      this.currentPage.set(1);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(e: Event): void {
    this.breakpoint.set(getBreakpoint((e.target as Window).innerWidth));
  }

  // ── Manjejadores de los eventos de los hijos ──

  limpiarBusqueda(): void {
    this.searchValue = '';
    this.searchQuery.set('');
  }

  onSearch(value: string): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.searchQuery.set(value);
    }, 280);
  }

  onFiltersApplied(filters: FilterState): void {
    this.activeFilters.set(filters);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  trackByNombre(_: number, m: Movie): string {
    return m.nombre;
  }

  ngOnDestroy(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  }
}