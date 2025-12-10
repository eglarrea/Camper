import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ParkingService } from '../../../core/services/parking';
import { Parking, SearchFilters } from '../../../core/models/parking';
import { TranslateModule } from '@ngx-translate/core'; 
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-search-parking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './search-parking.html',
  styleUrls: ['./search-parking.scss']
})
export class SearchParking implements OnInit {
  private parkingService = inject(ParkingService);
  private fb = inject(FormBuilder);

  parkings: Parking[] = [];
  isLoading = false;
  errorMessage = '';

  searchForm: FormGroup = this.fb.group({
    fechaDesde: [''],
    fechaHasta: [''],
    localidad: [''],
    provincia: [''], 
    tomaElectricidad: [false],
    limpiezaAguasResiduales: [false],
    plazasVip: [false]
  });

  ngOnInit() {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
    
    this.searchForm.patchValue({
      fechaDesde: today,
      fechaHasta: tomorrow
    });

    this.onSearch();
  }

  onSearch() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return; 
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formVal = this.searchForm.value;

    const filters: any = {
      fechaDesde: formVal.fechaDesde,
      fechaHasta: formVal.fechaHasta,
      tomaElectricidad: formVal.tomaElectricidad || false,
      limpiezaAguasResiduales: formVal.limpiezaAguasResiduales || false,
      plazasVip: formVal.plazasVip || false
    };

    if (formVal.localidad && formVal.localidad.trim() !== '') {
      filters.localidad = formVal.localidad.trim();
    }

    if (formVal.provincia && formVal.provincia.trim() !== '') {
      filters.provincia = formVal.provincia.trim();
    }

    this.parkingService.searchParkings(filters)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          this.parkings = data;
          if (this.parkings.length === 0) {
            this.errorMessage = 'No se encontraron resultados.';
          }
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error de conexión al buscar parkings.';
        }
      });
  }

  getMinPrice(parking: Parking): number {
    if (!parking.plazas || parking.plazas.length === 0) return 0;
    return Math.min(...parking.plazas.map(p => p.precio));
  }

  clearFilters() {
    const currentDates = {
      fechaDesde: this.searchForm.get('fechaDesde')?.value,
      fechaHasta: this.searchForm.get('fechaHasta')?.value
    };
    
    this.searchForm.reset({
      ...currentDates,
      localidad: '',
      provincia: '',
      tomaElectricidad: false,
      limpiezaAguasResiduales: false,
      plazasVip: false
    });
    this.onSearch();
  }
}