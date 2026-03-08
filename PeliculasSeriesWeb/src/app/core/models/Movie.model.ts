// =============================================
// CINEMATECA - Data Models
// =============================================

export type Animacion = 'Anime' | 'Normal';
export type Formato   = 'Pelicula' | 'Serie';
export type Estado    = 'Visto' | 'No visto' | 'En proceso';

export interface Movie {
  nombre: string;   // KEY / ID del documento en Firestore
  tipo: [Animacion, Formato];
  genero: string;
  estado: Estado;
  fecha: string;    // ISO — se genera automáticamente al crear/actualizar
  maximo: string;   // Ej: "1056" o "4T x 25C"
  minimo: string;   // Progreso actual del usuario
}

export interface Genre {
  nombre: string;   // KEY / ID del documento en Firestore
}

export interface FilterState {
  search:    string;
  orden:     'az' | 'za' | 'fecha_ultima' | 'fecha_primera';
  animacion: 'Todas' | Animacion;
  formato:   'Todas' | Formato;
  generos:   string[];   // vacío = todos
  estados:   Estado[];
}

export const DEFAULT_FILTERS: FilterState = {
  search:    '',
  orden:     'az',
  animacion: 'Todas',
  formato:   'Todas',
  generos:   [],
  estados:   ['Visto', 'No visto', 'En proceso'],
};

export const ESTADOS:    Estado[]    = ['Visto', 'No visto', 'En proceso'];
export const ANIMACIONES: Animacion[] = ['Anime', 'Normal'];
export const FORMATOS:   Formato[]   = ['Pelicula', 'Serie'];