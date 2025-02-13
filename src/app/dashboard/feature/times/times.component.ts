import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { KekosService } from '../data-acces/kekos.service';
import { catchError, debounceTime, distinctUntilChanged, from, Observable, of, startWith, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AuthService } from '../../../auth/feature/data-acces/auth.service';
import { TimesService } from '../data-acces/times.service';
import { ToastrService } from 'ngx-toastr';
import { MembershipService } from '../data-acces/membership.service';
import { DetalleTiempo, Membresia } from '../models/users';

@Component({
  selector: 'app-times',
  imports: [MatTabsModule, FormsModule, ReactiveFormsModule, CommonModule, MatInputModule, MatAutocompleteModule],
  templateUrl: './times.component.html',
  styleUrl: './times.component.css'
})
export default class TimesComponent {
  currentDateTime: string = '';
  searchTerm: string = '';
  filteredKekos: any[] = [];
  selectedKeko: any | null = null;
  username: string = '';
  idUsuario: number | undefined;
  tiempos: any[] = [];
  tiemposbyId: any[] = [];
  detallesVisibles: { [key: number]: boolean } = {};
  detallesVisiblesOtro: { [key: number]: boolean } = {};
  currentTime: string = new Date().toISOString(); 
  membresias: any[] = [];
  selectedMembresia: any = { idKeko: '', tipo: '', fecha_inicio: null };
  kekos: any[] = [];
  searchTermeber: string = '';




  constructor(private _kekosService: KekosService, private _auth: AuthService, private _timeService: TimesService, private toastr: ToastrService,
    private _membershipService: MembershipService
  ) {
   
  }

  ngOnInit() {
    this.username = this._auth.getUserName() || 'Usuario Desconocido';
    this.idUsuario = Number(this._auth.getUserId());
    this.setCurrentTime();
    this.obtenerTiempos();
    this.getTiempos(this.idUsuario);
    this.getMembresias();
    this.getKekos(); 
 
  }



  // setCurrentTime() {
  //   setInterval(() => {
  //     const now = new Date();
  //     const hours = String(now.getHours()).padStart(2, '0');
  //     const minutes = String(now.getMinutes()).padStart(2, '0');
  //     this.currentDateTime = `${hours}:${minutes}`;
  //   }, 1000); // Se actualiza cada segundo
  // }

  setCurrentTime() {
    setInterval(() => {
      const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      this.currentDateTime = now;
    }, 1000);
  }

