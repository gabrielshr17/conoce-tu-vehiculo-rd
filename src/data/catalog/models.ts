import type { CatalogModel } from '../../core/types';

/**
 * Catálogo semilla: ~20 modelos comunes en República Dominicana.
 * Lista hipotética a validar con concesionarios/talleres — ver PLAN.md §7.
 * fuelType es el combustible de fábrica más común del modelo (no cubre
 * conversiones a GLP, que son una modificación posterior del dueño).
 * trims va de la versión más básica a la más equipada.
 */
export const CATALOG_MODELS: CatalogModel[] = [
  { id: 'toyota-corolla', make: 'Toyota', model: 'Corolla', category: 'sedan', trims: ['LE', 'SE', 'XLE'], fuelType: 'gasolina' },
  { id: 'toyota-yaris', make: 'Toyota', model: 'Yaris', category: 'hatchback', trims: ['Core', 'Sport'], fuelType: 'gasolina' },
  { id: 'toyota-hilux', make: 'Toyota', model: 'Hilux', category: 'pickup', trims: ['Base', 'SR', 'SRV'], fuelType: 'diesel' },
  { id: 'toyota-rav4', make: 'Toyota', model: 'RAV4', category: 'suv', trims: ['LE', 'XLE', 'Limited'], fuelType: 'gasolina' },

  { id: 'honda-civic', make: 'Honda', model: 'Civic', category: 'sedan', trims: ['LX', 'EX', 'Sport'], fuelType: 'gasolina' },
  { id: 'honda-crv', make: 'Honda', model: 'CR-V', category: 'suv', trims: ['LX', 'EX', 'EX-L'], fuelType: 'gasolina' },
  { id: 'honda-fit', make: 'Honda', model: 'Fit', category: 'hatchback', trims: ['LX', 'EX'], fuelType: 'gasolina' },

  { id: 'hyundai-accent', make: 'Hyundai', model: 'Accent', category: 'sedan', trims: ['SE', 'GLS'], fuelType: 'gasolina' },
  { id: 'hyundai-elantra', make: 'Hyundai', model: 'Elantra', category: 'sedan', trims: ['SE', 'Limited'], fuelType: 'gasolina' },
  { id: 'hyundai-tucson', make: 'Hyundai', model: 'Tucson', category: 'suv', trims: ['GL', 'GLS', 'Limited'], fuelType: 'gasolina' },

  { id: 'kia-rio', make: 'Kia', model: 'Rio', category: 'sedan', trims: ['LX', 'EX'], fuelType: 'gasolina' },
  { id: 'kia-sportage', make: 'Kia', model: 'Sportage', category: 'suv', trims: ['LX', 'EX'], fuelType: 'gasolina' },

  { id: 'nissan-sentra', make: 'Nissan', model: 'Sentra', category: 'sedan', trims: ['S', 'SV', 'SR'], fuelType: 'gasolina' },
  { id: 'nissan-versa', make: 'Nissan', model: 'Versa', category: 'sedan', trims: ['S', 'SV'], fuelType: 'gasolina' },
  { id: 'nissan-frontier', make: 'Nissan', model: 'Frontier', category: 'pickup', trims: ['S', 'SV', 'PRO-4X'], fuelType: 'diesel' },

  { id: 'mitsubishi-lancer', make: 'Mitsubishi', model: 'Lancer', category: 'sedan', trims: ['ES', 'GT'], fuelType: 'gasolina' },
  { id: 'suzuki-grand-vitara', make: 'Suzuki', model: 'Grand Vitara', category: 'suv', trims: ['JLX', 'JLX+'], fuelType: 'gasolina' },
  { id: 'daihatsu-terios', make: 'Daihatsu', model: 'Terios', category: 'suv', trims: ['Base'], fuelType: 'gasolina' },
  { id: 'ford-ranger', make: 'Ford', model: 'Ranger', category: 'pickup', trims: ['XL', 'XLT'], fuelType: 'diesel' },
  { id: 'chevrolet-aveo', make: 'Chevrolet', model: 'Aveo', category: 'sedan', trims: ['LS', 'LT'], fuelType: 'gasolina' },
];
