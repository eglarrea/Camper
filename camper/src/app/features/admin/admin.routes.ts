import { Routes } from '@angular/router';
import { ParkingList } from './parking-list/parking-list';

export const ADMIN_ROUTES: Routes = [
  {
    path: '', 
    redirectTo: 'parkings', 
    pathMatch: 'full'
  },
  {
    path: 'parkings', 
    component: ParkingList,
    title: 'Gestión de Parkings'
  }
];