  getFilteredKekos() {
    if (this.searchTerm.trim().length === 0) {
      this.filteredKekos = [];
      return;
    }

    this._kekosService.getKekosfilter(this.searchTerm)
      .pipe(debounceTime(300), distinctUntilChanged())  // Optimización para evitar spam de peticiones
      .subscribe(kekos => {
        this.filteredKekos = kekos.filter(keko =>
          keko.Nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
  }

  selectKeko(keko: any) {
    this.selectedKeko = keko;
    this.filteredKekos = [];
    this.searchTerm = keko.Nombre; // Muestra el nombre en el input
  }

  guardarDatos() {
    if (!this.selectedKeko || !this.idUsuario) {
      this.toastr.warning('Debe seleccionar un Keko y estar autenticado', 'Advertencia');
      return;
    }

    this._timeService.createTime(this.selectedKeko.idKeko, this.idUsuario).subscribe({
      next: (response) => {
        this.toastr.success('Registro guardado correctamente', 'Éxito');
        this.searchTerm = '';
        if (this.idUsuario !== undefined) {
          this.getTiempos(this.idUsuario); // Actualiza los tiempos si es necesario
        }
        this.obtenerTiempos(); // Actualiza los tiempos
      },
      error: (error) => {
        this.toastr.error('Error al guardar el registro', 'Error');
        console.error('Error al guardar', error);
      }
    });
  }

  obtenerTiempos() {
    this._timeService.getAllTiempos().subscribe(data => {
      this.tiempos = data;
      console.log(data);
    });
  }

  getTiempos(idUsuario: number): void {
    this._timeService.getTiemposByUsuario(idUsuario).subscribe(
      (data) => {
        this.tiemposbyId = data.map((tiempo: { Detalles: DetalleTiempo[] }) => ({
          ...tiempo,
          Detalles: tiempo.Detalles.map((detalle: DetalleTiempo) => ({
            ...detalle,
            HoraInicio: this.convertirHoraUTC(detalle.HoraInicio)
          }))
        }));
        console.log(this.tiemposbyId);
      },
      (error) => {
        console.error('Error al obtener los tiempos:', error);
      }
    );
  }
  
  
  convertirHoraUTC(fechaISO: string): string {
    if (!fechaISO) return '';
  
    const fecha = new Date(fechaISO);
    const horas = fecha.getUTCHours().toString().padStart(2, '0');  // Asegura formato 2 dígitos
    const minutos = fecha.getUTCMinutes().toString().padStart(2, '0');
  
    return `${horas}:${minutos}`;
  }
  
 

  // Alternar la visibilidad de los detalles
  toggleDetalles(IDCabecera: number, lista: string): void {
    if (lista === 'hoy') {
      this.detallesVisibles[IDCabecera] = !this.detallesVisibles[IDCabecera];
    } else if (lista === 'otro') {
      this.detallesVisiblesOtro[IDCabecera] = !this.detallesVisiblesOtro[IDCabecera];
    }
  }

  addDetail(IDCabecera: number): void {
    const tiempo = this.tiemposbyId.find(t => t.IDCabecera === IDCabecera);

    if (tiempo && tiempo.Detalles && tiempo.Detalles.length < 3) {
        const lastDetail = tiempo.Detalles.length > 0 ? tiempo.Detalles[tiempo.Detalles.length - 1] : null;


        // const getLastHoraFin = () => {
        //     if (lastDetail && lastDetail.HoraFin) {
        //         return lastDetail.HoraFin; // Usa la HoraFin del último detalle
        //     } else {
        //         const now = new Date();
        //         return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0'); // Usa la hora actual si no hay HoraFin
        //     }
        // };

        const newDetail = {
            Descripcion: "",
            HoraInicio: "", // Usa la HoraFin del último detalle o la hora actual
            HoraFin: "",
            EstadoTiempo: ""
        };

        tiempo.Detalles.push(newDetail);
    }
}

  removeDetail(IDCabecera: number, index: number): void {
    const tiempo = this.tiemposbyId.find(t => t.IDCabecera === IDCabecera);
    
    if (tiempo && tiempo.Detalles[index].Descripcion === "") {
      tiempo.Detalles.splice(index, 1);
    }
  }


  startDetail(IDCabecera: number, index: number): void {
    const tiempo = this.tiemposbyId.find(t => t.IDCabecera === IDCabecera);
  
    if (tiempo) {
      const detalle = tiempo.Detalles[index];
  
      // La hora de inicio se toma directamente del input editado
      const horaInicio = detalle.HoraInicio; 
  
      if (horaInicio) {
        this._timeService.iniciarDetalle(IDCabecera, detalle.Descripcion, horaInicio)
          .subscribe({
            next: (iniciarRes) => {
              console.log('Detalle iniciado:', iniciarRes);
              if (this.idUsuario !== undefined) {
                this.getTiempos(this.idUsuario); // Actualiza los tiempos si es necesario
              }
              this.obtenerTiempos(); // Actualiza los tiempos
            },
            error: (iniciarErr) => console.error('Error al iniciar detalle:', iniciarErr)
          });
      } else {
        console.error('No se digitó una hora de inicio válida');
      }
    }
  }
  
  cancelDetail(IDCabecera: number, index: number): void {
    const id = this.idUsuario
    const tiempo = this.tiemposbyId.find(t => t.IDCabecera === IDCabecera);
    if (tiempo) {
      const detalle = tiempo.Detalles[index];
      this._timeService.cancelarDetalle(detalle.IDDetalle, IDCabecera)
        .subscribe({
          next: (res) => {
            console.log('Detalle cancelado:', res);
            if (id !== undefined) {
              this.getTiempos(id);
            }
            this.obtenerTiempos();
          },
          error: (err) => console.error('Error al cancelar detalle:', err)
        });
    }
  }
  
  finishDetail(IDCabecera: number, index: number): void {
    const id = this.idUsuario
    const tiempo = this.tiemposbyId.find(t => t.IDCabecera === IDCabecera);
    if (tiempo) {
      const detalle = tiempo.Detalles[index];
      this._timeService.finalizarDetalle(detalle.IDDetalle, IDCabecera)
        .subscribe({
          next: (res) => {
            // detalle.HoraFin = new Date().toISOString().slice(11, 16);
            console.log('Detalle finalizado:', res);
            if (id !== undefined) {
              this.getTiempos(id);
            }
            this.obtenerTiempos();
          },
          error: (err) => console.error('Error al finalizar detalle:', err)
        });
    }
  }

  updateTimes(idCabecera: number, idDetalle: number): void {
    this._timeService.actualizarTiempos(idCabecera, idDetalle).subscribe(
      (response) => {
        this.toastr.success('Tiempos actualizados correctamente', 'Éxito');
        if (this.idUsuario !== undefined) {
          this.getTiempos(this.idUsuario); // Actualiza los tiempos si es necesario
        }
        this.obtenerTiempos();
      },
      (error) => {
        console.error('Error al actualizar los tiempos', error);
      }
    );
  }


  areButtonsDisabled(detalle: any): { startDisabled: boolean, cancelDisabled: boolean, finishDisabled: boolean, newButtonDisabled: boolean } {
    // Verificamos si el estado es "Finalizado"
    const isFinalizado = detalle.EstadoTiempo === 'Finalizado';
    // Verificamos si el estado es "Iniciado"
    const isIniciado = detalle.EstadoTiempo === 'Iniciado';
  
    return {
      startDisabled: isFinalizado || isIniciado, // Deshabilitar el botón "Start" si es Finalizado o si el estado es "Iniciado"
      cancelDisabled: isFinalizado || !isIniciado, // Deshabilitar el botón "Cancel" si es Finalizado o si el estado no es "Iniciado"
      finishDisabled: isFinalizado || !isIniciado, // Deshabilitar el botón "Finish" si es Finalizado o si el estado no es "Iniciado"
      newButtonDisabled: isFinalizado || !isIniciado // Deshabilitar el nuevo botón si es Finalizado o Iniciado
    };
  }
  
  
  getMembresias() {
    this._membershipService.getAllMembresias().subscribe(data => {
      this.membresias = data;
    
    });
  }

  getKekos() {
    this._kekosService.getKekosfilter(this.searchTerm).subscribe(data => {
      this.kekos = data;
     
    });
  }

  onEdit(membresia: any) {
    // Copiar datos para editar
 
    this.selectedMembresia = { ...membresia };
 
   
  
    // Asegúrate de que fecha_inicio esté en el formato adecuado para el input de fecha
    if (this.selectedMembresia && this.selectedMembresia.fecha_inicio) {
      this.selectedMembresia.fecha_inicio = this.formatDateForInput(this.selectedMembresia.fecha_inicio);
    }
  }
  
  // Función para formatear la fecha al formato 'yyyy-MM-dd' para el input
  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes con dos dígitos
    const day = date.getDate().toString().padStart(2, '0'); // Día con dos dígitos
    return `${year}-${month}-${day}`;
  }

  onSave() {
    if (this.selectedMembresia.id) {
   
      // Si tiene un ID, significa que es una actualización
      this._membershipService.guardarMembresia(this.selectedMembresia).subscribe(() => {
        this.getMembresias(); // Refrescar la lista de membresías
       // Limpiar el formulario
      });
    } else {
      // Si no tiene ID, es una nueva membresía
      this._membershipService.guardarMembresia(this.selectedMembresia).subscribe(() => {
        this.getMembresias(); // Refrescar la lista de membresías
        // Limpiar el formulario
      });
    }
  }

  onSearchKeko() {
    this.getKekos();
  }


}



