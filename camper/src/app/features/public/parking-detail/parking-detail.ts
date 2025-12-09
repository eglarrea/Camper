import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ParkingService } from '../../../core/services/parking';
import { Parking } from '../../../core/models/parking';

@Component({
  selector: 'app-parking-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './parking-detail.html',
  styleUrls: ['./parking-detail.scss']
})
export class ParkingDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private parkingService = inject(ParkingService);

  parking: Parking | null = null;
  isLoading = true;
  errorMessage = '';

  ngOnInit() {
    const parkingId = this.route.snapshot.paramMap.get('id');

    if (parkingId) {
      this.loadParkingDetails(parkingId);
    } else {
      this.errorMessage = 'ID de parking no válido';
      this.isLoading = false;
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
        console.error('Error loading parking details:', err);
        this.errorMessage = 'No se pudo cargar la información del parking.';
        this.isLoading = false;
      }
    });
  }
}