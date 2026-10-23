const ars = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export function formatPrice(value: number): string {
  return ars.format(value);
}

/** Lowercase without accents, for accent-insensitive search. */
export function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

const amount = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });

/** Total amount for qty packs of a unit: ("250 g", 3) -> "750 g", ("500 g", 3) -> "1,5 kg", ("unidad", 2) -> "2 unidades". */
export function formatAmount(unit: string, qty: number): string {
  const match = unit.match(/^(\d+) (g|kg|ml|l)$/);
  if (!match) return `${qty} ${qty === 1 ? "unidad" : "unidades"}`;
  const total = Number(match[1]) * qty;
  const small = match[2] === "g" || match[2] === "ml";
  if (small && total >= 1000) return `${amount.format(total / 1000)} ${match[2] === "g" ? "kg" : "l"}`;
  return `${amount.format(total)} ${match[2]}`;
}
