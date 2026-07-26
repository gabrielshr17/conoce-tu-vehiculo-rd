/**
 * Contenido curado por modelo — no es un tipo de dominio del motor (ver
 * core/types.ts), es contenido de presentación para la pantalla de Perfil.
 */
export interface CareTip {
  icon: string;
  title: string;
  description: string;
}

export interface VehicleSpec {
  modelId: string; // debe coincidir con CatalogModel.id
  description: string;
  careTips: CareTip[];
  performanceTips: CareTip[];
  accessories: string[];
  community: { name: string; platform: string };
  oilCapacity: string;
  oilType: string;
  tireSize: string;
  tirePressure: string;
}
