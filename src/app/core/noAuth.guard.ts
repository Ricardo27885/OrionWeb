import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/feature/data-acces/auth.service';


@Injectable({
    providedIn: 'root',
  })
  export class NoAuthGuard implements CanActivate {
    constructor(private _authService: AuthService, private router: Router) {}
  
    canActivate(): boolean {
      if (this._authService.isAuthenticated()) {
        this.router.navigate(['/api/main/usuarios']); // Redirige al dashboard si ya está autenticado
        return false;
      }
      return true;
    }
  }
