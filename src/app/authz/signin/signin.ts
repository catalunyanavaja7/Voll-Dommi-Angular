import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserAuth } from '../userAuth/user-auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CaptchaModalComponent } from '../../shared/captcha-modal/captcha-modal';

@Component({
  selector: 'app-signin',
  imports: [RouterLink, CommonModule, FormsModule, CaptchaModalComponent],
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
  mostrarCaptcha: boolean = false;

  constructor(
    private authService: UserAuth,
    private router: Router
  ) {}

  registrar(): void {
    if (!this.nombre || !this.apellido || !this.email || !this.password) {
      alert('Completa los campos importantes');
      return;
    }

    if (this.password !== this.confirmarPassword) {
      alert('Las contraseÃ±as no coinciden');
      return;
    }

    if (this.nombre.length >= 10) {
      alert('El nombre tiene que tener menos de 10 caracteres');
      return;
    }

    if (this.password.length < 6) {
      alert('La contraseÃ±a debe tener al menos 6 caracteres');
      return;
    }

    this.mostrarCaptcha = true;
  }

  confirmarCaptcha(): void {
    this.mostrarCaptcha = false;
    this.authService.registrar(this.nombre, this.apellido, this.email, this.password);
  }

  cancelarCaptcha(): void {
    this.mostrarCaptcha = false;
  }
}
