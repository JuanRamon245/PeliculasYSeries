/**
 * ModalService — Servicio centralizador de modales
 *
 * Ventajas de este patrón:
 *  - Un único punto de apertura para todos los diálogos.
 *  - Los componentes no necesitan inyectar MatDialog directamente.
 *  - Fácil cambiar las opciones globales (tamaño, animación) en un solo sitio.
 *  - Tipado fuerte en cada apertura gracias a los genéricos de MatDialog.
 */
import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// Modales — importados de forma diferida mediante loadComponent
// (Angular los incluirá en chunks separados automáticamente)
import { LoginComponent }              from '../../../features/movies/modals/login/login.component';
import { CreateUpdateFilmsComponent }  from '../../../features/movies/modals/create-update-films/create-update-films.component';
import { CreateUpdateGendersComponent } from '../../../features/movies/modals/create-update-genders/create-update-genders.component';
import { DeleteFilmsGendersComponent } from '../../../features/movies/modals/delete-films-genders/delete-films-genders.component';
import { ErrorSuccessComponent }       from '../../../features/movies/modals/error-success/error-success.component';
import { ShowGendersComponent }        from '../../../features/movies/modals/show-genders/show-genders.component';

import { Movie } from '../../models/Movie.model';

// ── Tipos de datos que recibe cada modal ──────────────────────
export interface DeleteModalData {
  tipo:   'pelicula' | 'genero';
  nombre: string;
}

export interface FilmModalData {
  movie: Movie | null;  // null → modo creación; Movie → modo edición
}

export interface GenderModalData {
  genero: string | null;  // null → modo creación; string → modo edición
}

export interface ErrorSuccessData {
  success: boolean;
  message: string;
}

// ── Config común para todos los diálogos ─────────────────────
const BASE_CONFIG = {
  maxWidth:   '95vw',
  panelClass: 'cine-dialog',
  backdropClass: 'cdk-overlay-dark-backdrop',  // ← activa el fondo oscuro
};

@Injectable({ providedIn: 'root' })
export class ModalService {
  private dialog = inject(MatDialog);

  // ── Apertura de modales ───────────────────────────────────────

  openLogin(): MatDialogRef<LoginComponent> {
    return this.dialog.open(LoginComponent, {
      ...BASE_CONFIG,
      width: '700px',
    });
  }

  /**
   * Abre el formulario de crear o editar película/serie.
   * @param movie  null → crear nuevo  |  Movie → editar existente
   */
  openCreateUpdateFilm(movie: Movie | null = null): MatDialogRef<CreateUpdateFilmsComponent> {
    return this.dialog.open(CreateUpdateFilmsComponent, {
      ...BASE_CONFIG,
      width:     '1000px',
      data:      { movie } satisfies FilmModalData,
      // Evitar cierre accidental al hacer clic fuera
      disableClose: true,
    });
  }

  /**
   * Abre el formulario de crear o editar género.
   * @param genero  null → crear  |  string → editar
   */
  openCreateUpdateGender(genero: string | null = null): MatDialogRef<CreateUpdateGendersComponent> {
    return this.dialog.open(CreateUpdateGendersComponent, {
      ...BASE_CONFIG,
      width:        '1000px',
      data:         { genero } satisfies GenderModalData,
      disableClose: true,
    });
  }

  /**
   * Abre la confirmación de borrado (sirve tanto para películas como géneros).
   */
  openDelete(data: DeleteModalData): MatDialogRef<DeleteFilmsGendersComponent> {
    return this.dialog.open(DeleteFilmsGendersComponent, {
      ...BASE_CONFIG,
      width: '500px',
      data,
    });
  }

  /**
   * Muestra el resultado de una operación (éxito o error).
   * Se cierra automáticamente después de `duration` ms si se desea.
   */
  openErrorSuccess(data: ErrorSuccessData): MatDialogRef<ErrorSuccessComponent> {
    return this.dialog.open(ErrorSuccessComponent, {
      ...BASE_CONFIG,
      width: '400px',
      data,
    });
  }

  /** Abre el panel de gestión de géneros */
  openShowGenders(): MatDialogRef<ShowGendersComponent> {
    return this.dialog.open(ShowGendersComponent, {
      ...BASE_CONFIG,
      width: '1000px',
    });
  }
}