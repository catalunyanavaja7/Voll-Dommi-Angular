import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Inicio} from './pages/inicio/inicio';
import {Accesorios} from './components/productos/accesorios/accesorios';
import {Catalogo} from './pages/catalogo/catalogo';
import {Cervezas} from './components/productos/cervezas/cervezas';
import {Menu} from "./shared/menu/menu";
import {FooterComponent} from './shared/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu, FooterComponent],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('Voll-Dommi-Angular');
}
