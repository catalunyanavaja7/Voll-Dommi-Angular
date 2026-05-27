import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/environment';

interface Missatge {
  text: string;
  origen: 'user' | 'bot';
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css'
})

export class ChatbotComponent {
  obert = false;
  missatges: Missatge[] = [
    { text: 'Hola! Soc el bot de Voll-Dommí. En què et puc ajudar?', origen: 'bot' }
  ];
  inputText = '';
  carregant = false;
  usuariEscrivint = false;

  @ViewChild('chatBody') chatBody!: ElementRef<HTMLDivElement>;

  constructor(private http: HttpClient) {}

  toggleChat(): void {
    this.obert = !this.obert;
  }

  onKeyDown(event: KeyboardEvent): void {
    // Actualitzem si l'usuari està escrivint
    this.usuariEscrivint = this.inputText.length > 0;
    if (event.key === 'Enter') {
      this.usuariEscrivint = false;
      this.enviarMissatge();
    }
  }

  private scrollAlFinal(): void {
    setTimeout(() => {
      if (this.chatBody) {
        this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
      }
    }, 50);
  }

  enviarMissatge(): void {
    const text = this.inputText.trim();
    if (!text || this.carregant) return;

    this.usuariEscrivint = false;
    this.missatges.push({ text, origen: 'user' });
    this.inputText = '';
    this.carregant = true;

    this.http.post<{ success: boolean; resposta: string }>(
      `${environment.apiUrl}/chat`,
      { missatge: text }
    ).subscribe({
      next: (res) => {
        this.missatges.push({ text: res.resposta, origen: 'bot' });
        this.carregant = false;
        this.scrollAlFinal();
      },
      error: () => {
        this.missatges.push({ text: 'Ho sento, hi ha hagut un error. Torna-ho a intentar.', origen: 'bot' });
        this.carregant = false;
      }
    });
  }
}
