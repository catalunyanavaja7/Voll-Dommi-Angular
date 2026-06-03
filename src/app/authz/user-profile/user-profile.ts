import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserAuth } from '../userAuth/user-auth';

interface Usuario {
  uid: string;
  nom: string;
  cognoms: string;
  email: string;
  emailVerificat: boolean;
  createdAt: string;
  updatedAt: string;
  adreca?: string;
  telefon?: string;
}

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
  standalone: true
})
export class UserProfile {

  Usuari: Usuario | null;

  // Modo de edición
  editant: boolean = false;

  // Campos formulario
  nomEdit: string = '';
  cognomsEdit: string = '';
  adrecaEdit: string = '';

  constructor(private auth: UserAuth) {
    this.Usuari = auth.obtenerUsuarioLogueado();
  }

  // Metodo activar edicion
  activarEdicio(): void {
    this.nomEdit     = this.Usuari?.nom     || '';
    this.cognomsEdit = this.Usuari?.cognoms || '';
    this.adrecaEdit  = this.Usuari?.adreca  || '';
    this.editant = true;
  }

  // Cancela sin guardar
  cancelarEdicio(): void {
    this.editant = false;
  }

  // Guarda los cambios en el backend y actualiza los cambios
  guardarCanvis(): void {
    if (!this.nomEdit.trim()) {
      alert('El nombre no puede estar vacio maquina');
      return;
    }

    const dades = {
      nom:     this.nomEdit.trim(),
      cognoms: this.cognomsEdit.trim(),
      adreca:  this.adrecaEdit.trim(),
    };

    this.auth.actualizarPerfil(dades);

    // Actualizar la lista inmediatamente
    if (this.Usuari) {
      this.Usuari.nom     = dades.nom;
      this.Usuari.cognoms = dades.cognoms;
      this.Usuari.adreca  = dades.adreca;
    }

    this.editant = false;
  }
}
