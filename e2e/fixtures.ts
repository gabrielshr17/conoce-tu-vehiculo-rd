import type { Page } from '@playwright/test';

interface SeedOptions {
  vehicle?: boolean;
  currentKm?: number;
  history?: { itemId?: string; description: string; date: string; km: number; costDOP?: number }[];
}

export async function seed(page: Page, { vehicle = true, currentKm = 98500, history = [] }: SeedOptions = {}) {
  await page.goto('/');
  await page.evaluate(
    ({ vehicle, currentKm, history }) => {
      localStorage.clear();
      localStorage.setItem(
        'ctvrd:session',
        JSON.stringify({ sub: 'e2e', email: 'e2e@example.test', name: 'E2E', picture: '' }),
      );
      if (!vehicle) return;
      localStorage.setItem(
        'ctvrd:vehicle',
        JSON.stringify({
          id: 'v1',
          year: 2015,
          make: 'Toyota',
          model: 'Corolla',
          trim: 'LE',
          fuelType: 'gasolina',
          createdAt: '2026-01-01T00:00:00.000Z',
          currentKm,
        }),
      );
      localStorage.setItem(
        'ctvrd:history',
        JSON.stringify(history.map((h, i) => ({ id: `h${i}`, vehicleId: 'v1', ...h }))),
      );
    },
    { vehicle, currentKm, history },
  );
}

export function storedHistoryCount(page: Page): Promise<number> {
  return page.evaluate(() => JSON.parse(localStorage.getItem('ctvrd:history') ?? '[]').length);
}
