import type { Vehicle } from '../core/types';
import type { VehicleRepository } from './repository';

const STORAGE_KEY = 'ctvrd:vehicle';

export function createLocalStorageRepository(): VehicleRepository {
  return {
    get() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as Vehicle;
      } catch {
        // Datos corruptos o de un esquema anterior: tratar como si no hubiera vehículo.
        return null;
      }
    },
    save(vehicle) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicle));
    },
    clear() {
      localStorage.removeItem(STORAGE_KEY);
    },
  };
}
