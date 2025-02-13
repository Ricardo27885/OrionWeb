import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule, PaginationService } from 'ngx-pagination';
import { ModalAgregarKekoComponent } from '../modal-agregar-keko/modal-agregar-keko.component';


@Component({
  selector: 'app-generic-table',
  imports: [CommonModule, FormsModule],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.css'
})
export class GenericTableComponent {
 @ViewChild(ModalAgregarKekoComponent) modalAgregarKeko!: ModalAgregarKekoComponent;

  
ngAfterViewInit() {
  setTimeout(() => {
    if (!this.modalAgregarKeko) {
      console.error('❌ No se encontró el modal en ViewChild');
    } else {
      console.log('✅ Modal encontrado:', this.modalAgregarKeko);
    }
  });
}

  @Input() columns: string[] = []; // Recibe los nombres de las columnas
  @Input() data: any[] = [];       // Recibe los datos a mostrar
  @Input() editFunction!: (item: any) => void; // Recibe función de edición
  @Input() filterFunction!: () => void; // Función de filtrado
  @Input() addFunction!: () => void; // Función de agregar



  paginatedData: any[] = [];
  filteredData: any[] = [];
  searchTerm: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 100; // Total de elementos disponibles


  ngOnChanges() {
    this.filteredData = [...this.data]; // Copia inicial
    this.updatePaginatedData();
  }

  applyFilter() {
    if (this.searchTerm.trim() === "") {
      this.filteredData = [...this.data]; // Restablecer si está vacío
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredData = this.data.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(term) // 🔹 Convertir value a string de forma segura
        )
      );
    }
    this.currentPage = 1; // Resetear a la primera página después de filtrar
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

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }
  
  // Método para ir a la siguiente página
  goToNextPage() {
    if (this.currentPage < Math.ceil(this.totalItems / this.itemsPerPage)) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }


  
}
