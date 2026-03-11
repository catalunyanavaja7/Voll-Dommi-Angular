import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteApiService, Quote } from '../../services/quote-api';

@Component({
    selector: 'app-inicio',
    templateUrl: './inicio.html',
    styleUrl: './inicio.css',
  standalone: true,
  imports: [CommonModule]
})

export class Inicio implements OnInit, OnDestroy {

  quote: Quote | null = null;
  loadingQuote: boolean = true;
  isFraseVisible = false;
  private quoteInterval: any;

  constructor(
    private quoteApiService: QuoteApiService
  ) {}

  ngOnInit(): void {
    this.loadQuote();
    this.quoteInterval = setInterval(() => this.reloadQuote(), 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.quoteInterval);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isFraseVisible = window.scrollY > 80;
  }

  loadQuote(): void {
    this.loadingQuote = true;
    this.quoteApiService.getRandomQuote().subscribe({
      next: (data) => {
        this.quote = data;
        this.loadingQuote = false;
        console.log('💭 Frase del día cargada:', data);
      },
      error: (error) => {
        console.error('Error al cargar frase:', error);
        this.loadingQuote = false;
      }
    });
  }

  reloadQuote(): void {
    this.loadQuote();
  }
}
