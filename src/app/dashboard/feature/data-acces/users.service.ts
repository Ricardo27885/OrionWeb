import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = 'https://dockerapi-1yw3.onrender.com/api'; // Cambia si usas otro puerto o dominio

  constructor(private http: HttpClient) { }


    // Método para obtener todos los usuarios
    getAllUsers(): Observable<User[]> {
      return this.http.get<User[]>(`${this.apiUrl}/usuarios`);
    }
  
    createUser(user: User): Observable<User> {
      return this.http.post<User>(`${this.apiUrl}/usuarios`, user);  // Hacemos un POST a la ruta de crear usuario
    }
}
