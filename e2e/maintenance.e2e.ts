import { expect, test } from '@playwright/test';
import { seed, storedHistoryCount } from './fixtures';

test('marking a service done can be undone', async ({ page }) => {
  await seed(page);
  await page.goto('/mantenimiento');

  await page.getByRole('button', { name: /^Marcar hecho/ }).first().click();
  await expect(page.getByRole('status')).toContainText('registrado en Historial');
  expect(await storedHistoryCount(page)).toBe(1);

  await page.getByRole('button', { name: 'Deshacer' }).click();
  await expect(page.getByRole('status')).toHaveCount(0);
  expect(await storedHistoryCount(page)).toBe(0);
});

test('the odometer cannot be set below a recorded service', async ({ page }) => {
  await seed(page, { history: [{ itemId: 'oil', description: 'Cambio de aceite', date: '2026-08-01', km: 95000 }] });
  await page.goto('/mantenimiento');

  await page.getByRole('button', { name: 'Editar km' }).click();
  await page.getByLabel('Nuevo kilometraje').fill('90000');
  await page.getByRole('button', { name: 'Guardar' }).click();

  await expect(page.getByText(/ya tiene un servicio a 95,000 km/)).toBeVisible();
  await expect(page.getByText('Toyota Corolla · 98,500 km')).toBeVisible();
});
