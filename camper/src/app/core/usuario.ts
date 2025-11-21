import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Usuario {
  private apiUrl = 'https://camperapi.onrender.com/api/public/auth';

  constructor(private http: HttpClient) {}

  registrarUsuario(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, datos);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }
}


