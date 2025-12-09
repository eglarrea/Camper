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
    this.onSearch();
  }

  onSearch() {
    this.isLoading = true;
    this.errorMessage = '';

    const formVal = this.searchForm.value;

    const filters: SearchFilters = {
      fechaDesde: formVal.fechaDesde || '',
      fechaHasta: formVal.fechaHasta || '',
      localidad: formVal.localidad || '',
      provincia: formVal.provincia || '',
      tomaElectricidad: formVal.tomaElectricidad,
      limpiezaAguasResiduales: formVal.limpiezaAguasResiduales,
      plazasVip: formVal.plazasVip
    };

    this.parkingService.searchParkings(filters)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (data) => {
          this.parkings = data;
          if (this.parkings.length === 0) {
            this.errorMessage = 'No se encontraron resultados.';
          }
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Ocurrió un error al buscar parkings.';
        }
      });
  }

  clearFilters() {
    this.searchForm.reset({
      fechaDesde: '',
      fechaHasta: '',
      localidad: '',
      provincia: '',
      tomaElectricidad: false,
      limpiezaAguasResiduales: false,
      plazasVip: false
    });
    this.onSearch();
  }
}