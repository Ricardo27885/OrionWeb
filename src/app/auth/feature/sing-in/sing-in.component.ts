import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../data-acces/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';


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

  onloginForm = this._formBuilder.group({
    username: ['', [Validators.required]], // Si es necesario que sea un email
    password: ['', Validators.required],
  });

  onLogin() {
    if (this.onloginForm.valid) {
      const username = this.onloginForm.get('username')?.value || ''; 
      const password = this.onloginForm.get('password')?.value || '';
  
      if (username && password) {
        console.log(username);
  
        this._authService.login(username, password).subscribe({
          next: (response) => {
            console.log('Usuario autenticado', response);
  
            if (response.token) {  // Asegúrate de que la respuesta contiene el token
              this._authService.saveToken(response.token);
              console.log('Token guardado en localStorage:', response.token);
            } else {
              console.error('No se recibió un token en la respuesta');
            }
  
            // Redirigir al usuario después de autenticarse
            this._router.navigate(['api/main/usuarios']);
          },
          error: (error) => {
            console.error('Error en la autenticación', error);
          },
          complete: () => {
            console.log('La autenticación ha finalizado');
          }
        });
      } else {
        console.error('Usuario o contraseña no válidos');
      }
    }
  }
  

}
