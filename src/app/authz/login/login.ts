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
}
