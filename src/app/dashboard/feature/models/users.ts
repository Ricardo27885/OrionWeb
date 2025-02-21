
export interface User{
  idUsuario: number
  username: string
  password: string
  idRol: number
  activo: boolean
}

export interface UserGet{
id: number
Nombre: string
Rol: number
activo: boolean
}
export class Membresia {
    id: number | null;
    idKeko: number;
    tipo: string;
    fecha_inicio: string;
  
    constructor(id: number | null = null, idKeko: number = 0, tipo: string = '', fecha_inicio: string = '') {
      this.id = id;
      this.idKeko = idKeko;
      this.tipo = tipo;
      this.fecha_inicio = fecha_inicio;
    }
  }


export interface DetalleTiempo {
  Descripcion: string;
  EstadoTiempo: string;
  HoraInicio: string;
  HoraFin: string;
  IDDetalle: number;
}

  export interface Tiempo {
    IDCabecera: number;
    NombreKeko: string;
    NombreUsuario: string;
    Activo: boolean;
    Detalles: DetalleTiempo[];
  }