import type { CatalogModel } from '../../core/types';

/**
 * Catálogo semilla: ~20 modelos comunes en República Dominicana.
 * Lista hipotética a validar con concesionarios/talleres — ver PLAN.md §7.
 * fuelType es el combustible de fábrica más común del modelo (no cubre
 * conversiones a GLP, que son una modificación posterior del dueño).
 */
export const CATALOG_MODELS: CatalogModel[] = [
  { id: 'toyota-corolla', make: 'Toyota', model: 'Corolla', trims: ['LE', 'SE', 'XLE'], fuelType: 'gasolina' },
  { id: 'toyota-yaris', make: 'Toyota', model: 'Yaris', trims: ['Core', 'Sport'], fuelType: 'gasolina' },
  { id: 'toyota-hilux', make: 'Toyota', model: 'Hilux', trims: ['Base', 'SR', 'SRV'], fuelType: 'diesel' },
  { id: 'toyota-rav4', make: 'Toyota', model: 'RAV4', trims: ['LE', 'XLE', 'Limited'], fuelType: 'gasolina' },

  { id: 'honda-civic', make: 'Honda', model: 'Civic', trims: ['LX', 'EX', 'Sport'], fuelType: 'gasolina' },
  { id: 'honda-crv', make: 'Honda', model: 'CR-V', trims: ['LX', 'EX', 'EX-L'], fuelType: 'gasolina' },
  { id: 'honda-fit', make: 'Honda', model: 'Fit', trims: ['LX', 'EX'], fuelType: 'gasolina' },

  { id: 'hyundai-accent', make: 'Hyundai', model: 'Accent', trims: ['SE', 'GLS'], fuelType: 'gasolina' },
  { id: 'hyundai-elantra', make: 'Hyundai', model: 'Elantra', trims: ['SE', 'Limited'], fuelType: 'gasolina' },
  { id: 'hyundai-tucson', make: 'Hyundai', model: 'Tucson', trims: ['GL', 'GLS', 'Limited'], fuelType: 'gasolina' },

  { id: 'kia-rio', make: 'Kia', model: 'Rio', trims: ['LX', 'EX'], fuelType: 'gasolina' },
  { id: 'kia-sportage', make: 'Kia', model: 'Sportage', trims: ['LX', 'EX'], fuelType: 'gasolina' },

  { id: 'nissan-sentra', make: 'Nissan', model: 'Sentra', trims: ['S', 'SV', 'SR'], fuelType: 'gasolina' },
  { id: 'nissan-versa', make: 'Nissan', model: 'Versa', trims: ['S', 'SV'], fuelType: 'gasolina' },
  { id: 'nissan-frontier', make: 'Nissan', model: 'Frontier', trims: ['S', 'SV', 'PRO-4X'], fuelType: 'diesel' },

  { id: 'mitsubishi-lancer', make: 'Mitsubishi', model: 'Lancer', trims: ['ES', 'GT'], fuelType: 'gasolina' },
  { id: 'suzuki-grand-vitara', make: 'Suzuki', model: 'Grand Vitara', trims: ['JLX', 'JLX+'], fuelType: 'gasolina' },
  { id: 'daihatsu-terios', make: 'Daihatsu', model: 'Terios', trims: ['Base'], fuelType: 'gasolina' },
  { id: 'ford-ranger', make: 'Ford', model: 'Ranger', trims: ['XL', 'XLT'], fuelType: 'diesel' },
  { id: 'chevrolet-aveo', make: 'Chevrolet', model: 'Aveo', trims: ['LS', 'LT'], fuelType: 'gasolina' },
];
