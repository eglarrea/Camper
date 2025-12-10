import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Parking, SearchFilters } from '../models/parking';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  private http = inject(HttpClient);
  private apiUrl = 'https://camperapi.onrender.com/api/public/parking';

  /**
   * Buscar parkings con filtro específico
   * POST /find
   */
  searchParkings(filters: SearchFilters): Observable<Parking[]> {
    return this.http.post<Parking[]>(`${this.apiUrl}/find`, filters);
  }

  /**
   * Ver detalles de un parking
   * GET /:id
   */
  getParkingById(id: string | number): Observable<Parking> {
    return this.http.get<Parking>(`${this.apiUrl}/${id}`);
  }
}