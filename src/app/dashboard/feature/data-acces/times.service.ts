import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimesService {
  private apiUrl = 'https://dockerapi-1yw3.onrender.com/api'; // URL de tu API

  constructor(private http: HttpClient) { }

  createTime(idKeko: number, idUsuario: number): Observable<any> {
    const body = { idKeko, idUsuario };  // Datos a enviar
    return this.http.post<any>(`${this.apiUrl}/time`, body);
  }

  getAllTiempos(idUsuario: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/time/all/${idUsuario}`).pipe(
      map(response => {
        const agrupados: { [key: number]: any } = {};
        
        response.forEach(item => {
          if (!agrupados[item.IDCabecera]) {
            agrupados[item.IDCabecera] = {
              IDCabecera: item.IDCabecera,
              NombreKeko: item.NombreKeko,
              NombreUsuario: item.NombreUsuario,
              Activo: item.Activo,
              Detalles: []
            };
          }
          
          // Agregar el detalle correspondiente a la cabecera
          agrupados[item.IDCabecera].Detalles.push({
            IDDetalle: item.IDDetalle,
            Descripcion: item.Descripcion,
            HoraInicio: item.HoraInicio,
            HoraFin: item.HoraFin,
            EstadoTiempo: item.EstadoTiempo
          });
        });

        return Object.values(agrupados);
      })
    );
  }

  // Obtener los tiempos de hoy por ID de usuario
  getTiemposByUsuario(idUsuario: number): Observable<any[]> {  
    return this.http.get<any[]>(`${this.apiUrl}/time/${idUsuario}`).pipe(
      map(response => {
        const agrupados: { [key: number]: any } = {};
  
        response.forEach(item => {
          if (!agrupados[item.IDCabecera]) {
            agrupados[item.IDCabecera] = {
              IDCabecera: item.IDCabecera,
              NombreKeko: item.NombreKeko,
              NombreUsuario: item.NombreUsuario,
              Activo: item.Activo,
              Detalles: []
            };
          }
  
          // Agregar el detalle correspondiente a la cabecera
          agrupados[item.IDCabecera].Detalles.push({
            IDDetalle: item.IDDetalle,
            Descripcion: item.Descripcion,
            HoraInicio: item.HoraInicio,
            HoraFin: item.HoraFin,
            EstadoTiempo: item.EstadoTiempo
          });
        });
  
        return Object.values(agrupados);
      })
    );
  }

  obtenerUltimoHoraFin(idCabecera: number): Observable<any> {
    const url = `${this.apiUrl}/time/ultimoHoraFin/${idCabecera}`;
    return this.http.get<any>(url); // Realiza una solicitud GET al backend
  }

  iniciarDetalle(idCabecera: number, descripcion: string, horaInicio: string): Observable<any> {
    const body = { idCabecera, descripcion, horaInicio };
    return this.http.post(`${this.apiUrl}/time/iniciar`, body).pipe(
      catchError(this.handleError)
    );
  }

  cancelarDetalle(idDetalle: number, idCabecera: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/time/cancelar/${idDetalle}/${idCabecera}`).pipe(
      catchError(this.handleError)
    );
  }

  finalizarDetalle(idDetalle: number, idCabecera: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/time/finalizar/${idDetalle}/${idCabecera}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  actualizarTiempos(idCabecera: number, idDetalle: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/time/actualizar/${idDetalle}/${idCabecera}`, {});
  }

  private handleError(error: any) {
    console.error('Error en el servicio:', error);
    return throwError(() => new Error('Ocurrió un error en el servicio.'));
  }
}
