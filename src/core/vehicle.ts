import type { FuelType, Vehicle } from './types';

export interface VehicleSelection {
  year: number;
  make: string;
  model: string;
  trim: string;
  fuelType: FuelType;
}

export function resolveVehicleSelection(
  existing: Vehicle | undefined,
  selection: VehicleSelection,
  newId: string,
  nowIso: string,
): Vehicle {
  const isSameCar = existing !== undefined && existing.make === selection.make && existing.model === selection.model;

  if (isSameCar) {
    return { ...existing, ...selection };
  }

  return { id: newId, ...selection, createdAt: nowIso, currentKm: undefined };
}
