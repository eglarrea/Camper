import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BookingService } from '../../../core/services/booking';
import { Booking } from '../../../core/models/booking';
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

  allBookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  
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
        this.allBookings = data;
        this.filteredBookings = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error cargando historial.';
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    const filters = this.filterForm.value;
    
    this.filteredBookings = this.allBookings.filter(booking => {
      let matches = true;

      if (filters.fechaDesde) {
        matches = matches && new Date(booking.fechaEntrada) >= new Date(filters.fechaDesde);
      }

      if (filters.fechaHasta) {
        matches = matches && new Date(booking.fechaSalida) <= new Date(filters.fechaHasta);
      }

      if (filters.nombreParking) {
        const searchStr = filters.nombreParking.toLowerCase();
        matches = matches && booking.nombreParking.toLowerCase().includes(searchStr);
      }

      if (filters.estado) {
        matches = matches && booking.estado === filters.estado;
      }

      return matches;
    });
  }

  clearFilters() {
    this.filterForm.reset();
    this.filteredBookings = [...this.allBookings];
  }
}