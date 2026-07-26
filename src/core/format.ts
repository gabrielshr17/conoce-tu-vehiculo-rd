export function formatKm(km: number): string {
  return `${km.toLocaleString('es-DO')} km`;
}

export function formatCurrency(amount: number): string {
  return `RD$ ${amount.toLocaleString('es-DO')}`;
}

export function formatCurrencyRange(min: number, max: number): string {
  return `~RD$ ${min.toLocaleString('es-DO')}–${max.toLocaleString('es-DO')}`;
}
