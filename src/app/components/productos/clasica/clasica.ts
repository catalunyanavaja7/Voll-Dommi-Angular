import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {UserAuth} from '../../../authz/userAuth/user-auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../../models/producto';
import { Carrito } from '../../../services/carrito';

@Component({
  selector: 'app-clasica',
  standalone: true,
  imports: [RouterLink, CommonModule,FormsModule],
  templateUrl: './clasica.html',
  styleUrls: ['./clasica.css'],
})
export class Clasica {
  productos: Producto[] = [
    {
      id: '1',
      nombre: 'Voll - Dommi Original Pack (6 x33cl Latas)',
      precio: 8.70,
      imagen: 'assets/images/clasica.png',
    },
    {
      id: '2',
      nombre: 'Caja (12 x25cl Botellas)',
      precio: 12.70,
      imagen: 'assets/images/clasica.png',
    }
  ];

  tipoSeleccionado: string = '1'; // id del producto seleccionado
  cantidad: number = 1;

  mostrarPopup: boolean = false;

  constructor(
    private authService: UserAuth,
    private router: Router,
    private carrito: Carrito
  ) {}

  // Verificar si está logeado
  verificarYAnadir(): void {
    if (!this.authService.estaLogueado()) {
      this.mostrarPopup = true;
    } else {
      this.agregarAlCarrito();
    }
  }

  // Cerrar el popup
  cerrarPopup(): void {
    this.mostrarPopup = false;
  }

  // Ir a la página de registro
  irARegistro(): void {
    this.mostrarPopup = false;
    this.router.navigate(['/registro']); // Ajusta la ruta según tu routing
  }

  // Ir a la página de login
  irALogin(): void {
    this.mostrarPopup = false;
    this.router.navigate(['/sesion']); // Ajusta la ruta según tu routing
  }

  agregarAlCarrito() {
    const producto = this.productos.find(p => p.id === this.tipoSeleccionado);
    if (producto) {
      this.carrito.agregarAlCarrito(producto, this.cantidad);
      alert(`${producto.nombre} añadido al carrito!`);
    }
  }
}
