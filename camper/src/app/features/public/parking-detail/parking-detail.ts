import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ParkingService } from '../../../core/services/parking';
import { Parking, Plaza } from '../../../core/models/parking';
import { Auth } from '../../../core/services/auth';
import { BookingService } from '../../../core/services/booking';
import { BookingRequest } from '../../../core/models/booking';

@Component({
  selector: 'app-parking-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './parking-detail.html',
  styleUrls: ['./parking-detail.scss']
})
export class ParkingDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private parkingService = inject(ParkingService);
  private authService = inject(Auth);
  private bookingService = inject(BookingService);

  parking: Parking | null = null;
  selectedSpot: Plaza | null = null; 
  isLoading = true;
  errorMessage = '';
  
  entryDate: string = '';
  exitDate: string = '';

  ngOnInit() {
    const parkingId = this.route.snapshot.paramMap.get('id');
    this.route.queryParams.subscribe(params => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      this.entryDate = params['fechaDesde'] || today.toISOString().split('T')[0];
      this.exitDate = params['fechaHasta'] || tomorrow.toISOString().split('T')[0];
    });
    if (parkingId) {
      this.loadParkingDetails(parkingId);
    }
  }

  loadParkingDetails(id: string) {
    this.isLoading = true;
    this.parkingService.getParkingById(id).subscribe({
      next: (data) => {
        this.parking = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error loading parking details.';
        this.isLoading = false;
      }
    });
  }

  get spots(): Plaza[] {
    return this.parking?.plazasResponse || this.parking?.plazas || [];
  }

  get totalPrice(): number {
    if (!this.selectedSpot || !this.entryDate || !this.exitDate) return 0;
    
    const start = new Date(this.entryDate);
    const end = new Date(this.exitDate);
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return (diffDays+1) * this.selectedSpot.precio;
  }

  selectSpot(spot: Plaza) {
    if (spot.estado !== '0') return;
    this.selectedSpot = spot;
  }

  onBook() {
    if (!this.selectedSpot) return;

    if (!this.authService.isLoggedIn()) {
      const confirmLogin = confirm('Para reservar necesitas iniciar sesión. ¿Ir al login?');
      if (confirmLogin) {
        this.router.navigate(['/auth/login-client']);
      }
      return;
    }

    const user = this.authService.getUser();
    if (!user?.ibanPersona) {
      const confirmProfile = confirm('Necesitas tener un IBAN registrado para reservar. ¿Ir a "Mis Datos" para añadirlo?');
      if (confirmProfile) {
        this.router.navigate(['/client/profile']);
      }
      return;
    }

    if (!confirm(`Vas a reservar la plaza ${this.selectedSpot.nombre}. Precio Total: ${this.totalPrice}€. Fechas: ${this.entryDate} a ${this.exitDate}. ¿Confirmar?`)) {
      return;
    }

    this.isLoading = true;
    const bookingData: BookingRequest = {
      idPlaza: this.selectedSpot.id,
      idParking: this.parking!.id, 
      fecInicio: this.entryDate, 
      fecFin: this.exitDate     
    };

    this.bookingService.createBooking(bookingData).subscribe({
      next: (res) => {
        alert('¡Reserva realizada con éxito!');
        this.router.navigate(['/client/history']);
      },
      error: (err) => {
        console.error(err);
        alert('Hubo un error al realizar la reserva.');
        this.isLoading = false;
      }
    });
  }
}