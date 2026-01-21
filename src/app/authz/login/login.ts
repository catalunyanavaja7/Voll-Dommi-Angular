import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [RouterLink,CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})
export class Login {

}
