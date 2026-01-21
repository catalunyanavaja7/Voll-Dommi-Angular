import {Component, HostListener, OnInit} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
    selector: 'app-menu',
  imports: [
    NgClass
  ],
    templateUrl: './menu.html',
    styleUrl: './menu.css',
    standalone: true
})
export class Menu implements OnInit {
  isScrolled = false;

  ngOnInit(): void {
    // Inicialización si es necesaria
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 80;
    console.log('Scroll Y:', window.scrollY, 'isScrolled:', this.isScrolled); // Debug
  }

}


