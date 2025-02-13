import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {
  private apiUrl = 'https://dockerapi-1yw3.onrender.com/api'; // URL del backend

  constructor(private http: HttpClient) {}

  // Insertar o actualizar una membresía
  guardarMembresia(membresia: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/membership`, membresia);
  }

  getAllMembresias(): Observable<any> {
    return this.http.get(`${this.apiUrl}/membership`);
  }

  // Obtener membresía por ID
  getMembresiaById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/membership/${id}`);
  }
}
