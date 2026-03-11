import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carrito as CarritoService, ItemCarrito } from '../../services/carrito';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css'],
})
export class CarritoComponent implements OnInit {

  items: ItemCarrito[] = [];

  totalProductos: number = 0;
  totalPedido: number = 0;

  mostrarPopup: boolean = false;

  //campos del formulario
  numTarjeta: string = '';
  cvv: string = '';

  constructor(private carritoService: CarritoService) {
    this.items = this.carritoService.obtenerItems();
  }

  confirmarCompra() {
    this.carritoService.vaciarCarrito();
    this.items = [];
    this.totalProductos = 0;
    this.totalPedido = 0;
    this.mostrarPopup = false;
  }

  eliminar(item: ItemCarrito) {
    this.carritoService.eliminarProducto(item.producto.id);
    this.items = this.carritoService.obtenerItems(); // refrescar vista
  }

  abrirPopup() {
    this.mostrarPopup = true;
  }

  cerrarPopup() {
    this.mostrarPopup = false;
  }

  ngOnInit(): void {
    this.cargarCarrito();
  }

  cargarCarrito(): void {
    this.items = this.carritoService.obtenerItems();
    this.calcularTotales();
  }

  sumarCantidad(item: ItemCarrito): void {
    this.carritoService.actualizarCantidad(
      item.producto.id,
      item.cantidad + 1
    );
    this.cargarCarrito();
  }

  restarCantidad(item: ItemCarrito): void {
    if (item.cantidad > 1) {
      this.carritoService.actualizarCantidad(
        item.producto.id,
        item.cantidad - 1
      );
    } else {
      this.carritoService.eliminarProducto(item.producto.id);
    }
    this.cargarCarrito();
  }

  calcularTotales(): void {
    this.totalProductos = this.items.reduce(
      (total, item) => total + item.producto.precio * item.cantidad,
      0
    );

    // De momento no hay gastos ni descuentos
    this.totalPedido = this.totalProductos;
  }
}
