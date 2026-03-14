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
  private dialogRef = inject(MatDialogRef<ErrorSuccessComponent>);
  data: ErrorSuccessData = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    // Cierre automático a los 2.5 s para no interrumpir el flujo del usuario
    setTimeout(() => this.dialogRef.close(), 2500);
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}