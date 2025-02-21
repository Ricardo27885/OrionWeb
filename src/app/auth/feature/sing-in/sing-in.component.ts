import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../data-acces/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-sing-in',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './sing-in.component.html',
  styleUrl: './sing-in.component.css'
})
export default class SingInComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private  _http = inject(HttpClient)
  private toastr = inject(ToastrService)

  onloginForm = this._formBuilder.group({
    username: ['', [Validators.required]], // Si es necesario que sea un email
    password: ['', Validators.required],
  });

  onLogin() {
    if (this.onloginForm.invalid) {
      this.toastr.warning('Por favor, rellene todos los campos', 'Campos vacíos');
      return;
    }
  
    const username = this.onloginForm.get('username')?.value || ''; 
    const password = this.onloginForm.get('password')?.value || '';
  
    if (!username || !password) {
      this.toastr.warning('Por favor, ingrese usuario y contraseña', 'Campos vacíos');
      return;
    }
  
    this._authService.login(username, password).subscribe({
      next: (response) => {
        if (response.token) {  
          this._authService.saveToken(response.token);
          // this.getProfile();
          this.toastr.success('Bienvenido', 'Inicio de sesión exitoso');
          this._router.navigate(['api/main/usuarios']);
        } else {
          this.toastr.error('No se recibió un token', 'Error de autenticación');
        }
      },
      error: (error) => {
        console.error('Error en la autenticación', error);
        this.toastr.error('Usuario o contraseña incorrectos', 'Error de autenticación');
      },
      complete: () => {
        console.log('La autenticación ha finalizado');
      }
    });
  }
  

//   // Servicio para hacer peticiones protegidas
// getProfile() {
//   const token = localStorage.getItem('authToken');
//   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

//   return this._http.get('https://dockerapi-1yw3.onrender.com/api/profile', { headers });
// }
  

}
