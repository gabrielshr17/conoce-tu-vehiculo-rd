import { toLocalIsoDate } from '../date';

export interface HistoryDraft {
  description: string;
  date: string;
  km: string;
  cost: string;
}

export interface ValidHistoryDraft {
  description: string;
  date: string;
  km: number;
  costDOP?: number;
}

export type HistoryDraftErrors = Partial<Record<keyof HistoryDraft, string>>;

export type HistoryDraftResult =
  | { ok: true; value: ValidHistoryDraft }
  | { ok: false; errors: HistoryDraftErrors };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function parseAmount(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const value = Number(trimmed);
  return Number.isFinite(value) && value >= 0 ? value : Number.NaN;
}

export function validateHistoryDraft(draft: HistoryDraft, today: Date): HistoryDraftResult {
  const errors: HistoryDraftErrors = {};
  const description = draft.description.trim();
  const km = parseAmount(draft.km);
  const costDOP = parseAmount(draft.cost);

  if (!description) errors.description = 'Dinos qué se le hizo al carro.';

  if (!ISO_DATE.test(draft.date)) errors.date = 'Elige la fecha en que se hizo.';
  else if (draft.date > toLocalIsoDate(today)) errors.date = 'La fecha no puede ser en el futuro.';

  if (km === undefined || Number.isNaN(km)) errors.km = 'Escribe el kilometraje, sin letras ni signos.';

  if (Number.isNaN(costDOP)) errors.cost = 'El costo debe ser un número positivo, o déjalo vacío.';

  if (Object.keys(errors).length > 0 || km === undefined) return { ok: false, errors };

  return { ok: true, value: { description, date: draft.date, km, costDOP } };
}
