import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {Login} from '../login/login';

interface Usuario {
  nombre: string;
  email: string;
  password: string;
}


@Injectable({
  providedIn: 'root',
})
export class UserAuth {
  private readonly USUARIO_KEY = "usuario_registrado";
  private readonly SESION_KEY = 'sesion_activa';

  constructor(private router: Router) {}

  // @ts-ignore
  registrar(nombre: string, email: string, password: string): boolean {
    // Verificar si ya existe un usuario
    if (this.existeUsuario()) {
      alert('Ya existe un usuario registrado');
      return false;
    }

    const usuario: Usuario = { nombre, email, password };
    sessionStorage.setItem(this.USUARIO_KEY, JSON.stringify(usuario));
    alert('Usuario registrado exitosamente');
    return true;
  }

  // Iniciar sesión

  // @ts-ignore
  login(email: string, password: string): boolean {
    const usuarioGuardado = this.obtenerUsuarioRegistrado();

    if (!usuarioGuardado) {
      alert('No hay ningun usuario registrado');
      return false;
    }

    if (usuarioGuardado.email === email && usuarioGuardado.password === password) {
      // Guardar sesion activa
      sessionStorage.setItem(this.SESION_KEY, 'true');
      alert('Inicio de sesion exitoso');
      this.router.navigate([''])
      return true;
    } else {
      alert('Email o contraseña incorrectos')
      return false;
    }
  }

  // Cerrar sesion

  logout(): void {
    sessionStorage.removeItem(this.SESION_KEY);
    this.router.navigate(['/sesion'])
  }

  // Verificar si hay sesion activa

  estaLogueado(): boolean {
    return sessionStorage.getItem(this.SESION_KEY) === 'true';
  }

  // Obtener usuario logueado

  obtenerUsuarioLogueado(): Usuario | null {
    if (this.estaLogueado()) {
      return this.obtenerUsuarioRegistrado()
    }
    return null;
  }

  // Verificar si existe un usuario registrado

  existeUsuario(): boolean {
    return sessionStorage.getItem(this.USUARIO_KEY) !== null;
  }

  // Obtener usuario registrado

  private obtenerUsuarioRegistrado(): Usuario | null {
    const usuario = sessionStorage.getItem(this.USUARIO_KEY);
    return usuario ? JSON.parse(usuario) : null;
  }


}
