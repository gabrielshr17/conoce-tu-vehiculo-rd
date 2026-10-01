import { describe, expect, it } from 'vitest';
import type { Vehicle } from './types';
import { resolveVehicleSelection, type VehicleSelection } from './vehicle';

const now = '2026-09-29T12:00:00.000Z';

const corolla: Vehicle = {
  id: 'v1',
  year: 2015,
  make: 'Toyota',
  model: 'Corolla',
  trim: 'LE',
  fuelType: 'gasolina',
  createdAt: '2026-01-01T00:00:00.000Z',
  currentKm: 120000,
};

function select(overrides: Partial<VehicleSelection> = {}): VehicleSelection {
  return { year: 2015, make: 'Toyota', model: 'Corolla', trim: 'LE', fuelType: 'gasolina', ...overrides };
}

describe('resolveVehicleSelection', () => {
  it('creates a fresh vehicle when there is none yet', () => {
    expect(resolveVehicleSelection(undefined, select(), 'new-id', now)).toEqual({
      id: 'new-id',
      year: 2015,
      make: 'Toyota',
      model: 'Corolla',
      trim: 'LE',
      fuelType: 'gasolina',
      createdAt: now,
      currentKm: undefined,
    });
  });

  it('treats a different version or year of the same model as a correction that keeps history', () => {
    const result = resolveVehicleSelection(corolla, select({ trim: 'XLE', year: 2016 }), 'new-id', now);

    expect(result).toMatchObject({ id: 'v1', createdAt: corolla.createdAt, currentKm: 120000, trim: 'XLE', year: 2016 });
  });

  it('starts over when the user switches to a different car', () => {
    const result = resolveVehicleSelection(
      corolla,
      select({ make: 'Honda', model: 'Civic', year: 2024, trim: 'EX' }),
      'new-id',
      now,
    );

    expect(result).toMatchObject({ id: 'new-id', createdAt: now, currentKm: undefined, make: 'Honda', model: 'Civic' });
  });
});
