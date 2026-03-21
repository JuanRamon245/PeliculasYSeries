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

  // ── Verificamos el estado del usuario ──

  private _currentUser = signal<User | null | undefined>(undefined);

  readonly currentUser = this._currentUser.asReadonly();

  readonly isLoggedIn = computed(() => this._currentUser() !== null && this._currentUser() !== undefined);
  readonly isLoading = computed(() => this._currentUser() === undefined);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this._currentUser.set(user);
    });
  }

  // ── Metodo para loguearse en la web ──

  async login(email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!email.trim() || !password.trim()) {
        return { success: false, message: 'Rellena todos los campos.' };
      }
      await signInWithEmailAndPassword(this.auth, email.trim(), password);
      return { success: true, message: `Bienvenido.` };
    } catch (e: any) {
      const msg = this.translateError(e?.code);
      return { success: false, message: msg };
    }
  }

  // ── Metodo para desloguearse en la web ──

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  // ── Metodo para traducir los distintos errores que nos puede mandar firebase ──

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