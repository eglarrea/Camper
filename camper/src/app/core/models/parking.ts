export interface Parking {
  id: number;
  nombre: string;
  descripcion?: string; 
  municipio?: string;
  localidad?: string; 
  provincia?: string;
  web?: string;
  telefono?: string;
  email?: string;
  tomaElectricidad?: boolean;
  limpiezaAguasResiduales?: boolean;
  plazasVip?: boolean;
  numeroPlazas?: number;
  activo?: boolean;
  imagen?: string; 
  plazas?: any[];
}

export interface SearchFilters {
  fechaDesde?: string; 
  fechaHasta?: string; 
  localidad?: string;
  provincia?: string;
  tomaElectricidad?: boolean;
  limpiezaAguasResiduales?: boolean;
  plazasVip?: boolean;
}