import { describe, expect, it } from 'vitest';
import type { Priority, Recommendation } from '../types';
import { summarizeRecommendations } from './summary';

function rec(id: string, priority: Priority): Recommendation {
  return {
    item: { id, name: id, category: 'fluids', intervalKm: 5000, costDOP: { min: 1000, max: 2000 } },
    priority,
    progress: 0,
    dueReason: 'Faltan 1,000 km',
    hasHistory: true,
  };
}

describe('summarizeRecommendations', () => {
  it('reports the vehicle as up to date when nothing is urgent or soon', () => {
    const summary = summarizeRecommendations([rec('oil', 'later'), rec('coolant', 'later')]);

    expect(summary.status).toBe('ok');
    expect(summary.counts).toEqual({ urgent: 0, soon: 0, later: 2 });
    expect(summary.pending).toBe(0);
  });

  it('flags the vehicle as soon when a service is coming up but none is overdue', () => {
    const summary = summarizeRecommendations([rec('oil', 'soon'), rec('coolant', 'later')]);

    expect(summary.status).toBe('soon');
    expect(summary.pending).toBe(1);
  });

  it('lets a single overdue service override everything else', () => {
    const summary = summarizeRecommendations([
      rec('coolant', 'later'),
      rec('oil', 'soon'),
      rec('brakes', 'urgent'),
    ]);

    expect(summary.status).toBe('urgent');
    expect(summary.counts).toEqual({ urgent: 1, soon: 1, later: 1 });
    expect(summary.pending).toBe(2);
  });
});
