import { Component, input, output } from '@angular/core';
import { ClickEffectDirective } from '../../../shared/directives/click-efect.directives';

@Component({
  selector: 'app-paginations',
  standalone: true,
  imports: [ClickEffectDirective],
  templateUrl: './paginations.component.html',
  styleUrl: './paginations.component.css'
})
export class PaginationsComponent {
  // ── Variables para las distintas funcionalidades ──

  currentPage = input.required<number>();
  totalPages  = input.required<number>();
  pageChange  = output<number>();

  // ── Metodo apra crear las paginas según los resultados, y si supera las 5 poner la 1º y la ultima y el resto entre medias ──
  get visiblePages(): (number | '...')[] {
    const total   = this.totalPages();
    const current = this.currentPage();

    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    let winStart = Math.max(2, current - 1);
    let winEnd   = Math.min(total - 1, winStart + 1);
    winStart     = Math.max(2, winEnd - 1);

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

  // ── Metodo para viajar entre las distintas páginas ──
  goTo(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }
}