import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = 'http://localhost:8000/api'; // Cambia si usas otro puerto o dominio

  constructor(private http: HttpClient) { }


    // Método para obtener todos los usuarios
    getAllUsers(): Observable<User[]> {
      return this.http.get<User[]>(`${this.apiUrl}/usuarios`);
    }
  
    // Método para obtener un usuario por su ID
    getUserById(idUsuario: number): Observable<User> {
      const url = `${this.apiUrl}/${idUsuario}`;
      return this.http.get<User>(url);
    }
}
