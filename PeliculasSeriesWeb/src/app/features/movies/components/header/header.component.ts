import { Component, inject, output, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ModalService }    from '../../../../core/services/ModalService/modal-service.service';
import { UsuariosService } from '../../../../core/services/usuarios/usuarios-firebase.service';
import { ClickEffectDirective } from '../../../shared/directives/click-efect.directives';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, ClickEffectDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnDestroy {
  private modalService   = inject(ModalService);
  usuariosService        = inject(UsuariosService);  // público para usarlo en la plantilla

  /** Emite el texto de búsqueda al componente padre (movies.component) */
  searchChange = output<string>();

  searchValue = '';
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  // ── Búsqueda con debounce ─────────────────────────────────────
  onSearch(value: string): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.searchChange.emit(value), 280);
  }

  // ── Apertura de modales ───────────────────────────────────────

  /** Abre el modal de login */
  abrirLogin(): void {
    this.modalService.openLogin();
  }

  /** Abre el panel de géneros */
  abrirGeneros(): void {
    this.modalService.openShowGenders();
  }

  /** Abre el formulario de creación de película/serie */
  abrirCrearPelicula(): void {
    this.modalService.openCreateUpdateFilm(null);
  }

  /** Cierra sesión */
  async cerrarSesion(): Promise<void> {
    await this.usuariosService.logout();
  }

  ngOnDestroy(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  }
}