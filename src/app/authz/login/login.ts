import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserAuth } from '../userAuth/user-auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})
export class Login {
  email: string = '';
  password: string = '';

  mostrarModalReset: boolean = false;
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

    // peticion HTTP al backend
    this.authService.login(this.email, this.password);
  }

  // Mostrar modal de reset password
  mostrarResetPassword(): void {
    this.mostrarModalReset = true;
    this.emailReset = '';
  }

  // Cerrar modal
  cerrarModal(): void {
    this.mostrarModalReset = false;
    this.emailReset = '';
  }

  // Reset password (opción fácil: enviar contraseña original)
  resetPassword(): void {
    if (!this.emailReset) {
      alert('Por favor introduce tu email');
      return;
    }

    // Llamar al servicio
    const resultado = this.authService.recuperarPassword(this.emailReset);

    //Simulación de momento
    if (resultado.exito) {
      alert(`✅ Email enviado a: ${this.emailReset}\n\n🔑 Tu contraseña es: ${resultado.password}`);
      console.log('📧 Simulación de email enviado:');
      console.log(`   Para: ${this.emailReset}`);
      console.log(`   Asunto: Recuperación de contraseña`);
      console.log(`   Mensaje: Tu contraseña es: ${resultado.password}`);
      this.cerrarModal();
    } else {
      alert('❌ Email no encontrado. Verifica que estés registrado.');
    }
  }
}
