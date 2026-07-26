import { describe, expect, it } from 'vitest';
import type { HistoryEntry } from '../types';
import { recommend } from './engine';

const TODAY = new Date(2026, 6, 26); // 26 de julio de 2026

function entry(overrides: Partial<HistoryEntry>): HistoryEntry {
  return {
    id: 'h1',
    vehicleId: 'v1',
    description: 'test',
    date: '2026-01-01',
    km: 0,
    ...overrides,
  };
}

describe('recommend', () => {
  it('no marca como urgente un aceite reciente (progreso por debajo de 0.8)', () => {
    const history = [entry({ itemId: 'oil', date: '2026-04-26', km: 97300 })];
    const [oil] = recommend({ vehicleYear: 2015, currentKm: 98500, history, today: TODAY }).filter(
      (r) => r.item.id === 'oil',
    );
    // km: 1200/5000=0.24, meses: 3/6=0.5 → progreso=0.5
    expect(oil.progress).toBeCloseTo(0.5);
    expect(oil.priority).toBe('later');
  });

  it('marca como urgente un aceite vencido tanto por km como por meses', () => {
    const history = [entry({ itemId: 'oil', date: '2025-11-26', km: 92000 })];
    const [oil] = recommend({ vehicleYear: 2015, currentKm: 98500, history, today: TODAY }).filter(
      (r) => r.item.id === 'oil',
    );
    // km: 6500/5000=1.30, meses: 8/6=1.33 → progreso=max(1.30, 1.33)=1.33
    expect(oil.progress).toBeCloseTo(8 / 6, 2);
    expect(oil.priority).toBe('urgent');
  });

  it('el modificador RD adelanta la batería de "later" a "urgent"', () => {
    const history = [entry({ itemId: 'battery', date: '2023-06-26', km: 50000 })];
    const [battery] = recommend({ vehicleYear: 2015, currentKm: 98500, history, today: TODAY }).filter(
      (r) => r.item.id === 'battery',
    );
    // Sin modificador: 37/48=0.77 ("later"). Con modificador RD (0.75): 37/36=1.03 ("urgent").
    expect(battery.progress).toBeGreaterThan(37 / 48);
    expect(battery.priority).toBe('urgent');
    expect(battery.rdTip).toMatch(/calor/i);
  });

  it('no alarma por una correa de tiempo lejana en un carro sin historial', () => {
    const [timingBelt] = recommend({ vehicleYear: 2023, currentKm: 30000, history: [], today: TODAY }).filter(
      (r) => r.item.id === 'timing-belt',
    );
    // km: 30000/100000=0.30, meses: 42/84=0.5 → progreso=0.5
    expect(timingBelt.progress).toBeCloseTo(0.5);
    expect(timingBelt.priority).toBe('later');
    expect(timingBelt.hasHistory).toBe(false);
  });

  it('ordena los resultados de más a menos urgente', () => {
    // Todo recién hecho (progreso ~0) salvo el aceite, deliberadamente vencido.
    const recent = { date: '2026-07-20', km: 98400 };
    const history = [
      entry({ itemId: 'oil', date: '2025-11-26', km: 92000 }),
      entry({ itemId: 'air-filter', ...recent }),
      entry({ itemId: 'spark-plugs', ...recent }),
      entry({ itemId: 'tires', ...recent }),
      entry({ itemId: 'battery', ...recent }),
      entry({ itemId: 'brakes', ...recent }),
      entry({ itemId: 'timing-belt', ...recent }),
      entry({ itemId: 'alignment', ...recent }),
    ];
    const results = recommend({ vehicleYear: 2015, currentKm: 98500, history, today: TODAY });
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].progress).toBeGreaterThanOrEqual(results[i].progress);
    }
    expect(results[0].item.id).toBe('oil');
  });

  it('marca hasHistory=true cuando existe un registro previo', () => {
    const history = [entry({ itemId: 'oil', date: '2026-04-26', km: 97300 })];
    const [oil] = recommend({ vehicleYear: 2015, currentKm: 98500, history, today: TODAY }).filter(
      (r) => r.item.id === 'oil',
    );
    expect(oil.hasHistory).toBe(true);
  });
});
