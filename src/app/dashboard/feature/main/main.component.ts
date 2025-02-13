import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { KekosService } from '../data-acces/kekos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main',
  imports: [CommonModule, FormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export default class MainComponent {
   esLoginPage: boolean = false;
    searchTerm: string = '';
    nombre: string = '';
    currentPage: number = 1;
    itemsPerPage: number = 5;
    columns: string[] = ['idKeko', 'Nombre'];
    data: any[] = [];
    filteredData: any[] = [];
    paginatedData: any[] = [];
    isEdit: boolean = false;
    currentItem: any;
    isModalOpen: boolean = false;  // Control del estado del modal
    idToEdit: any;
    
  
    constructor(
      private router: Router,
      private _kekosService: KekosService
    ) {
      this.router.events.subscribe(() => {
        this.esLoginPage = this.router.url === '/api/signIn';
      });
  
      // Llamar al servicio para obtener los Kekos
      this.loadKekos();
    }
  
    loadKekos() {
      this._kekosService.getKekos().subscribe((data) => {
        this.data = data;
        this.filteredData = [...this.data];
        this.updatePaginatedData();
      });
    }
  
    applyFilter() {
      if (this.searchTerm.trim() === '') {
        this.filteredData = [...this.data];
      } else {
        const term = this.searchTerm.toLowerCase();
        this.filteredData = this.data.filter(item =>
          item.nombre.toLowerCase().includes(term)
        );
      }
      this.currentPage = 1;
      this.updatePaginatedData();
    }
  
    updatePaginatedData() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedData = this.filteredData.slice(startIndex, endIndex);
    }
  
    pageChanged(event: number) {
      this.currentPage = event;
      this.updatePaginatedData();
    }
  
    openModal(mode: string, item: any = null) {
      this.isEdit = mode === 'edit';
      if (this.isEdit) {
        // Si es edición, obtenemos los datos del Keko por su ID
        this.idToEdit = item.idKeko;  // Asignamos el ID del Keko que queremos editar
  
        // Llamada al servicio para obtener el Keko por ID
        this._kekosService.getKekoById(this.idToEdit).subscribe(
          (kekoData) => {
            this.nombre = kekoData.nombre; // Asignamos el nombre del Keko al input
            this.currentItem = kekoData; // Guardamos el Keko completo si necesitas acceder a más detalles
          },
          (error) => {
            console.error('Error al obtener el Keko:', error);
          }
        );
      } else {
        this.nombre = '';  // Limpiar el campo si es agregar
        this.currentItem = null;  // Limpiar el item actual
      }
      this.isModalOpen = true;  // Abrimos el modal
    }
  
    closeModal() {
      this.isModalOpen = false;  // Cierra el modal
    }
  
    saveKeko() {
      if (this.isEdit) {
        // Si estamos editando, actualizamos el "Keko"
        this.currentItem.nombre = this.nombre;  // Asegúrate de usar `kekoName` como la variable que contiene el nombre
        this._kekosService.updateKeko(this.currentItem.idKeko, this.currentItem).subscribe(
          () => {
            this.loadKekos();  // Recargar los Kekos
            alert('Keko actualizado correctamente!');  // Mensaje de éxito
          },
          (error) => {
            console.error('Error al actualizar Keko', error);
            alert('Hubo un error al actualizar el Keko');
          }
        );
      } else {
        // Si estamos agregando, creamos un nuevo "Keko"
        const newKeko = { idKeko: this.data.length + 1, nombre: this.nombre };
        this._kekosService.createKeko(newKeko).subscribe(
          () => {
            this.loadKekos();  // Recargar los Kekos
            alert('Keko agregado correctamente!');  // Mensaje de éxito
          },
          (error) => {
            console.error('Error al agregar Keko', error);
            alert('Hubo un error al agregar el Keko');
          }
        );
      }
      this.closeModal();  // Cerrar el modal después de guardar
    }
    
  
    goToPreviousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updatePaginatedData();
      }
    }
  
    goToNextPage() {
      if (this.currentPage < Math.ceil(this.filteredData.length / this.itemsPerPage)) {
        this.currentPage++;
        this.updatePaginatedData();
      }
    }
}
