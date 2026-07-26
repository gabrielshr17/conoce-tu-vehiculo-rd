import type { CatalogModel } from '../core/types';

/** Recomendados para cualquier carro en RD, sin importar el modelo. */
export const UNIVERSAL_ACCESSORIES: string[] = [
  'Tintado (por el sol y el calor fuerte en RD)',
  'Chapaletas',
  'Viseras de ventana',
];

/** Según el tipo de carrocería — solo aplica cuando hay una lista para esa categoría. */
const CATEGORY_ACCESSORIES: Partial<Record<CatalogModel['category'], string[]>> = {
  suv: ['Estribos'],
  pickup: ['Estribos'],
};

/**
 * Cuando alguien compra la versión más básica, es muy común en RD que le
 * agregue detalles de la versión tope de línea (el propio dueño de una RAV4
 * LE, por ejemplo, le puso aros, luces DRL y deflectores traseros LED de la
 * XLE). Esto es un patrón general, no una lista verificada por modelo.
 */
const TRIM_UP_ACCESSORIES: string[] = [
  'Aros de la versión más equipada',
  'Luces diurnas LED (DRL)',
  'Deflector trasero con luz LED',
];

const AUDIO_UPGRADE = 'Cambio de radio/pantalla (si el de fábrica se queda corto)';

export interface AccessoryGroup {
  title: string;
  items: string[];
}

/**
 * Arma los grupos de accesorios a mostrar para un vehículo. `modelAccessories`
 * son los curados a mano para ese modelo (data/specs) — puede venir vacío si
 * todavía no hay ficha curada. `catalogModel` puede faltar en el caso límite
 * de un vehículo fuera del catálogo; en ese caso solo se muestra lo universal.
 */
export function getAccessoryGroups(
  modelAccessories: string[],
  catalogModel: CatalogModel | undefined,
  trim: string,
): AccessoryGroup[] {
  const groups: AccessoryGroup[] = [];

  if (modelAccessories.length > 0) {
    groups.push({ title: 'Para tu versión', items: modelAccessories });
  }

  if (catalogModel) {
    const categoryItems = CATEGORY_ACCESSORIES[catalogModel.category];
    if (categoryItems) {
      groups.push({ title: 'Para tu tipo de vehículo', items: categoryItems });
    }
  }

  groups.push({ title: 'Para cualquier carro en RD', items: UNIVERSAL_ACCESSORIES });

  if (catalogModel) {
    const isBaseTrim = catalogModel.trims.length > 1 && catalogModel.trims[0] === trim;
    if (isBaseTrim) {
      groups.push({
        title: 'Si quieres "subir de nivel" tu versión básica',
        items: [...TRIM_UP_ACCESSORIES, AUDIO_UPGRADE],
      });
    }
  }

  return groups;
}
