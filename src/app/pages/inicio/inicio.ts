import { Component } from '@angular/core';
import {Menu} from '../../shared/menu/menu';
import {Footer} from '../../shared/footer/footer';

@Component({
    selector: 'app-inicio',
    imports: [Menu, Footer],
    templateUrl: './inicio.html',
    styleUrl: './inicio.css',
    standalone: true
})
export class Inicio {


}
