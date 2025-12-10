export interface Booking {
  id: number;
  fechaRealizacion: string; 
  fechaEntrada: string;
  fechaSalida: string;
  nombreParking: string;
  estado: string;
  plazaNombre?: string; 
  precioTotal?: number;
  qrData?: string; 
}

export interface BookingFilters {
  fechaDesde?: string;
  fechaHasta?: string;
  nombreParking?: string;
  estado?: string;
}