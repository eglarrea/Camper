import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BookingService } from '../../../core/services/booking';
import { BookingHistoryResponse } from '../../../core/models/booking';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, TranslateModule],
  templateUrl: './history.html',
  styleUrls: ['./history.scss']
})
export class History implements OnInit {
  private bookingService = inject(BookingService);
  private fb = inject(FormBuilder);

  allBookings: BookingHistoryResponse[] = [];
  filteredBookings: BookingHistoryResponse[] = [];

  isLoading = true;
  errorMessage = '';

  showQrModal = false;
  currentQrCode: string | null = null;

  filterForm: FormGroup = this.fb.group({
    fechaDesde: [''],
    fechaHasta: [''],
    nombreParking: [''],
    estado: ['']
  });

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.isLoading = true;
    this.bookingService.getHistory().subscribe({
      next: (data) => {
        this.allBookings = data.sort((a, b) => {
          return new Date(b.fecAlta).getTime() - new Date(a.fecAlta).getTime();
        });

        this.filteredBookings = [...this.allBookings];
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error loading history.';
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    const filters = this.filterForm.value;

    this.filteredBookings = this.allBookings.filter(booking => {
      let matches = true;

      if (filters.fechaDesde && booking.fecInicio) {
        matches = matches && new Date(booking.fecInicio) >= new Date(filters.fechaDesde);
      }

      if (filters.fechaHasta && booking.fecFin) {
        matches = matches && new Date(booking.fecFin) <= new Date(filters.fechaHasta);
      }

      if (filters.nombreParking) {
        const searchStr = filters.nombreParking.toLowerCase();
        const pName = booking.parkingNombre ? booking.parkingNombre.toLowerCase() : '';
        matches = matches && pName.includes(searchStr);
      }

      if (filters.estado && filters.estado !== '') {
        matches = matches && booking.estado === filters.estado;
      }

      return matches;
    });
  }

  clearFilters() {
    this.filterForm.reset({
        fechaDesde: '',
        fechaHasta: '',
        nombreParking: '',
        estado: ''
    });
    this.filteredBookings = [...this.allBookings];
  }

  cancelBooking(id: number) {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      return;
    }

    this.isLoading = true;
    this.bookingService.cancelBooking(id).subscribe({
      next: (response: any) => {
        const msg = response && (response.message || response) ? (response.message || response) : 'Reserva cancelada correctamente.';
        alert(msg);
        this.loadHistory();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;

        let errorMsg = 'Hubo un error al intentar cancelar la reserva.';
        if (err.error) {
           if (typeof err.error === 'string') {
             errorMsg = err.error;
           }
           else if (err.error.error) {
             errorMsg = err.error.error;
           }
           else if (err.error.message) {
             errorMsg = err.error.message;
           }
        }
        alert(errorMsg);
      }
    });
  }

  viewQr(id: number) {
    this.isLoading = true;
    this.bookingService.getQrCode(id).subscribe({
      next: (qrData) => {
        this.currentQrCode = qrData;
        this.showQrModal = true;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);

        let errorMsg = 'No se pudo obtener el código QR. Inténtalo de nuevo.';

        if (err.status === 400) {
            errorMsg = 'Error: No se encontró la reserva o no tienes permiso para ver este QR.';
        }

        if (err.error) {
             if (typeof err.error === 'string') {
               errorMsg = err.error;
             } else if (err.error.error || err.error.message) {
               errorMsg = err.error.error || err.error.message;
             }
        }

        alert(errorMsg);
        this.isLoading = false;
      }
    });
  }

  closeQrModal() {
    this.showQrModal = false;
    this.currentQrCode = null;
  }

  rateBooking(id: number) {
    const scoreStr = prompt('Por favor, introduce una puntuación del 0 al 10:');

    if (scoreStr === null) return;

    const score = Number(scoreStr);

    if (isNaN(score) || score < 0 || score > 10) {
      alert('Por favor introduce un número válido entre 0 y 10.');
      return;
    }

    this.isLoading = true;
    this.bookingService.rateBooking(id, score).subscribe({
      next: () => {
        alert('¡Gracias por tu valoración!');
        this.loadHistory();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        let errorMsg = 'Error al enviar la valoración.';
        if (err.error) {
           if (typeof err.error === 'string') {
             errorMsg = err.error;
           } else if (err.error.error) {
             errorMsg = err.error.error;
           } else if (err.error.message) {
             errorMsg = err.error.message;
           }
        }
        alert(errorMsg);
      }
    });
  }

  getStatusLabel(estado: string): string {
    return estado === '1' ? 'Confirmada' : 'Cancelada';
  }

  // Para las fechas del buscador
  openDatePicker(event: Event) {
    const input = event.target as HTMLInputElement;
    input.showPicker?.();
  }
}
