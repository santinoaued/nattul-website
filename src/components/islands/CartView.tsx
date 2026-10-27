import { href } from "@/lib/url";
import { useEffect, useState } from "preact/hooks";
import { amountLimits, formatAmount, stepAmount } from "@/lib/amount";
import { getCart, type CartItem } from "@/lib/cart";
import { loadIndex } from "@/lib/search-index";
import { buildOrderUrl } from "@/lib/whatsapp";

interface Props {
  branches: { name: string; whatsapp: string }[];
}

export default function CartView({ branches }: Props) {
  const cart = getCart();
  const [items, setItems] = useState<CartItem[]>(() => cart.items());
  const [notice, setNotice] = useState("");

  useEffect(() => cart.subscribe(setItems), []);

  // Names, units and stock live in the catalog: refresh them and drop products that are gone or unavailable.
  useEffect(() => {
    loadIndex()
      .then((index) => {
        const bySlug = new Map(index.map((entry) => [entry.s, entry]));
        const current = cart.items();
        const next = current.flatMap((item) => {
          const entry = bySlug.get(item.slug);
          return entry && entry.a ? [{ ...item, name: entry.n, unit: entry.u }] : [];
        });
        const changed = JSON.stringify(next) !== JSON.stringify(current);
        if (changed) {
          cart.replace(next);
          setNotice("Actualizamos tu pedido: sacamos productos que ya no están disponibles.");
        }
      })
      .catch(() => {
        // Without the index the cart still works; the store confirms stock by chat.
      });
  }, []);

  if (items.length === 0) {
    return (
      <div class="rounded-card border border-line bg-paper p-6 text-center">
        <p class="font-display text-2xl text-deep">Tu pedido está vacío</p>
        <p class="mt-2 text-muted">Sumá productos desde el catálogo y volvé acá para enviarlo.</p>
        <a href={href("/#catalogo")} class="mt-6 inline-flex h-12 items-center rounded-full bg-forest px-5 font-medium text-cream">
          Ver el catálogo
        </a>
      </div>
    );
  }

  const orders = branches.map((branch) => ({ ...branch, ...buildOrderUrl(branch.whatsapp, items) }));
  const truncated = orders.some((order) => order.truncated);

  return (
    <div class="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div>
        {notice && (
          <p role="status" class="mb-4 rounded-2xl bg-foam px-4 py-3 text-sm text-forest">
            {notice}
          </p>
        )}
        <ul class="divide-y divide-line border-y border-line">
          {items.map((item) => (
            <li key={item.slug} class="flex flex-wrap items-center gap-x-4 gap-y-2 py-4">
              <div class="min-w-0 basis-full sm:basis-auto sm:flex-1">
                <a href={href(`/productos/${item.slug}/`)} class="font-medium hover:underline">
                  {item.name}
                </a>
              </div>
              <AmountStepper
                label={item.name}
                unit={item.unit}
                amount={item.amount}
                onChange={(amount) => cart.setAmount(item.slug, amount)}
              />
              <button type="button" class="h-11 px-2 text-sm text-forest underline" onClick={() => cart.remove(item.slug)}>
                Quitar
              </button>
            </li>
          ))}
        </ul>
        <button type="button" class="mt-4 h-11 text-sm text-muted underline" onClick={() => cart.clear()}>
          Vaciar pedido
        </button>
      </div>

      <aside class="h-fit rounded-card border border-line bg-paper p-5" aria-label="Resumen del pedido">
        <p class="font-display text-2xl text-deep">
          {items.length} producto{items.length === 1 ? "" : "s"} en tu lista
        </p>
        <p class="mt-2 text-sm text-muted">Te respondemos por WhatsApp con los precios, el stock y la forma de entrega.</p>
        <p class="mt-5 text-sm font-medium text-deep">Elegí la sucursal:</p>
        <ul class="mt-2 grid gap-2">
          {orders.map((order) => (
            <li key={order.whatsapp}>
              <a
                href={order.url}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex h-12 w-full items-center justify-center rounded-full bg-forest px-5 font-medium text-cream"
              >
                {order.name}
              </a>
            </li>
          ))}
        </ul>
        {truncated && (
          <p class="mt-3 text-xs text-muted">La lista es larga: el mensaje resume algunos productos y el detalle se completa por chat.</p>
        )}
      </aside>
    </div>
  );
}

interface StepperProps {
  label: string;
  unit: string;
  amount: number;
  onChange: (amount: number) => void;
}

/** Shows the total amount (750 g) instead of a pack count, stepping one pack at a time. */
function AmountStepper({ label, unit, amount, onChange }: StepperProps) {
  const { min, max } = amountLimits(unit);
  return (
    <div class="inline-flex h-11 items-center rounded-full border border-line bg-paper" role="group" aria-label={`Cantidad de ${label}`}>
      <button
        type="button"
        class="inline-flex size-11 items-center justify-center rounded-full text-lg text-forest disabled:text-line"
        aria-label="Menos cantidad"
        disabled={amount <= min}
        onClick={() => onChange(stepAmount(unit, amount, -1))}
      >
        −
      </button>
      <output class="min-w-[5.5rem] text-center font-medium tabular-nums" aria-live="polite">
        {formatAmount(unit, amount)}
      </output>
      <button
        type="button"
        class="inline-flex size-11 items-center justify-center rounded-full text-lg text-forest disabled:text-line"
        aria-label="Más cantidad"
        disabled={amount >= max}
        onClick={() => onChange(stepAmount(unit, amount, 1))}
      >
        +
      </button>
    </div>
  );
}
