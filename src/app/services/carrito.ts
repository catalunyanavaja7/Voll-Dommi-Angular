import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

// Interfaz para los items del carrito
export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})

export class Carrito {

  private items: ItemCarrito[] = [];
  private readonly STORAGE_KEY = 'carrito_productos';

  constructor() {
    this.cargarCarrito();
  }

  private cargarCarrito() {
    const datosGuardados = localStorage.getItem(this.STORAGE_KEY);

    if (datosGuardados) {
      this.items = JSON.parse(datosGuardados);
    }
  }

  private guardarCarrito() {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
  }

  agregarAlCarrito(producto: Producto, cantidad: number) {
    const itemExistente = this.items.find(item => item.producto.id === producto.id);

    if (itemExistente) {
      itemExistente.cantidad += cantidad;
    } else {
      this.items.push({ producto, cantidad });
    }
    this.guardarCarrito();
  }

  obtenerItems(): ItemCarrito[] {
    return this.items;
  }

  actualizarCantidad(productoId: string, nuevaCantidad: number) {
    const item = this.items.find(i => i.producto.id === productoId);
    if (item) {
      item.cantidad = nuevaCantidad;
    }
    this.guardarCarrito();
  }

  eliminarProducto(productoId: string) {
    this.items = this.items.filter(item => item.producto.id !== productoId);
    this.guardarCarrito();
  }

  vaciarCarrito() {
    this.items = [];
    this.guardarCarrito();
  }

  calcularTotal(): number {
    let total = 0;
    for (let item of this.items) {
      total += item.producto.precio * item.cantidad;
    }
    return total;
  }
}

