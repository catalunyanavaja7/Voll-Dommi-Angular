import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../enviroments/environment';
import { UserAuth } from '../../authz/userAuth/user-auth';

interface HistorialProducto {
  id: number;
  firebase_uid: string;
  user_email: string;
  producte_id: string | null;
  producte_nom: string;
  preu: number;
  quantitat: number;
  en_oferta: number | boolean;
  data_compra: string;
}

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './administrador.html',
  styleUrl: './administrador.css',
})
export class AdministradorComponent implements OnInit {
  private readonly apiUrl = environment.apiUrl;

  historial: HistorialProducto[] = [];
  loading = true;
  error = '';

  constructor(
    private http: HttpClient,
    private auth: UserAuth,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.auth.esAdmin()) {
      this.router.navigate(['']);
      return;
    }

    const token = this.auth.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<{ success: boolean; historial: HistorialProducto[] }>(
      `${this.apiUrl}/admin/historial`,
      { headers }
    ).subscribe({
      next: (res) => {
        this.historial = res.historial;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'No s ha pogut carregar l historial.';
        this.loading = false;
      }
    });
  }
}
