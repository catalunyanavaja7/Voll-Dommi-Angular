import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Cerveza {
  id: string;
  nombre: string;
  imagen: string;
  categoria: string;
  clase: string;
  ruta?: string;
}

@Component({
  selector: 'app-cervezas',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './cervezas.html',
  styleUrl: './cervezas.css',
  standalone: true
})
export class Cervezas implements OnInit {


  searchText: string = '';
  selectedCategory: string = 'todas';

  // Array de cervezas con toda la información
  cervezas = [
    {
      id: '1',
      nombre: 'Voll - Dommi Original',
      categoria: 'original',
      clase: 'clasica',
      imagen: 'assets/images/clasica.png',
      ruta: '/clasica/1'
    },
    {
      id: '2',
      nombre: 'Voll - Dommi Lemon Twist',
      categoria: 'original',
      clase: 'limon',
      imagen: 'assets/images/limon.png',
      ruta: '/clasica/2'
    },
    {
      id: '3',
      nombre: 'Voll - Dommi Tostada',
      categoria: 'original',
      clase: 'tostada',
      imagen: 'assets/images/tostada.png',
      ruta: '/clasica/3'
    },
    {
      nombre: 'Voll - Dommi Tropic',
      categoria: 'original',
      clase: 'tropical',
      imagen: 'assets/images/tropical.png',
      ruta: null
    },
    {
      nombre: 'Voll - Dommi IPA',
      categoria: 'original',
      clase: 'ipa',
      imagen: 'assets/images/IPA.png',
      ruta: null
    },
    {
      nombre: 'Voll - Dommi Marel',
      categoria: 'original',
      clase: 'mediterranea',
      imagen: 'assets/images/mediterranea.png',
      ruta: null
    },
    {
      nombre: 'Voll - Dommi 00 Original',
      categoria: '00',
      clase: 'cerocero',
      imagen: 'assets/images/cerocero.png',
      ruta: null
    },
    {
      nombre: 'Voll - Dommi 00 Citrus',
      categoria: '00',
      clase: 'cerolimon',
      imagen: 'assets/images/cerocerolimon.png',
      ruta: null
    },
    {
      nombre: 'Voll - Dommi 00 Caramelo',
      categoria: '00',
      clase: 'cerotostada',
      imagen: 'assets/images/cerocerotostada.png',
      ruta: null
    }
  ];

  //cervezas filtradas
  cervezasFiltradas = [...this.cervezas];

  ngOnInit() {
    // Mostrar todas las cervezas al inicio
    this.cervezasFiltradas = [...this.cervezas];
  }

  // Metodo que filtra las cervezas
  filtrarCervezas() {
    this.cervezasFiltradas = this.cervezas.filter(cerveza => {
      // Filtro por texto de búsqueda
      const coincideTexto = cerveza.nombre
        .toLowerCase()
        .includes(this.searchText.toLowerCase());

      // Filtro por categoría
      const coincideCategoria = this.selectedCategory === 'todas' ||
        cerveza.categoria === this.selectedCategory;


      return coincideTexto && coincideCategoria;
    });
  }
}
