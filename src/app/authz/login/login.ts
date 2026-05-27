import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserAuth } from '../userAuth/user-auth';
import { FormsModule } from '@angular/forms';
import { CaptchaModalComponent } from '../../shared/captcha-modal/captcha-modal';

@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule, FormsModule, CaptchaModalComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})
export class Login {
  email: string = '';
  password: string = '';

  mostrarModalReset: boolean = false;
  mostrarCaptcha: boolean = false;
  emailReset: string = '';

  constructor(
    private authService: UserAuth,
    private router: Router
  ) {}

  login(): void {
    if (!this.email || !this.password) {
      alert('Por favor completa todos los campos');
      return;
    }
    this.mostrarCaptcha = true;
  }

  confirmarCaptcha(): void {
    this.mostrarCaptcha = false;
    this.authService.login(this.email, this.password);
  }

  cancelarCaptcha(): void {
    this.mostrarCaptcha = false;
  }

  mostrarResetPassword(): void {
    this.mostrarModalReset = true;
    this.emailReset = '';
  }

  cerrarModal(): void {
    this.mostrarModalReset = false;
    this.emailReset = '';
  }

  // Llama al backend envia nova contrasenya per correu
  resetPassword(): void {
    if (!this.emailReset) {
      alert('Por favor introduce tu email');
      return;
    }

    this.authService.recuperarPassword(this.emailReset);
    this.cerrarModal();
  }
}
