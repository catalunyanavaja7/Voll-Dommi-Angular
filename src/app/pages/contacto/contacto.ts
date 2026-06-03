import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CaptchaModalComponent } from '../../shared/captcha-modal/captcha-modal';
import {ContactoService} from './contacto.service';

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

  constructor(private contactoService: ContactoService) {}

  enviarFormulario(): void {
    if (!this.nombre || !this.email || !this.mensaje) {
      alert('Completa todos los campos del formulario.');
      return;
    }
    this.mostrarCaptcha = true;
  }

  confirmarCaptcha(): void {
    this.mostrarCaptcha = false;

    const datos = {
      nombre: this.nombre,
      email: this.email,
      mensaje: this.mensaje
    };

    this.contactoService.enviarContacto(datos).subscribe({
      next: () => {
        alert('Consulta enviada correctamente.');
        this.nombre = '';
        this.email = '';
        this.mensaje = '';
      },
      error: (err) => {
        console.error('Error al enviar:', err);
        alert('Hubo un error al enviar la consulta. Inténtalo de nuevo.');
      }
    });
  }

  cancelarCaptcha(): void {
    this.mostrarCaptcha = false;
  }
}
