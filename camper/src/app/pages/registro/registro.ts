import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../core/usuario';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  form;
  errorMsg = '';
  constructor(private fb: FormBuilder, private usuarioService: Usuario) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      dni: [''],
      iban: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  registrar() {
    if (this.form.invalid) {
      this.errorMsg = 'Revisa los campos obligatorios';
      return;
    }

    this.usuarioService.registrarUsuario(this.form.value).subscribe({
      next: () => {
        this.errorMsg = ''; 
        alert('Usuario registrado correctamente');
      },
      error: (err) => {
        console.error('Error al registrar usuario:', err);

        if (err.error && Array.isArray(err.error)) {

          this.errorMsg = err.error.join(', ');
        } else {
          this.errorMsg = 'Error desconocido al registrar usuario';
        }
      },
    });
  }
}