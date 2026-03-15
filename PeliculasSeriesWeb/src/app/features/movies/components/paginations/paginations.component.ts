import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-paginations',
  standalone: true,
  imports: [],
  templateUrl: './paginations.component.html',
  styleUrl: './paginations.component.css'
})
export class PaginationsComponent {
  currentPage = input.required<number>();
  totalPages  = input.required<number>();
  pageChange  = output<number>();

  /**
   * Devuelve máximo 4 números de página + separadores '...'
   *
   * Ejemplos con 34 páginas:
   *   current=1  → [1, 2, 3, ..., 34]
   *   current=5  → [1, ..., 4, 5, ..., 34]
   *   current=33 → [1, ..., 32, 33, 34]
   */
  get visiblePages(): (number | '...')[] {
    const total   = this.totalPages();
    const current = this.currentPage();

    // Si caben todas, las mostramos sin lógica especial
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Ventana de 2 páginas alrededor del current
    // (excluyendo siempre la 1 y la última, que se añaden aparte)
    let winStart = Math.max(2, current - 1);
    let winEnd   = Math.min(total - 1, winStart + 1);
    winStart     = Math.max(2, winEnd - 1); // reajuste si chocamos con el techo

    const result: (number | '...')[] = [1];

    if (winStart > 2)        result.push('...');
    for (let p = winStart; p <= winEnd; p++) result.push(p);
    if (winEnd < total - 1)  result.push('...');

    result.push(total);
    return result;
  }

  isNumber(p: number | '...'): p is number {
    return typeof p === 'number';
  }

  goTo(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }
}