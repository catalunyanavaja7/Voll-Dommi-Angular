import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../../models/producto';
import { Carrito } from '../../../services/carrito';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-clasica',
  imports: [FormsModule, RouterLink],
  templateUrl: './clasica.html',
  styleUrls: ['./clasica.css'],
  standalone: true,
})
export class Clasica {
  productos: Producto[] = [
    {
      id: '1',
      nombre: 'Voll - Dommi Original Pack (6 x33cl Latas)',
      precio: 8.70,
      imagen: 'src/assets/images/clasica.png',
    },
    {
      id: '2',
      nombre: 'Caja (12 x25cl Botellas)',
      precio: 12.70,
      imagen: 'src/assets/images/clasica.png',
    }
  ];

  tipoSeleccionado: string = '1'; // id del producto seleccionado
  cantidad: number = 1;

  constructor(private carrito: Carrito) {}

  agregarAlCarrito() {
    const producto = this.productos.find(p => p.id === this.tipoSeleccionado);
    if (producto) {
      this.carrito.agregarAlCarrito(producto, this.cantidad);
      alert(`${producto.nombre} añadido al carrito!`);
    }
  }
}
