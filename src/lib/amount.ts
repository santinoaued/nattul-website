// Cart amounts are stored in the product's base measure: grams for g/kg, millilitres for ml/l, pieces for "unidad".
const STEP = 100;
const MAX_MEASURED = 10_000;
const MAX_PIECES = 99;
const number = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });

function measure(unit: string) {
  const match = unit.match(/^(\d+) (g|kg|ml|l)$/);
  if (!match) return undefined;
  const big = match[2] === "kg" || match[2] === "l";
  const pack = Number(match[1]) * (big ? 1000 : 1);
  return { base: match[2] === "g" || match[2] === "kg" ? "g" : "ml", pack, step: Math.min(STEP, pack) };
}

/** Amount added by default: the product's presentation ("250 g" -> 250, "1 kg" -> 1000, "unidad" -> 1). */
export const packAmount = (unit: string) => measure(unit)?.pack ?? 1;

export function amountLimits(unit: string): { min: number; max: number } {
  const m = measure(unit);
  return m ? { min: m.step, max: MAX_MEASURED } : { min: 1, max: MAX_PIECES };
}

export const clampAmount = (unit: string, amount: number) => {
  const { min, max } = amountLimits(unit);
  return Math.min(Math.max(amount, min), max);
};

/** Next amount up or down. Weights snap to the 100 g grid, so 250 g goes down to 200 g and up to 300 g. */
export function stepAmount(unit: string, amount: number, direction: 1 | -1): number {
  const step = measure(unit)?.step ?? 1;
  const next = direction > 0 ? (Math.floor(amount / step) + 1) * step : (Math.ceil(amount / step) - 1) * step;
  return clampAmount(unit, next);
}

/** ("250 g", 750) -> "750 g", ("250 g", 1500) -> "1,5 kg", ("unidad", 2) -> "2 unidades". */
export function formatAmount(unit: string, amount: number): string {
  const m = measure(unit);
  if (!m) return `${amount} ${amount === 1 ? "unidad" : "unidades"}`;
  if (amount >= 1000) return `${number.format(amount / 1000)} ${m.base === "g" ? "kg" : "l"}`;
  return `${number.format(amount)} ${m.base}`;
}
