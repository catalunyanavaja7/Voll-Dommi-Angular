import { Injectable } from '@angular/core';
import { Plantilla } from '../models/plantilla';

@Injectable({
  providedIn: 'root'  //
})
export class CervezaService {

  private cervezas: Plantilla[] = [
    {
      id: '1',
      nombreCerveza: 'Voll-Dommi Original',
      imagen: 'assets/images/clasica.png',
      categoria: 'original',
      descripcion: 'Una cerveza equilibrada y refrescante, con un sabor suave y maltoso que celebra la tradición cervecera.'
    },
    {
      id: '2',
      nombreCerveza: 'Voll-Dommi Lemon Twist',
      imagen: 'assets/images/limon.png',
      categoria: 'original',
      descripcion: 'Refrescante cerveza con toque cítrico de limón natural. Perfecta para el verano.'
    },
    {
      id: '3',
      nombreCerveza: 'Voll-Dommi Tostada',
      imagen: 'assets/images/tostada.png',
      categoria: 'original',
      descripcion: 'Cerveza de malta tostada con notas de caramelo. Sabor intenso y memorable.'
    }
  ];

  obtenerCervezas(): Plantilla[] {
    return this.cervezas;
  }

  obtenerCervezaPorId(id: string): Plantilla | undefined {
    return this.cervezas.find(c => c.id === id);
  }

  obtenerPorCategoria(categoria: string): Plantilla[] {
    if (categoria === 'todas') {
      return this.cervezas;
    }
    return this.cervezas.filter(c => c.categoria === categoria);
  }
}
