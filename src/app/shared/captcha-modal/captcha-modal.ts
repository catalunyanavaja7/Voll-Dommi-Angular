import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-captcha-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './captcha-modal.html',
  styleUrl: './captcha-modal.css',
})
export class CaptchaModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() titulo = 'Verificacion de seguridad';

  @Output() confirmado = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  numeroA = 0;
  numeroB = 0;
  respuestaUsuario = '';
  error = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue) {
      this.generarCaptcha();
    }
  }

  cerrar(): void {
    this.limpiarEstado();
    this.cancelado.emit();
  }

  validar(): void {
    if (this.respuestaUsuario.trim() === '') {
      this.error = 'Introduce el resultado para continuar.';
      return;
    }

    if (Number(this.respuestaUsuario) !== this.numeroA + this.numeroB) {
      this.error = 'Resultado incorrecto. Intentalo de nuevo.';
      this.respuestaUsuario = '';
      this.generarCaptcha();
      return;
    }

    this.limpiarEstado();
    this.confirmado.emit();
  }

  private generarCaptcha(): void {
    this.numeroA = Math.floor(Math.random() * 9) + 1;
    this.numeroB = Math.floor(Math.random() * 9) + 1;
    this.respuestaUsuario = '';
    this.error = '';
  }

  private limpiarEstado(): void {
    this.respuestaUsuario = '';
    this.error = '';
  }
}
