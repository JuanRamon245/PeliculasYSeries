import { Component, inject, signal } from '@angular/core';
import { FormsModule }               from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

import { UsuariosService } from './../../../../core/services/usuarios/usuarios-firebase.service';
import { ModalService }    from '../../../../core/services/ModalService/modal-service.service';
import { ClickEffectDirective } from '../../../shared/directives/click-efect.directives';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatDialogModule, ClickEffectDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  // ── Servicios para las distintas funcionalidades ──
  
  private dialogRef      = inject(MatDialogRef<LoginComponent>);
  private usuariosService = inject(UsuariosService);
  private modalService   = inject(ModalService);

  // ── Campos del formulario ──

  email    = '';
  password = '';
  loading  = signal(false);

  // ── Eventos del modal ──
  
  async acceder(): Promise<void> {
    if (this.loading()) return;
    this.loading.set(true);

    const res = await this.usuariosService.login(this.email, this.password);

    this.loading.set(false);
    this.dialogRef.close();

    this.modalService.openErrorSuccess({
      success: res.success,
      message: res.message,
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}