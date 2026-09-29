import { describe, expect, it } from 'vitest';
import type { HistoryEntry } from './types';
import { validateOdometer } from './odometer';

function entry(km: number): HistoryEntry {
  return { id: `h${km}`, vehicleId: 'v1', description: 'Servicio', date: '2026-08-01', km };
}

describe('validateOdometer', () => {
  it('accepts a reading at or above everything already recorded', () => {
    expect(validateOdometer('98500', [entry(95000), entry(98500)])).toEqual({ ok: true, km: 98500 });
  });

  it('refuses a reading lower than a recorded service, naming that mileage', () => {
    const result = validateOdometer('90000', [entry(95000)]);

    expect(result.ok).toBe(false);
    expect(!result.ok && result.error).toContain('95,000 km');
  });

  it('refuses empty, zero and non-numeric readings', () => {
    expect(validateOdometer('', []).ok).toBe(false);
    expect(validateOdometer('0', []).ok).toBe(false);
    expect(validateOdometer('abc', []).ok).toBe(false);
  });
});
