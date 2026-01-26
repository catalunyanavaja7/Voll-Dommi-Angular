import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {UserAuth} from '../../../authz/userAuth/user-auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../../models/producto';
import { Plantilla } from '../../../models/plantilla'
import { Carrito } from '../../../services/carrito';
import {Catalogo} from '../../../pages/catalogo/catalogo';
import {CervezaService} from '../../../models/CervezasService';

@Component({
  selector: 'app-clasica',
  standalone: true,
  imports: [RouterLink, CommonModule,FormsModule],
  templateUrl: './clasica.html',
  styleUrls: ['./clasica.css'],
})
export class Clasica implements OnInit {
  // @ts-ignore
  plantilla = this.plantillaSeleccionada

  productos: Producto[] = [
    {
      id: '1',
      imagen: 'assets/images/clasica.png',
      nombre: 'Pack (6 x33cl Latas)',
      precio: 8.70,
    },
    {
      id: '2',
      imagen: 'assets/images/clasica.png',
      nombre: 'Caja (12 x25cl Botellas)',
      precio: 12.70
    }
  ];

  tipoSeleccionado: string = '1'; // id del producto seleccionado
  cantidad: number = 1;

  mostrarPopup: boolean = false;

  constructor(
    private authService: UserAuth,
    private router: Router,
    private route: ActivatedRoute,
    private carrito: Carrito,
    private cervezaService: CervezaService
  ) {}

  plantillaSeleccionada!: Plantilla;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];

      // ✅ Obtiene la cerveza del servicio por ID
      const plantilla = this.cervezaService.obtenerCervezaPorId(id);

      if (plantilla) {
        this.plantillaSeleccionada = plantilla;
      }
    });
  }

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
