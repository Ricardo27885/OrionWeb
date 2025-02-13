import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export  class AuthService {

  private apiUrl = 'http://localhost:8000/api' // Asegúrate de que sea la URL correcta de tu API

  private tokenKey = 'authToken';
  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    const body = { username, password }; // Cuerpo de la solicitud con las credenciales
    return this.http.post<any>(`${this.apiUrl}/signIn`, body).pipe(
      // Puedes agregar operadores RxJS aquí para manejar la respuesta y errores
      catchError((error) => {
        console.error('Error en la autenticación:', error);
        throw error; // Lanza el error para que lo maneje quien llame al método
      })
    );
  }

   // Método para guardar el token en el localStorage o cookies
   saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Método para obtener el token desde el localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token  !== null && !this.isTokenExpired(token); // Si hay un token, el usuario está autenticado
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convertir a milisegundos
      return Date.now() > exp;
    } catch (e) {
      return true; // Si hay error, asumir que está expirado
    }
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/api/signIn']); 
  }

  decodeToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica el payload
      return payload;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  getUserName(): string | null {
    const decodedToken = this.decodeToken();
    return decodedToken?.username || null; // Ajusta según la estructura de tu JWT
  }

  getUserId(): string | null {
    const decodedToken = this.decodeToken();
    return decodedToken?.idUsuario || null;
  }

}

