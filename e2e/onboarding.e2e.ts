import { expect, test } from '@playwright/test';
import { seed } from './fixtures';

test('a new user identifies their car in four taps', async ({ page }) => {
  await seed(page, { vehicle: false });
  await page.goto('/onboarding');

  await page.getByRole('button', { name: '2015' }).click();
  await page.getByRole('button', { name: 'Toyota' }).click();
  await expect(page.getByText('2015 · Toyota')).toBeVisible();
  await page.getByRole('button', { name: 'Corolla' }).click();
  await page.getByRole('button', { name: 'LE', exact: true }).click();
  await page.getByRole('button', { name: 'Ver mi carro' }).click();

  await expect(page).toHaveURL(/\/perfil$/);
  await expect(page.getByRole('heading', { name: 'Toyota Corolla' })).toBeVisible();
});

test('switching to a different car starts with an empty history', async ({ page }) => {
  await seed(page, { history: [{ itemId: 'oil', description: 'Cambio de aceite', date: '2026-08-01', km: 95000 }] });
  await page.goto('/perfil');

  await page.getByRole('link', { name: 'Cambiar de vehículo' }).click();
  await page.getByRole('button', { name: 'Siguiente' }).click();
  await page.getByRole('button', { name: 'Honda' }).click();
  await page.getByRole('button', { name: 'Civic' }).click();
  await page.getByRole('button', { name: 'EX', exact: true }).click();
  await page.getByRole('button', { name: 'Ver mi carro' }).click();

  await page.getByRole('link', { name: 'Historial' }).click();
  await expect(page.getByText('Nada registrado todavía')).toBeVisible();
});
