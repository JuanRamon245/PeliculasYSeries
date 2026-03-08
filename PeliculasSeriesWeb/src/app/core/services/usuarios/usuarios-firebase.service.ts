import { Injectable, inject, signal, computed } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private auth = inject(Auth);

  // ── Estado del usuario ────────────────────────────────────────
  // Signal privado mutable; se actualiza desde el listener de Firebase Auth.
  // Usamos `undefined` para "aún no sabemos" (carga inicial),
  // `null` para "no autenticado" y `User` para "autenticado".
  private _currentUser = signal<User | null | undefined>(undefined);

  /** Usuario actual. undefined = cargando, null = no autenticado, User = autenticado */
  readonly currentUser = this._currentUser.asReadonly();

  /** true si el usuario ha iniciado sesión */
  readonly isLoggedIn = computed(() => this._currentUser() !== null && this._currentUser() !== undefined);

  /** true mientras se resuelve el estado inicial de Auth */
  readonly isLoading = computed(() => this._currentUser() === undefined);

  constructor() {
    // Firebase notifica el estado de autenticación de forma asíncrona.
    // Este listener se activa en cuanto la app arranca y mantiene el signal
    // actualizado para cualquier cambio (login, logout, token expirado...).
    onAuthStateChanged(this.auth, (user) => {
      this._currentUser.set(user);
    });
  }

  // ── Acciones ──────────────────────────────────────────────────

  /**
   * Inicia sesión con email y contraseña.
   * Devuelve un objeto con éxito/error para que el modal pueda reaccionar.
   */
  async login(email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!email.trim() || !password.trim()) {
        return { success: false, message: 'Rellena todos los campos.' };
      }
      await signInWithEmailAndPassword(this.auth, email.trim(), password);
      return { success: true, message: `Bienvenido.` };
    } catch (e: any) {
      // Firebase devuelve códigos de error específicos
      const msg = this.translateError(e?.code);
      return { success: false, message: msg };
    }
  }

  /** Cierra la sesión del usuario actual */
  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  // ── Helper privado ────────────────────────────────────────────

  private translateError(code: string): string {
    const map: Record<string, string> = {
      'auth/invalid-email':         'El email no es válido.',
      'auth/user-not-found':        'No existe ninguna cuenta con ese email.',
      'auth/wrong-password':        'Contraseña incorrecta.',
      'auth/invalid-credential':    'Credenciales incorrectas.',
      'auth/too-many-requests':     'Demasiados intentos. Inténtalo más tarde.',
      'auth/network-request-failed':'Sin conexión. Revisa tu red.',
    };
    return map[code] ?? 'Error desconocido. Inténtalo de nuevo.';
  }
}