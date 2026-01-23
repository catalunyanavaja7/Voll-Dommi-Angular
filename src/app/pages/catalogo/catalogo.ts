import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {Menu} from '../../shared/menu/menu';

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

}
