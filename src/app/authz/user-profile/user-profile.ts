import { Component } from '@angular/core';
import {UserAuth} from '../userAuth/user-auth';

interface Usuario {
  uid: string;
  nom: string;
  cognoms: string;
  email: string;
  emailVerificat: boolean;
  createdAt: string;
  updatedAt: string;
  direccion: string;
}

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
  standalone: true
})
export class UserProfile {

  Usuari : Usuario | null

  constructor(private auth: UserAuth) {
    this.Usuari = auth.obtenerUsuarioLogueado()
  }
}
