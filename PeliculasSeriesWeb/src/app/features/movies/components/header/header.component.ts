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

  // ── Servicios para las distintas funcionalidades ──

  private modalService = inject(ModalService);
  usuariosService = inject(UsuariosService);

  // ── Funcionalidad del filtrado y busqueda de peliculas y series ──

  searchChange = output<string>();

  searchValue = '';
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  onSearch(value: string): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.searchChange.emit(value), 280);
  }

  // ── Metodos para abrir los modales ──

  abrirLogin(): void {
    this.modalService.openLogin();
  }

  abrirGeneros(): void {
    this.modalService.openShowGenders();
  }

  abrirCrearPelicula(): void {
    this.modalService.openCreateUpdateFilm(null);
  }

  async cerrarSesion(): Promise<void> {
    await this.usuariosService.logout();
  }

  ngOnDestroy(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  }
}