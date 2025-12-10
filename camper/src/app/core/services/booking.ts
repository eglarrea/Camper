import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = 'https://camperapi.onrender.com/api';

  /**
   * Ver historial de reservas completo
   * GET /historico/listado
   */
  getHistory(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/historico/listado`);
  }

  /**
   * Ver detalles de reserva específica
   * GET /reserva/:id
   */
  getBookingById(id: string | number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/reserva/${id}`);
  }

  /**
   * Cancelar reserva
   */
  cancelBooking(id: number): Observable<any> {
    const body = { idReserva: id };
    return this.http.put(`${this.apiUrl}/reserva/cancelar`, body);
  }

  /**
   * Realizar reserva
   * POST /public/reserva/reservar
   */
  createBooking(bookingData: { idPlaza: number, fechaEntrada: string, fechaSalida: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/public/reserva`, bookingData, { responseType: 'text' });
  }
}