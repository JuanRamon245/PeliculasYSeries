import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-paginations',
  standalone: true,
  imports: [],
  templateUrl: './paginations.component.html',
  styleUrl: './paginations.component.css'
})
export class PaginationsComponent {
  /** Página actualmente activa (1-based) */
  currentPage = input.required<number>();

  /** Número total de páginas */
  totalPages  = input.required<number>();

  /** Emite el número de página al que el usuario quiere ir */
  pageChange  = output<number>();

  get pages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  goTo(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }
}