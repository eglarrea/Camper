import { Routes } from '@angular/router';
import { SearchParking } from './search-parking/search-parking';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: SearchParking,
    title: 'Buscar Parking'
  }
];