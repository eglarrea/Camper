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
      next: () => {
        alert('Reserva cancelada correctamente.');
        this.loadHistory(); 
      },
      error: (err) => {
        console.error(err);
        alert('Hubo un error al intentar cancelar la reserva.');
        this.isLoading = false;
      }
    });
  }

  getStatusLabel(estado: string): string {
    return estado === '1' ? 'Confirmada' : 'Cancelada';
  }
}