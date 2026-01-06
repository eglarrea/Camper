import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../../core/services/booking';
import { Booking } from '../../../core/models/booking';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './booking-detail.html',
  styleUrls: ['./booking-detail.scss']
})
export class BookingDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookingService = inject(BookingService);

  booking: any | null = null;
  isLoading = true;
  errorMessage = '';

  showQrModal = false;
  currentQrCode: string | null = null;

  showRateModal = false;
  rateValue = 5;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBooking(id);
    } else {
      this.router.navigate(['/client/history']);
    }
  }

  loadBooking(id: string) {
    this.isLoading = true;

    this.bookingService.getBookingById(id).subscribe({
      next: (data) => {
        this.booking = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'HISTORY_DETAIL.ERRORS.LOADING';
        this.isLoading = false;
      }
    });
  }

  cancelBooking() {
    if (!this.booking) return;

    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      return;
    }

    this.isLoading = true;
    this.bookingService.cancelBooking(this.booking.id).subscribe({
      next: (response: any) => {
        const msg = 'Reserva cancelada correctamente.';
        alert(msg);
        this.loadBooking(this.booking.id);
      },
      error: (err) => {
        if (err.status === 200) {
           alert('Reserva cancelada correctamente.');
           this.loadBooking(this.booking.id);
        } else {
           this.handleError(err, 'Hubo un error al intentar cancelar la reserva.');
           this.isLoading = false;
        }
      }
    });
  }

  viewQr() {
    if (!this.booking) return;
    this.isLoading = true;

    this.bookingService.getQrCode(this.booking.id).subscribe({
      next: (qrBase64) => {
        this.currentQrCode = qrBase64;
        this.showQrModal = true;
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError(err, 'No se pudo obtener el código QR.', true);
        this.isLoading = false;
      }
    });
  }

  rateBooking() {
    this.rateValue = 5;
    this.showRateModal = true;
  }

  confirmRating() {
    if (!this.booking) return;

    this.isLoading = true;
    this.showRateModal = false;

    this.bookingService.rateBooking(this.booking.id, this.rateValue).subscribe({
      next: (response: any) => {
        const msg = '¡Gracias por tu valoración!';
        alert(msg);
        this.loadBooking(this.booking.id);
      },
      error: (err) => {
        if (err.status === 200) {
           alert('¡Gracias por tu valoración!');
           this.loadBooking(this.booking.id);
        } else {
           this.handleError(err, 'Hubo un error al intentar valorar el parking.');
           this.isLoading = false;
        }
      }
    });
  }

  closeQrModal() {
    this.showQrModal = false;
    this.currentQrCode = null;
  }

  goBack() {
    this.router.navigate(['/client/history']);
  }

  private handleError(err: any, defaultMsg: string, isQr = false) {
    console.error(err);
    let errorMsg = defaultMsg;

    if (isQr && err.status === 400) {
       errorMsg = 'Error: No se encontró la reserva o no tienes permiso para ver este QR.';
    }

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

  getStatusLabel(estado: string): string {
    return estado === '1' ? 'HISTORY_DETAIL.CONFIRMED' : 'HISTORY_DETAIL.CANCELLED';
  }
}
