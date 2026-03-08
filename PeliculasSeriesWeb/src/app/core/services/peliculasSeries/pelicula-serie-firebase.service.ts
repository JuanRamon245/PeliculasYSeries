import { Injectable, inject } from '@angular/core';
import { toSignal }           from '@angular/core/rxjs-interop';
import {
  Firestore, collection, collectionData,
  doc, setDoc, deleteDoc, query, orderBy,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Movie, FilterState } from '../../models/Movie.model';

@Injectable({ providedIn: 'root' })
export class PeliculasSeriesService {
  private firestore = inject(Firestore);
  private col       = collection(this.firestore, 'peliculas');

  /**
   * Signal reactivo. collectionData() abre un WebSocket con Firestore:
   * cualquier cambio en la BD se refleja automáticamente en la UI.
   */
  readonly movies = toSignal(
    collectionData(
      query(this.col, orderBy('nombre')),
      { idField: 'nombre' },
    ) as Observable<Movie[]>,
    { initialValue: [] as Movie[] },
  );

  // ── CRUD ──────────────────────────────────────────────────────

  async create(data: Omit<Movie, 'fecha'>): Promise<{ success: boolean; message: string }> {
    try {
      const nombre = data.nombre.trim();
      if (!nombre) return { success: false, message: 'El nombre no puede estar vacío.' };

      const movie: Movie = { ...data, nombre, fecha: new Date().toISOString() };
      await setDoc(doc(this.col, nombre), movie);
      return { success: true, message: `"${nombre}" añadido correctamente.` };
    } catch (e) {
      console.error('[PeliculasSeriesService.create]', e);
      return { success: false, message: 'Error al guardar. Comprueba la conexión.' };
    }
  }

  async update(oldNombre: string, data: Omit<Movie, 'fecha'>): Promise<{ success: boolean; message: string }> {
    try {
      const nombre = data.nombre.trim();
      if (!nombre) return { success: false, message: 'El nombre no puede estar vacío.' };

      // Si el nombre cambia, el ID del doc cambia: borrar viejo y crear nuevo
      if (oldNombre !== nombre) {
        await deleteDoc(doc(this.col, oldNombre));
      }

      const movie: Movie = { ...data, nombre, fecha: new Date().toISOString() };
      await setDoc(doc(this.col, nombre), movie);
      return { success: true, message: `"${nombre}" actualizado correctamente.` };
    } catch (e) {
      console.error('[PeliculasSeriesService.update]', e);
      return { success: false, message: 'Error al actualizar. Comprueba la conexión.' };
    }
  }

  async delete(nombre: string): Promise<{ success: boolean; message: string }> {
    try {
      await deleteDoc(doc(this.col, nombre));
      return { success: true, message: `"${nombre}" eliminado correctamente.` };
    } catch (e) {
      console.error('[PeliculasSeriesService.delete]', e);
      return { success: false, message: 'Error al eliminar. Comprueba la conexión.' };
    }
  }

  // ── Filtrado local ────────────────────────────────────────────
  // Opera sobre el array ya descargado en memoria, sin queries extra a Firestore.

  applyFilters(movies: Movie[], filters: FilterState): Movie[] {
    let result = [...movies];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(m => m.nombre.toLowerCase().includes(q));
    }
    if (filters.animacion !== 'Todas') {
      result = result.filter(m => m.tipo[0] === filters.animacion);
    }
    if (filters.formato !== 'Todas') {
      result = result.filter(m => m.tipo[1] === filters.formato);
    }
    if (filters.generos.length > 0) {
      result = result.filter(m => filters.generos.includes(m.genero));
    }
    if (filters.estados.length > 0 && filters.estados.length < 3) {
      result = result.filter(m => filters.estados.includes(m.estado));
    }

    switch (filters.orden) {
      case 'az':            result.sort((a, b) => a.nombre.localeCompare(b.nombre));                          break;
      case 'za':            result.sort((a, b) => b.nombre.localeCompare(a.nombre));                          break;
      case 'fecha_ultima':  result.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()); break;
      case 'fecha_primera': result.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()); break;
    }

    return result;
  }
}