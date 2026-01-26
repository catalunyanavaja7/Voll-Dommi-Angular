import {Component} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {Menu} from '../../shared/menu/menu';
import {Plantilla} from '../../models/plantilla';
import {CervezaService} from '../../models/CervezasService';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [
    RouterLink,
  ],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo {
  cervezas: Plantilla[];

  constructor(
    private router: Router,
    private cervezaService: CervezaService
  ) {
    // ✅ Obtiene las cervezas del servicio
    this.cervezas = this.cervezaService.obtenerCervezas();
  }

  irAPlantilla(id: string): void {
    this.router.navigate(['/cerveza', id]);
  }

}
