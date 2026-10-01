import { expect, test } from '@playwright/test';
import { seed, storedHistoryCount } from './fixtures';

test('an incomplete record explains what to fix instead of saving', async ({ page }) => {
  await seed(page);
  await page.goto('/historial');

  await page.getByRole('button', { name: 'Agregar registro' }).click();
  await page.getByLabel('Kilometraje').fill('');
  await page.getByRole('button', { name: 'Guardar' }).click();

  await expect(page.getByText('Dinos qué se le hizo al carro.')).toBeVisible();
  await expect(page.getByLabel('Kilometraje')).toHaveAttribute('aria-invalid', 'true');
  expect(await storedHistoryCount(page)).toBe(0);
});

test('deleting a record asks for confirmation first', async ({ page }) => {
  await seed(page, { history: [{ itemId: 'oil', description: 'Cambio de aceite', date: '2026-08-01', km: 95000 }] });
  await page.goto('/historial');

  await page.getByRole('button', { name: 'Eliminar' }).click();
  expect(await storedHistoryCount(page)).toBe(1);
  await page.getByRole('button', { name: 'Sí, eliminar' }).click();

  expect(await storedHistoryCount(page)).toBe(0);
  await expect(page.getByText('Agosto 2026', { exact: false })).toHaveCount(0);
});
