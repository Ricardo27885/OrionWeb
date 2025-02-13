import { Component, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter, inject, ChangeDetectorRef, Input } from '@angular/core'; // Ajusta el path si es necesario
import 'bootstrap';  // No hace falta importar nada por defecto
import { KekosService } from '../../dashboard/feature/data-acces/kekos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-modal-agregar-keko',
  imports:[CommonModule, FormsModule],
  templateUrl: './modal-agregar-keko.component.html',
  styleUrls: ['./modal-agregar-keko.component.css']
})
export class ModalAgregarKekoComponent implements AfterViewInit  {
  private _kekosService = inject(KekosService);
  @Output() addData = new EventEmitter<void>();
  nuevoKeko = { nombre: '' };
  private modalInstance: any;

  @ViewChild('modalAgregarKeko', { static: false }) modalElement!: ElementRef;

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.modalElement) {
        this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
      } else {
        console.error('❌ No se encontró el modal en el DOM después de esperar.');
      }
    });
  }

  open() {
    if (this.modalInstance) {
      this.modalInstance.show();
    } else {
      console.error('❌ No se pudo abrir el modal porque no está inicializado.');
    }
  }

  close() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }
  
  guardarKeko() {
    if (!this.nuevoKeko.nombre.trim()) {
      alert('Por favor ingrese un nombre para el Keko');
      return;
    }
    this._kekosService.createKeko(this.nuevoKeko).subscribe(() => {
      alert('Keko agregado exitosamente');
      this.nuevoKeko = { nombre: '' }; // Limpia el objeto nuevoKeko
      this.close(); // Cierra el modal
      this.addData.emit(); // Emite un evento para actualizar el componente padre
    }, error => {
      console.error('Error al agregar Keko', error);
    });
  }
}
