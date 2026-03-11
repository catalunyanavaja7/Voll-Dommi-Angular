import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Quote {
  _id: string;
  content: string;
  author: string;
  tags: string[];
  authorSlug: string;
  length: number;
}

@Injectable({
  providedIn: 'root'
})
export class QuoteApiService {
  private apiUrl = '/api/quote/random';

  constructor(private http: HttpClient) {}

  // Obtener frase aleatoria
  getRandomQuote(): Observable<Quote> {
    return this.http.get<Quote>(this.apiUrl);
  }
}
