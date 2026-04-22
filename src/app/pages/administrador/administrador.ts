import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../enviroments/environment';
import { UserAuth } from '../../authz/userAuth/user-auth';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

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
export class AdministradorComponent implements OnInit, AfterViewInit {
  private readonly apiUrl = environment.apiUrl;

  historial: HistorialProducto[] = [];
  loading = true;
  error = '';

  @ViewChild('chartBarCanvas') chartBarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartLineCanvas') chartLineCanvas!: ElementRef<HTMLCanvasElement>;

  private chartBar: Chart | null = null;
  private chartLine: Chart | null = null;

  private viewReady = false;

  constructor(
    private http: HttpClient,
    private auth: UserAuth,
    private router: Router,
    private cdr: ChangeDetectorRef   // ← añade esto
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

        this.cdr.detectChanges();
        this.crearGrafics();
      },
      error: (err) => {
        this.error = err.error?.message || 'No s ha pogut carregar l historial.';
        this.loading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    // El DOM ja està llest — si les dades ja han arribat, creem els gràfics
    this.viewReady = true;
  }

  // ─── Lògica principal dels gràfics ───────────────────────────────────────

  private crearGrafics(): void {
    this.crearGraficBarres();
    this.crearGraficLineal();
  }

  //Grafic 1
  private crearGraficBarres(): void {
    if (!this.chartBarCanvas) return;

    const dadesAgrupades: Record<string, Record<string, number>> = {};

    this.historial.forEach(item => {
      const dia = item.data_compra.substring(0, 10);
      const nom = item.producte_nom;

      if (!dadesAgrupades[dia]) dadesAgrupades[dia] = {};
      if (!dadesAgrupades[dia][nom]) dadesAgrupades[dia][nom] = 0;

      dadesAgrupades[dia][nom] += item.quantitat;
    });

    const dies = Object.keys(dadesAgrupades).sort();
    const productes = [...new Set(this.historial.map(i => i.producte_nom))];

    const colors = [
      '#c8914a', '#7a9e6e', '#6e8fba', '#c86a6a',
      '#9b7ec8', '#c8b96a', '#6abec8', '#c86aab'
    ];

    const datasets = productes.map((producte, i) => ({
      label: producte,
      data: dies.map(dia => dadesAgrupades[dia]?.[producte] ?? 0),
      backgroundColor: colors[i % colors.length],
      borderRadius: 4,
    }));

    this.chartBar?.destroy();

    this.chartBar = new Chart(this.chartBarCanvas.nativeElement, {
      type: 'bar',
      data: { labels: dies, datasets },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Quantitat venuda per producte i dia' },
          legend: { position: 'bottom' },
        },
        scales: {
          x: { stacked: false },
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    });
  }

  //Grafic 2
  private crearGraficLineal(): void {
    if (!this.chartLineCanvas) return;

    const dadesPerDia: Record<string, { oferta: number; noOferta: number }> = {};

    this.historial.forEach(item => {
      const dia = item.data_compra.substring(0, 10);
      if (!dadesPerDia[dia]) dadesPerDia[dia] = { oferta: 0, noOferta: 0 };

      if (item.en_oferta) {
        dadesPerDia[dia].oferta += item.quantitat;
      } else {
        dadesPerDia[dia].noOferta += item.quantitat;
      }
    });

    const dies = Object.keys(dadesPerDia).sort();

    this.chartLine?.destroy();

    this.chartLine = new Chart(this.chartLineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: dies,
        datasets: [
          {
            label: 'En oferta',
            data: dies.map(d => dadesPerDia[d].oferta),
            borderColor: '#c8914a',
            backgroundColor: 'rgba(200, 145, 74, 0.15)',
            tension: 0.3,   // Suavitza la línia
            fill: true,
            pointRadius: 5,
          },
          {
            label: 'Sense oferta',
            data: dies.map(d => dadesPerDia[d].noOferta),
            borderColor: '#6e8fba',
            backgroundColor: 'rgba(110, 143, 186, 0.15)',
            tension: 0.3,
            fill: true,
            pointRadius: 5,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Vendes en oferta vs sense oferta per dia' },
          legend: { position: 'bottom' },
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    });
  }
}
