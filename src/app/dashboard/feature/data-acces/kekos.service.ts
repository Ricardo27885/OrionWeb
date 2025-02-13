import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KekosService {
  
  private apiUrl = 'https://dockerapi-1yw3.onrender.com/api'; // Cambia si usas otro puerto o dominio

  constructor(private http: HttpClient) { }

  // 🔹 Obtener todos los Kekos
  getKekos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/kekos`);
  }

  // 🔹 Obtener un Keko por ID
  getKekoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/kekos/${id}`);
  }

  getKekosfilter(searchTerm: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/kekos?search=${searchTerm}`);
}

  // 🔹 Crear un nuevo Keko
  createKeko(keko: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/kekos`, keko);
  }

  // 🔹 Actualizar un Keko por ID
  updateKeko(id: number, keko: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/kekos/${id}`, keko);
  }
}
