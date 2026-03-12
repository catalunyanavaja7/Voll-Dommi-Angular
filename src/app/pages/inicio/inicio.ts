import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NuevaApiService, Frase } from '../../services/nueva-api';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
  standalone: true,
  imports: [CommonModule]
})
export class Inicio implements OnInit, AfterViewInit, OnDestroy {

  quote: Frase | null = null;
  loadingQuote: boolean = true;
  private quoteInterval: any;

  constructor(
    private nuevaApiService: NuevaApiService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadQuote();
    this.quoteInterval = setInterval(() => this.reloadQuote(), 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.quoteInterval);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const fraseElement = this.elementRef.nativeElement.querySelector('#fraseDelDia');
      if (fraseElement) {
        fraseElement.classList.add('visible');
      }
    }, 100);
  }

  loadQuote(): void {
    this.loadingQuote = true;
    this.nuevaApiService.getRandomQuote().subscribe({
      next: (data) => {
        this.quote = data;
        this.loadingQuote = false;
        console.log('💭 Frase cargada desde MI API:', data);

        setTimeout(() => {
          const fraseElement = this.elementRef.nativeElement.querySelector('#fraseDelDia');
          if (fraseElement) {
            fraseElement.classList.add('visible');
          }
        }, 50);
      },
      error: (error) => {
        console.error('❌ Error:', error);
        this.loadingQuote = false;
      }
    });
  }

  reloadQuote(): void {
    this.loadQuote();
  }
}
