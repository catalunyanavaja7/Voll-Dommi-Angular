import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserAuth } from '../userAuth/user-auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signin',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
  standalone: true
})
export class Signin {
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  password: string = '';
  confirmarPassword: string = '';

  constructor(
    private authService: UserAuth,
    private router: Router
  ) {}

  registrar(): void {
    if (!this.nombre || !this.email || !this.password) {
      alert('Completa los campos importantes');
      return;
    }

    if (this.password !== this.confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (this.nombre.length >= 10) {
      alert('El nombre tiene que tener menos de 10 caracteres');
      return;
    }

    if (this.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // petició HTTP al backend
    this.authService.registrar(this.nombre, this.apellido, this.email, this.password);
  }
}
