import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../../core/usuario';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.html', 
})
export class Login {
  form: FormGroup;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: Usuario,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.form.invalid) {
      this.errorMsg = 'Todos los campos son obligatorios';
      return;
    }

    const { email, password } = this.form.value;

    this.usuarioService.login(email!, password!).subscribe({
      next: (response) => {
        console.log('Respuesta API:', response);

        alert('Login correcto — token guardado');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error login:', err);

        if (err.error) {
          if (typeof err.error === 'string') {
            this.errorMsg = err.error; 
          } else if (err.error.message) {
            this.errorMsg = err.error.message; 
          } else {
            this.errorMsg = JSON.stringify(err.error);
          }
        } else {
          this.errorMsg = 'Error desconocido al iniciar sesión';
        }
      }

    });
  }
}

