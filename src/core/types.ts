export type FuelType = 'gasolina' | 'diesel';

/** Una entrada del catálogo semilla: un modelo específico y sus versiones. */
export interface CatalogModel {
  id: string;
  make: string;
  model: string;
  trims: string[];
  fuelType: FuelType;
}

/** El vehículo identificado por el usuario. */
export interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  fuelType: FuelType;
  createdAt: string;
}
