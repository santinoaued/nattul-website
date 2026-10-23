import { href } from "@/lib/url";
import { useEffect, useState } from "preact/hooks";
import { getCart, MAX_QTY, type CartItem } from "@/lib/cart";
import { loadIndex } from "@/lib/search-index";
import { buildOrderUrl } from "@/lib/whatsapp";

interface Props {
  phone: string;
}

export default function CartView({ phone }: Props) {
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

  const { url, truncated } = buildOrderUrl(phone, items);

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
                <p class="text-sm text-muted">
                  {item.unit}
                </p>
              </div>
              <div class="flex items-center gap-1" role="group" aria-label={`Cantidad de ${item.name}`}>
                <button
                  type="button"
                  class="inline-flex size-11 items-center justify-center rounded-full border border-line bg-paper"
                  aria-label="Restar uno"
                  onClick={() => cart.setQty(item.slug, item.qty - 1)}
                >
                  −
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={MAX_QTY}
                  value={item.qty}
                  aria-label="Cantidad"
                  class="h-11 w-14 rounded-full border border-line bg-paper text-center"
                  onChange={(event) => {
                    const qty = Number(event.currentTarget.value);
                    if (Number.isFinite(qty)) cart.setQty(item.slug, qty);
                  }}
                />
                <button
                  type="button"
                  class="inline-flex size-11 items-center justify-center rounded-full border border-line bg-paper"
                  aria-label="Sumar uno"
                  disabled={item.qty >= MAX_QTY}
                  onClick={() => cart.setQty(item.slug, item.qty + 1)}
                >
                  +
                </button>
              </div>
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
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          class="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-forest px-5 font-medium text-cream"
        >
          Consultar por WhatsApp
        </a>
        {truncated && (
          <p class="mt-3 text-xs text-muted">La lista es larga: el mensaje resume algunos productos y el detalle se completa por chat.</p>
        )}
      </aside>
    </div>
  );
}
