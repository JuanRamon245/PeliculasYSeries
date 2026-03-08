import { Injectable, inject, computed } from '@angular/core';
import { toSignal }                     from '@angular/core/rxjs-interop';
import {
  Firestore, collection, collectionData,
  doc, setDoc, deleteDoc, query, orderBy,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Genre } from '../../models/Movie.model';

@Injectable({ providedIn: 'root' })
export class GenerosService {
  private firestore = inject(Firestore);
  private col       = collection(this.firestore, 'generos');

  readonly genres = toSignal(
    collectionData(
      query(this.col, orderBy('nombre')),
      { idField: 'nombre' },
    ) as Observable<Genre[]>,
    { initialValue: [] as Genre[] },
  );

  readonly genreNames = computed(() => this.genres().map(g => g.nombre));

  // ── CRUD ──────────────────────────────────────────────────────

  async create(nombre: string): Promise<{ success: boolean; message: string }> {
    try {
      nombre = nombre.trim();
      if (!nombre) return { success: false, message: 'El nombre no puede estar vacío.' };

      const exists = this.genres().some(g => g.nombre.toLowerCase() === nombre.toLowerCase());
      if (exists) return { success: false, message: `El género "${nombre}" ya existe.` };

      await setDoc(doc(this.col, nombre), { nombre });
      return { success: true, message: `Género "${nombre}" creado correctamente.` };
    } catch (e) {
      console.error('[GenerosService.create]', e);
      return { success: false, message: 'Error al crear el género.' };
    }
  }

  async update(oldNombre: string, newNombre: string): Promise<{ success: boolean; message: string }> {
    try {
      newNombre = newNombre.trim();
      if (!newNombre) return { success: false, message: 'El nombre no puede estar vacío.' };

      if (oldNombre !== newNombre) {
        const exists = this.genres().some(g => g.nombre.toLowerCase() === newNombre.toLowerCase());
        if (exists) return { success: false, message: `El género "${newNombre}" ya existe.` };
        await deleteDoc(doc(this.col, oldNombre));
      }

      await setDoc(doc(this.col, newNombre), { nombre: newNombre });
      return { success: true, message: 'Género actualizado correctamente.' };
    } catch (e) {
      console.error('[GenerosService.update]', e);
      return { success: false, message: 'Error al actualizar el género.' };
    }
  }

  async delete(nombre: string): Promise<{ success: boolean; message: string }> {
    try {
      await deleteDoc(doc(this.col, nombre));
      return { success: true, message: `Género "${nombre}" eliminado.` };
    } catch (e) {
      console.error('[GenerosService.delete]', e);
      return { success: false, message: 'Error al eliminar el género.' };
    }
  }
}