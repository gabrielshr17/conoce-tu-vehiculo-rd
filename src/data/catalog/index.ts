import type { CatalogModel } from '../../core/types';
import { CATALOG_MODELS } from './models';

const OLDEST_YEAR = 2000;

/** Años disponibles, del más reciente al más antiguo. */
export function getYears(): number[] {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear; y >= OLDEST_YEAR; y--) years.push(y);
  return years;
}

/** Marcas del catálogo, en el orden en que aparecen (las más comunes primero). */
export function getMakes(): string[] {
  const seen = new Set<string>();
  const makes: string[] = [];
  for (const entry of CATALOG_MODELS) {
    if (!seen.has(entry.make)) {
      seen.add(entry.make);
      makes.push(entry.make);
    }
  }
  return makes;
}

/** Modelos disponibles para una marca dada. */
export function getModelsByMake(make: string): CatalogModel[] {
  return CATALOG_MODELS.filter((entry) => entry.make === make);
}

/** Busca la entrada del catálogo para una marca + modelo específicos. */
export function findCatalogModel(make: string, model: string): CatalogModel | undefined {
  return CATALOG_MODELS.find((entry) => entry.make === make && entry.model === model);
}

/** Versiones (trims) disponibles para una marca + modelo. */
export function getTrims(make: string, model: string): string[] {
  return findCatalogModel(make, model)?.trims ?? [];
}
