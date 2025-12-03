import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  profileForm: FormGroup = this.fb.group({
    nombrePersona: [''],
    apellidosPersona: [''],
    dniPersona: [''],
    fecNacimientoPersona: [''],
    emailPersona: [''],
    ibanPersona: ['']
  });

  isLoading = true;
  errorMessage = '';

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.userService.getMe().subscribe({
      next: (user: User) => {
        this.profileForm.patchValue(user);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando perfil:', err);
        this.errorMessage = 'No se pudieron cargar los datos del usuario.';
        this.isLoading = false;
      }
    });
  }
}
