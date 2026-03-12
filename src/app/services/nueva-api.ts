import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Frase {
  _id: string;
  content: string;
  author: string;
  tags: string[];
  length: number;
}

@Injectable({
  providedIn: 'root'
})
export class NuevaApiService {
  private apiUrl = 'https://apicunado.vercel.app/api';

  constructor(private http: HttpClient) {}

  getRandomQuote(): Observable<Frase> {
    return this.http.get<Frase>(`${this.apiUrl}/random`);
  }
}
