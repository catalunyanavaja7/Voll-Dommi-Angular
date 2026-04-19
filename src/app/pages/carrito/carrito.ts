import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Carrito as CarritoService, ItemCarrito } from '../../services/carrito';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserAuth } from '../../authz/userAuth/user-auth';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css'],
})
export class CarritoComponent implements OnInit {

  items: ItemCarrito[] = [];
  totalProductos: number = 0;
  totalPedido: number = 0;
  mostrarPopup: boolean = false;
  numTarjeta: string = '';
  cvv: string = '';

  constructor(
    private carritoService: CarritoService,
    private http: HttpClient,
    private UserAuth: UserAuth
  ) {}

  ngOnInit(): void {
    this.carritoService.recargarCarrito();
    this.carritoService.items$.subscribe(items => {
      console.log('Items del observable:', items);
      this.items = items;
      this.calcularTotales();
    });
  }

  sumarCantidad(item: ItemCarrito): void {
    item.cantidad += 1;
    this.carritoService.actualizarCantidad(item.producto.id, item.cantidad);
    this.actualizarMysql(item);
  }

  restarCantidad(item: ItemCarrito): void {
    if (item.cantidad > 1) {
      item.cantidad -= 1;
      this.carritoService.actualizarCantidad(item.producto.id, item.cantidad);
      this.actualizarMysql(item);
    } else {
      if (item.mysqlId) this.eliminarMysql(item.mysqlId);
      this.carritoService.eliminarProducto(item.producto.id);
    }
  }

  eliminar(item: ItemCarrito) {
    if (item.mysqlId) this.eliminarMysql(item.mysqlId);
    this.carritoService.eliminarProducto(item.producto.id);
  }

  confirmarCompra() {
    const token = this.UserAuth.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const peticions = this.items.map(item =>
      this.http.post('http://localhost:3000/api/productes', {
        nom: item.producto.nombre,
        preu: item.producto.precio,
        quantitat: item.cantidad
      }, { headers }).toPromise()
    );

    Promise.all(peticions).then(() => {
      this.carritoService.vaciarCarrito();
      this.mostrarPopup = false;
      alert('Compra confirmada!');
    }).catch(err => {
      console.error('Error guardant la compra:', err);
      alert('Error al guardar la compra.');
    });
  }

  abrirPopup() {
    this.mostrarPopup = true;
  }

  cerrarPopup() {
    this.mostrarPopup = false;
  }

  private actualizarMysql(item: ItemCarrito) {
    if (!item.mysqlId) return;
    const token = this.UserAuth.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.put(`http://localhost:3000/api/productes/${item.mysqlId}`, {
      quantitat: item.cantidad
    }, { headers }).subscribe({
      error: (err) => console.error('Error actualitzant MySQL:', err)
    });
  }

  private eliminarMysql(mysqlId: number) {
    const token = this.UserAuth.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.delete(`http://localhost:3000/api/productes/${mysqlId}`, { headers }).subscribe({
      error: (err) => console.error('Error eliminant MySQL:', err)
    });
  }

  calcularTotales(): void {
    this.totalProductos = this.items.reduce(
      (total, item) => total + item.producto.precio * item.cantidad, 0
    );
    this.totalPedido = this.totalProductos;
  }
}
