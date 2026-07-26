import type { Vehicle } from '../core/types';

/**
 * MVP: un solo vehículo activo. "Mi Garaje" (varios vehículos) es Fase 2.
 */
export interface VehicleRepository {
  get(): Vehicle | null;
  save(vehicle: Vehicle): void;
  clear(): void;
}
