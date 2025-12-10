import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ParkingService } from '../../../core/services/parking';
import { Parking, Plaza } from '../../../core/models/parking';
import { Auth } from '../../../core/services/auth';
import { BookingService } from '../../../core/services/booking';

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
  
  entryDate = '2025-12-09';
  exitDate = '2025-12-10';

  ngOnInit() {
    const parkingId = this.route.snapshot.paramMap.get('id');
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

    if (!confirm(`Vas a reservar la plaza ${this.selectedSpot.nombre} por ${this.selectedSpot.precio}€. ¿Confirmar?`)) {
      return;
    }

    this.isLoading = true;
    const bookingData = {
      idPlaza: this.selectedSpot.id,
      fechaEntrada: this.entryDate, 
      fechaSalida: this.exitDate
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