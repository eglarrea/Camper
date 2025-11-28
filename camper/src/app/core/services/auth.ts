import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user'; 

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  nombrePersona: string;
  apellidosPersona: string;
  fecNacimientoPersona: string; // YYYY-MM-DD
  dniPersona: string;
  ibanPersona: string;
  emailPersona: string;
  passPersona: string;
  confirmPassPersona: string;
  admin: boolean; 
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = 'https://camperapi.onrender.com/api/public/auth';

  /*
  LOGIN
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => this.saveSession(response))
    );
  }

  /*
  REGISTRO
   */
  register(data: RegisterRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/register`, data, { 
      responseType: 'text' 
    });
  }

  /* 
  Guarda token y usuario en el navegador
   */
  private saveSession(data: LoginResponse): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  /*
  Cierra sesión y redirige al login
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login-client']);
  }

  /*
  Devuelve true si hay un token guardado
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  /*
  Recupera el objeto usuario completo
   */
  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}