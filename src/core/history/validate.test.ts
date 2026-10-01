import { describe, expect, it } from 'vitest';
import { validateHistoryDraft, type HistoryDraft } from './validate';

const today = new Date(2026, 8, 28);

function draft(overrides: Partial<HistoryDraft> = {}): HistoryDraft {
  return { description: 'Cambio de aceite', date: '2026-09-20', km: '98500', cost: '2800', ...overrides };
}

describe('validateHistoryDraft', () => {
  it('accepts a complete record and parses its numbers', () => {
    const result = validateHistoryDraft(draft(), today);

    expect(result).toEqual({
      ok: true,
      value: { description: 'Cambio de aceite', date: '2026-09-20', km: 98500, costDOP: 2800 },
    });
  });

  it('treats a blank cost as not provided', () => {
    const result = validateHistoryDraft(draft({ cost: '  ' }), today);

    expect(result.ok && result.value.costDOP).toBeUndefined();
  });

  it('explains every field that needs fixing at once', () => {
    const result = validateHistoryDraft(
      { description: '   ', date: '', km: '', cost: '-50' },
      today,
    );

    expect(result.ok).toBe(false);
    expect(!result.ok && Object.keys(result.errors).sort()).toEqual(['cost', 'date', 'description', 'km']);
  });

  it('rejects a negative odometer reading', () => {
    const result = validateHistoryDraft(draft({ km: '-1' }), today);

    expect(!result.ok && result.errors.km).toBeTruthy();
  });

  it('rejects a service dated in the future', () => {
    const result = validateHistoryDraft(draft({ date: '2026-09-29' }), today);

    expect(!result.ok && result.errors.date).toBeTruthy();
  });

  it('accepts a service done today', () => {
    expect(validateHistoryDraft(draft({ date: '2026-09-28' }), today).ok).toBe(true);
  });
});
