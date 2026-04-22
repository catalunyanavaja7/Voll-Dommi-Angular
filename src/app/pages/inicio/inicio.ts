import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NuevaApiService, Frase } from '../../services/nueva-api';
import { UserAuth } from '../../authz/userAuth/user-auth';

import * as tmImage from '@teachablemachine/image';

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
    private elementRef: ElementRef,
    private auth: UserAuth   // ← esta línea es la que falta
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
    console.log('¿Logueado?', this.auth.estaLogueado());
    console.log('Token:', this.auth.getToken());

    if (this.auth.estaLogueado()) {
      console.log('Iniciant vigilància...');
      this.iniciarVigilancia();
    } else {
      console.warn('No s\'ha iniciat la IA perquè l\'usuari no està logueado');
    }
  }

  @ViewChild('webcamVideo') webcamVideoRef!: ElementRef<HTMLVideoElement>;

  private readonly MODEL_URL = 'https://teachablemachine.withgoogle.com/models/fyxtP_jEn/';

  private model: tmImage.CustomMobileNet | null = null;
  private webcam: tmImage.Webcam | null = null;

  private comptadorDedoMig = 0;
  private readonly DETECCIONS_PER_TANCAR = 2;

  private detectant = false;


  private async iniciarVigilancia(): Promise<void> {
    try {
      const modelURL   = this.MODEL_URL + 'model.json';
      const metadataURL = this.MODEL_URL + 'metadata.json';
      this.model = await tmImage.load(modelURL, metadataURL);

      this.webcam = new tmImage.Webcam(200, 200, true);
      await this.webcam.setup();
      await this.webcam.play();

      const container = this.elementRef.nativeElement.querySelector('#webcam-container');
      if (container) container.appendChild(this.webcam.canvas);

      this.detectant = true;
      this.buclePrediccio();

      console.log('👁️ IA vigilant activa');
    } catch (err) {
      console.warn('⚠️ No s ha pogut iniciar la càmera de vigilància:', err);
    }
  }

  private async buclePrediccio(): Promise<void> {
    while (this.detectant && this.model && this.webcam) {
      this.webcam.update();

      const prediccions = await this.model.predict(this.webcam.canvas);

      const dedoMig = prediccions.find(p => p.className === 'Obsceno');

      if (dedoMig && dedoMig.probability > 0.99) {
        this.comptadorDedoMig++;
        console.log(`Gest detectat (${this.comptadorDedoMig}/${this.DETECCIONS_PER_TANCAR})`);

        if (this.comptadorDedoMig >= this.DETECCIONS_PER_TANCAR) {
          this.detectant = false;
          this.webcam.stop();
          console.log('Tancant sessió per gest no amigable...');
          alert('Comportament no permès detectat. Sessió tancada.');
          this.auth.logout();
          return;
        }
      } else {
        this.comptadorDedoMig = 0;
      }

      await this.esperar(500);
    }
  }

  private esperar(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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
