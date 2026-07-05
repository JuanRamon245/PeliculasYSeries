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
export class HeaderComponent {

  // ── Servicios para las distintas funcionalidades ──

  private modalService = inject(ModalService);
  usuariosService = inject(UsuariosService);

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
}