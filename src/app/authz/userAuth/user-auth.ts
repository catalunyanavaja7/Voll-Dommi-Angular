import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../enviroments/environment';

interface Usuario {
  uid: string;
  nom: string;
  cognoms: string;
  email: string;
  emailVerificat: boolean;
  createdAt: string;
  updatedAt: string;
  direccion: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserAuth {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // Registre
  registrar(nom: string, cognoms: string, email: string, password: string): void {
    const body = { nom, cognoms, email, password };

    this.http.post<any>(`${this.apiUrl}/auth/register`, body).subscribe({
      next: (res) => {
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('usuari', JSON.stringify(res.user));
        alert('Usuari registrat correctament! Comprova el teu correu per verificar el compte.');
        this.router.navigate(['/sesion']);
      },
      error: (err) => {
        const missatge = err.error?.message || 'Error en el registre. Torna-ho a intentar.';
        alert(missatge);
      }
    });
  }

  // Login
  login(email: string, password: string): void {
    const body = { email, password };

    this.http.post<any>(`${this.apiUrl}/auth/login`, body).subscribe({
      next: (res) => {
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('usuari', JSON.stringify(res.user));
        alert('Inici de sessió correcte!');
        this.router.navigate(['']);
      },
      error: (err) => {
        const missatge = err.error?.message || 'Email o contrasenya incorrectes.';
        alert(missatge);
      }
    });
  }

  // Actualitzar perfil — PUT /api/user/profile
  actualizarPerfil(dades: { nom?: string; cognoms?: string; adreca?: string; telefon?: string }): void {
    const token = this.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.put<any>(`${this.apiUrl}/user/profile`, dades, { headers }).subscribe({
      next: (res) => {
        // Actualitzar les dades locals amb les retornades pel backend
        const usuariActual = this.obtenerUsuarioLogueado();
        const usuariActualitzat = { ...usuariActual, ...res.user };
        sessionStorage.setItem('usuari', JSON.stringify(usuariActualitzat));
        alert('Dades actualitzades correctament.');
      },
      error: (err) => {
        const missatge = err.error?.message || 'Error en actualitzar les dades.';
        alert(missatge);
      }
    });
  }

  // Recuperar contrasenya — crida al backend
  recuperarPassword(email: string): void {
    const body = { email };

    this.http.post<any>(`${this.apiUrl}/auth/reset-password`, body).subscribe({
      next: () => {
        alert('Rebras una nova contrasenya en uns minuts. Revisa també el correu no desitjat.');
      },
      error: (err) => {
        const missatge = err.error?.message || 'Error en enviar el correu. Torna-ho a intentar.';
        alert(missatge);
      }
    });
  }

  // Logout
  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuari');
    this.router.navigate(['/sesion']);
  }

  // Estat sessio
  estaLogueado(): boolean {
    return sessionStorage.getItem('token') !== null;
  }

  // Obtenir token
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  // Obtenir usuari guardat localment
  obtenerUsuarioLogueado(): Usuario | null {
    const usuari = sessionStorage.getItem('usuari');
    return usuari ? JSON.parse(usuari) : null;
  }
}
