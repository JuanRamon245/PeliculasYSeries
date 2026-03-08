import { Component, inject, signal } from '@angular/core';
import { FormsModule }               from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

import { UsuariosService } from './../../../../core/services/usuarios/usuarios-firebase.service';
import { ModalService }    from '../../../../core/services/ModalService/modal-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatDialogModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private dialogRef      = inject(MatDialogRef<LoginComponent>);
  private usuariosService = inject(UsuariosService);
  private modalService   = inject(ModalService);

  // ── Estado del formulario ─────────────────────────────────────
  email    = '';
  password = '';
  loading  = signal(false);

  // ── Acción ───────────────────────────────────────────────────

  async acceder(): Promise<void> {
    if (this.loading()) return;
    this.loading.set(true);

    const res = await this.usuariosService.login(this.email, this.password);

    this.loading.set(false);

    // Cerrar el modal de login independientemente del resultado
    this.dialogRef.close();

    // Mostrar modal de éxito o error con el resultado
    this.modalService.openErrorSuccess({
      success: res.success,
      message: res.message,
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}