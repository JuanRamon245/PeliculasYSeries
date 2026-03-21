import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent }              from '../../../features/movies/modals/login/login.component';
import { CreateUpdateFilmsComponent }  from '../../../features/movies/modals/create-update-films/create-update-films.component';
import { CreateUpdateGendersComponent } from '../../../features/movies/modals/create-update-genders/create-update-genders.component';
import { DeleteFilmsGendersComponent } from '../../../features/movies/modals/delete-films-genders/delete-films-genders.component';
import { ErrorSuccessComponent }       from '../../../features/movies/modals/error-success/error-success.component';
import { ShowGendersComponent }        from '../../../features/movies/modals/show-genders/show-genders.component';

import { Movie } from '../../models/Movie.model';

// ── Modales que existen con el tipo de dato que van a manejar ──

export interface DeleteModalData {
  tipo:   'pelicula' | 'genero';
  nombre: string;
}

export interface FilmModalData {
  movie: Movie | null;
}

export interface GenderModalData {
  genero: string | null;
}

export interface ErrorSuccessData {
  success: boolean;
  message: string;
}

// ── Configuración de los modales para mostrar una opacidad detrás y que se vea más oscuro el fondo──

const BASE_CONFIG = {
  maxWidth:   '95vw',
  panelClass: 'cine-dialog',
  backdropClass: 'cdk-overlay-dark-backdrop',
};

@Injectable({ providedIn: 'root' })
export class ModalService {
  private dialog = inject(MatDialog);

  // ── Abrir el modal de loguearse ──

  openLogin(): MatDialogRef<LoginComponent> {
    return this.dialog.open(LoginComponent, {
      ...BASE_CONFIG,
      width: '700px',
    });
  }

  // ── Abrir el modal de crear o editar titulos ──

  openCreateUpdateFilm(movie: Movie | null = null): MatDialogRef<CreateUpdateFilmsComponent> {
    return this.dialog.open(CreateUpdateFilmsComponent, {
      ...BASE_CONFIG,
      width: '1000px',
      data: { movie } satisfies FilmModalData,
      // Evitar cierre accidental al hacer clic fuera
      disableClose: true,
    });
  }

  // ── Abrir el modal de crear o editar generos ──

  openCreateUpdateGender(genero: string | null = null): MatDialogRef<CreateUpdateGendersComponent> {
    return this.dialog.open(CreateUpdateGendersComponent, {
      ...BASE_CONFIG,
      width: '1000px',
      data: { genero } satisfies GenderModalData,
      disableClose: true,
    });
  }

  // ── Abrir el modal de eliminar generos o titulos ──

  openDelete(data: DeleteModalData): MatDialogRef<DeleteFilmsGendersComponent> {
    return this.dialog.open(DeleteFilmsGendersComponent, {
      ...BASE_CONFIG,
      width: '500px',
      data,
    });
  }

  // ── Abrir el modal de error o exito ──

  openErrorSuccess(data: ErrorSuccessData): MatDialogRef<ErrorSuccessComponent> {
    return this.dialog.open(ErrorSuccessComponent, {
      ...BASE_CONFIG,
      width: '400px',
      data,
    });
  }

  // ── Abrir el modal de mostrar generos ──

  openShowGenders(): MatDialogRef<ShowGendersComponent> {
    return this.dialog.open(ShowGendersComponent, {
      ...BASE_CONFIG,
      width: '1000px',
    });
  }
}