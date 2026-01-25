import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-accesorios',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './accesorios.html',
  styleUrl: './accesorios.css',
})
export class Accesorios implements OnInit {


  searchText: string = '';
  selectedCategory: string = 'todas';


  accesorios = [
    // VASOS
    {
      nombre: 'Vaso Premium',
      categoria: 'vasos',
      clase: 'vaso1',
      imagen: 'assets/images/vaso1.png',
      precio: '16,50€',
      ruta: '/vaso'
    },
    {
      nombre: 'Vaso Classic',
      categoria: 'vasos',
      clase: 'vaso2',
      imagen: 'assets/images/vaso2.png',
      precio: '12,99€',
      ruta: null
    },
    {
      nombre: 'Vaso Original',
      categoria: 'vasos',
      clase: 'vaso3',
      imagen: 'assets/images/vaso3.png',
      precio: '12,99€',
      ruta: null
    },

    // JARRAS
    {
      nombre: 'Jarra Grande',
      categoria: 'jarras',
      clase: 'jarra1',
      imagen: 'assets/images/jarra1.png',
      precio: '12,99€',
      ruta: null
    },
    {
      nombre: 'Jarra Mediana',
      categoria: 'jarras',
      clase: 'jarra2',
      imagen: 'assets/images/jarra2.png',
      precio: '12,99€',
      ruta: null
    },
    {
      nombre: 'Jarra Clásica',
      categoria: 'jarras',
      clase: 'jarra3',
      imagen: 'assets/images/jarra3.png',
      precio: '12,99€',
      ruta: null
    },

    // COPAS
    {
      nombre: 'Copa Elegante',
      categoria: 'copas',
      clase: 'copa1',
      imagen: 'assets/images/copa1.png',
      precio: '12,99€',
      ruta: null
    },
    {
      nombre: 'Copa Premium',
      categoria: 'copas',
      clase: 'copa2',
      imagen: 'assets/images/copa2.png',
      precio: '12,99€',
      ruta: null
    },
    {
      nombre: 'Copa Clásica',
      categoria: 'copas',
      clase: 'copa3',
      imagen: 'assets/images/copa3.png',
      precio: '12,99€',
      ruta: null
    },

    // POSAVASOS
    {
      nombre: 'Posavasos Set 1',
      categoria: 'posavasos',
      clase: 'posavasos1',
      imagen: 'assets/images/pvasos1.png',
      precio: '12,99€',
      ruta: null
    },
    {
      nombre: 'Posavasos Set 2',
      categoria: 'posavasos',
      clase: 'posavasos2',
      imagen: 'assets/images/pvasos2.png',
      precio: '12,99€',
      ruta: null
    },
    {
      nombre: 'Posavasos Set 3',
      categoria: 'posavasos',
      clase: 'posavasos3',
      imagen: 'assets/images/pvasos3.png',
      precio: '12,99€',
      ruta: null
    }
  ];


  accesoriosFiltrados = [...this.accesorios];

  ngOnInit() {
    // Mostrar todos los accesorios al inicio
    this.accesoriosFiltrados = [...this.accesorios];
  }


  filtrarAccesorios() {
    this.accesoriosFiltrados = this.accesorios.filter(accesorio => {
      // Filtro por texto de búsqueda (busca en el nombre)
      const coincideTexto = accesorio.nombre
        .toLowerCase()
        .includes(this.searchText.toLowerCase());


      const coincideCategoria = this.selectedCategory === 'todas' ||
        accesorio.categoria === this.selectedCategory;


      return coincideTexto && coincideCategoria;
    });
  }
}
