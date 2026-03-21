import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { ErrorSuccessData } from '../../../../core/services/ModalService/modal-service.service';

@Component({
  selector: 'app-error-success',
  standalone: true,
  imports: [MatDialogModule, CommonModule],
  templateUrl: './error-success.component.html',
  styleUrl: './error-success.component.css'
})
export class ErrorSuccessComponent implements OnInit {

  // ── Servicios para las distintas funcionalidades ──

  private dialogRef = inject(MatDialogRef<ErrorSuccessComponent>);
  data: ErrorSuccessData = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    setTimeout(() => this.dialogRef.close(), 3300);
  }

  // ── Eventos del modal ──

  cerrar(): void {
    this.dialogRef.close();
  }
}