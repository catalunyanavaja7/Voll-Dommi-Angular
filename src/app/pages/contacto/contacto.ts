import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CaptchaModalComponent } from '../../shared/captcha-modal/captcha-modal';

@Component({
  selector: 'app-contacto',
  imports: [CommonModule, FormsModule, CaptchaModalComponent],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
  standalone: true
})
export class Contacto {
  nombre = '';
  email = '';
  mensaje = '';
  mostrarCaptcha = false;

  enviarFormulario(): void {
    if (!this.nombre || !this.email || !this.mensaje) {
      alert('Completa todos los campos del formulario.');
      return;
    }

    this.mostrarCaptcha = true;
  }

  confirmarCaptcha(): void {
    this.mostrarCaptcha = false;
    alert('Consulta enviada correctamente.');
    this.nombre = '';
    this.email = '';
    this.mensaje = '';
  }

  cancelarCaptcha(): void {
    this.mostrarCaptcha = false;
  }
}
