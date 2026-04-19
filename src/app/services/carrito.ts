import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../models/producto';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  mysqlId?: number;
}

@Injectable({ providedIn: 'root' })
export class Carrito {

  private items: ItemCarrito[] = [];
  private itemsSubject = new BehaviorSubject<ItemCarrito[]>([]);
  items$ = this.itemsSubject.asObservable();

  private get STORAGE_KEY(): string {
    const usuari = sessionStorage.getItem('usuari');
    const uid = usuari ? JSON.parse(usuari).uid : 'guest';
    return `carrito_${uid}`;
  }

  constructor() {
    this.cargarCarrito();
  }

  private cargarCarrito() {
    console.log('Cargando con clave:', this.STORAGE_KEY);
    const datos = localStorage.getItem(this.STORAGE_KEY);
    this.items = datos ? JSON.parse(datos) : [];
    this.itemsSubject.next(this.items);
  }

  private guardarCarrito() {
    console.log('Guardando en clave:', this.STORAGE_KEY);
    console.log('Items:', this.items);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
    this.itemsSubject.next(this.items);
  }

  recargarCarrito() {
    this.items = [];
    this.cargarCarrito();
  }

  agregarAlCarrito(producto: Producto, cantidad: number, mysqlId?: number) {
    const itemExistente = this.items.find(item => item.producto.id === producto.id);
    if (itemExistente) {
      itemExistente.cantidad += cantidad;
      if (mysqlId) itemExistente.mysqlId = mysqlId;
    } else {
      this.items.push({ producto, cantidad, mysqlId });
    }
    this.guardarCarrito();
  }

  obtenerItems(): ItemCarrito[] {
    return this.items;
  }

  actualizarCantidad(productoId: string, nuevaCantidad: number) {
    const item = this.items.find(i => i.producto.id === productoId);
    if (item) item.cantidad = nuevaCantidad;
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
    return this.items.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
  }
}
