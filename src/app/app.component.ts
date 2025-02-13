import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { KekosService } from './dashboard/feature/data-acces/kekos.service';
import { FormsModule } from '@angular/forms';
import { NgxSonnerToaster } from 'ngx-sonner';
import { AuthService } from './auth/feature/data-acces/auth.service';




@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, FormsModule, RouterLink, RouterModule, NgxSonnerToaster],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OrionFronted';
  esLoginPage: boolean = false;

  

  constructor(
    private router: Router,
    private _authService: AuthService
 
  ) {
    this.router.events.subscribe(() => {
      this.esLoginPage = this.router.url === '/api/signIn';
    });
  }

  cerrarSesion() {
    this._authService.logout();
  }

  
}
