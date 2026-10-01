import { describe, expect, it } from 'vitest';
import { formatMonthYear, parseLocalDate, toLocalIsoDate } from './date';

describe('parseLocalDate', () => {
  it('keeps the calendar day of a stored date instead of shifting it to UTC', () => {
    const d = parseLocalDate('2026-08-01');

    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(7);
    expect(d.getDate()).toBe(1);
  });
});

describe('toLocalIsoDate', () => {
  it('records a late-night action on the local calendar day, not the next UTC day', () => {
    expect(toLocalIsoDate(new Date(2026, 8, 28, 23, 30))).toBe('2026-09-28');
  });

  it('pads single-digit months and days', () => {
    expect(toLocalIsoDate(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('formatMonthYear', () => {
  it('names the month a service was actually done in, in Spanish', () => {
    expect(formatMonthYear('2026-08-01')).toBe('agosto 2026');
    expect(formatMonthYear('2025-12-31')).toBe('diciembre 2025');
  });
});
