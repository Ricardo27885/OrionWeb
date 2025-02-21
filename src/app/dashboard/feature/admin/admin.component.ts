import { Component } from '@angular/core';
import { User } from '../models/users';
import { UsersService } from '../data-acces/users.service';
import { AuthService } from '../../../auth/feature/data-acces/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export default class AdminComponent {

  user: User = {
    idUsuario: 0,  // O null si lo prefieres
    username: '',
    password: '',
    idRol: 1,  // Valor por defecto
    activo: true  // Valor por defecto
  };
  idUsuario: number | undefined;

  users: User[] = [];
  constructor(private _userService: UsersService,    private _auth: AuthService) {}

  ngOnInit(): void {
    this.getUsers(); // Obtener todos los usuarios al iniciar el componente
    this.idUsuario = Number(this._auth.getUserId());
  }

  isVisitor(): boolean {
    return this.idUsuario === 6; // Comparar como número
  }

  // Obtener todos los usuarios
  getUsers(): void {
    this._userService.getAllUsers().subscribe((data: any) => {
      this.users = data;
    });
  }

  // Enviar el formulario (insertar o actualizar)
  onSubmit(): void {
    if (this.idUsuario === 6 ) {
      return; // No hacer nada si el botón está deshabilitado
    }
    this._userService.createUser(this.user).subscribe(
      (response) => {
        console.log('Usuario creado exitosamente', response);
        this.getUsers()
        // Aquí puedes agregar lógica para redirigir o mostrar un mensaje
      },
      (error) => {
        console.error('Error al crear usuario', error);
      }
    );
  }

  // Editar usuario (llenar el formulario con los datos del usuario)
  editUser(user: User): void {
    this.user = { ...user }; // Copiar los datos del usuario a editar en el formulario
  }

  // Resetear el formulario
  resetForm(): void {
    this.user = { idUsuario: 0, username: '', password: '', idRol: 1, activo: true };
  }
}
