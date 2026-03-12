import {Component, HostListener, OnInit} from '@angular/core';
import {CommonModule, NgClass} from '@angular/common';
import {RouterLink} from "@angular/router";
import {UserAuth} from '../../authz/userAuth/user-auth';

@Component({
  selector: 'app-menu',
  imports: [NgClass, RouterLink, CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
  standalone: true
})
export class Menu implements OnInit {
  isScrolled = false;

  constructor(public authService: UserAuth) {
  }

  ngOnInit(): void {
    console.log('Usuario logueado:', this.authService.obtenerUsuarioLogueado());
    console.log('¿Esta logueado?: ', this.authService.estaLogueado());

  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 80;
    console.log('Scroll Y:', window.scrollY, 'isScrolled:', this.isScrolled); // Debug
  }

  cerrarSesion(): void {
    if (confirm('Seguro que quieres cerrar sesión?')) {
      this.authService.logout();
    }
  }

}


