import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-cervezas',
  imports: [RouterLink,CommonModule],
  templateUrl: './cervezas.html',
  styleUrl: './cervezas.css',
})
export class Cervezas {

}
