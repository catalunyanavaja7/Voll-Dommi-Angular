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

  // Mode edició
  editant: boolean = false;

  // Camps del formulari d'edició
  nomEdit: string = '';
  cognomsEdit: string = '';
  adrecaEdit: string = '';

  constructor(private auth: UserAuth) {
    this.Usuari = auth.obtenerUsuarioLogueado();
  }

  // Activa el mode edició i omple els camps amb les dades actuals
  activarEdicio(): void {
    this.nomEdit     = this.Usuari?.nom     || '';
    this.cognomsEdit = this.Usuari?.cognoms || '';
    this.adrecaEdit  = this.Usuari?.adreca  || '';
    this.editant = true;
  }

  // Cancel·la sense desar
  cancelarEdicio(): void {
    this.editant = false;
  }

  // Desa els canvis al backend i actualitza la vista
  guardarCanvis(): void {
    if (!this.nomEdit.trim()) {
      alert('El nom no pot estar buit.');
      return;
    }

    const dades = {
      nom:     this.nomEdit.trim(),
      cognoms: this.cognomsEdit.trim(),
      adreca:  this.adrecaEdit.trim(),
    };

    this.auth.actualizarPerfil(dades);

    // Actualitzar la vista localment de forma immediata
    if (this.Usuari) {
      this.Usuari.nom     = dades.nom;
      this.Usuari.cognoms = dades.cognoms;
      this.Usuari.adreca  = dades.adreca;
    }

    this.editant = false;
  }
}
