export type FuelType = 'gasolina' | 'diesel';

export type VehicleCategory = 'sedan' | 'hatchback' | 'suv' | 'pickup';

/**
 * Una entrada del catálogo semilla: un modelo específico y sus versiones.
 * `trims` va de la más básica a la más equipada — ese orden se usa para
 * saber si el usuario tiene la versión base (ver data/accessories.ts).
 */
export interface CatalogModel {
  id: string;
  make: string;
  model: string;
  category: VehicleCategory;
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
  /** Odómetro actual. Se pide en la pantalla de Mantenimiento, no en el onboarding. */
  currentKm?: number;
}

export type MaintenanceCategory = 'fluids' | 'engine' | 'tires' | 'battery' | 'brakes' | 'timing';

/**
 * Un tipo de servicio genérico (no específico a un modelo — la curación por
 * modelo es trabajo de M2/data/specs). Todo item tiene al menos uno de
 * intervalKm/intervalMonths; el que se cumpla primero manda.
 */
export interface MaintenanceItem {
  id: string;
  name: string;
  category: MaintenanceCategory;
  intervalKm?: number;
  intervalMonths?: number;
  costDOP: { min: number; max: number };
}

export type Priority = 'urgent' | 'soon' | 'later';

/** Un registro de mantenimiento/reparación realizado, en el historial del vehículo. */
export interface HistoryEntry {
  id: string;
  vehicleId: string;
  /** Si coincide con un MaintenanceItem.id conocido, alimenta el motor de recomendaciones. */
  itemId?: string;
  description: string;
  date: string;
  km: number;
  costDOP?: number;
  shop?: string;
}

/** Salida calculada del motor de mantenimiento — nunca se persiste, se recalcula siempre. */
export interface Recommendation {
  item: MaintenanceItem;
  priority: Priority;
  progress: number;
  dueReason: string;
  /** Si hay un modificador de contexto RD aplicado, la razón para mostrarla. */
  rdTip?: string;
  /** false si nunca se registró este servicio — el cálculo asume desde el año del vehículo. */
  hasHistory: boolean;
}
