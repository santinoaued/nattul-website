export interface CartItem {
  slug: string;
  name: string;
  unit: string;
  price: number;
  qty: number;
}

type Listener = (items: CartItem[]) => void;
type Storage = Pick<globalThis.Storage, "getItem" | "setItem">;

const KEY = "nattul:carrito:v1";
export const MAX_QTY = 99;

/** localStorage can be missing or throw (private mode, blocked cookies); fall back to memory. */
function safeStorage(): Storage {
  const memory = new Map<string, string>();
  const fallback: Storage = { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => void memory.set(key, value) };
  try {
    const storage = globalThis.localStorage;
    const probe = `${KEY}:probe`;
    storage.setItem(probe, "1");
    storage.getItem(probe);
    return storage;
  } catch {
    return fallback;
  }
}

/** Stored data is untrusted: keep only well-formed items. */
function sanitize(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item !== "object" || item === null) return [];
    const { slug, name, unit, price, qty } = item as Record<string, unknown>;
    if (typeof slug !== "string" || typeof name !== "string" || typeof unit !== "string") return [];
    if (!Number.isInteger(price) || (price as number) < 0) return [];
    if (!Number.isInteger(qty) || (qty as number) < 1) return [];
    return [{ slug, name, unit, price: price as number, qty: Math.min(qty as number, MAX_QTY) }];
  });
}

export function createCart(storage: Storage = safeStorage()) {
  const listeners = new Set<Listener>();

  const read = (): CartItem[] => {
    try {
      return sanitize(JSON.parse(storage.getItem(KEY) ?? "[]"));
    } catch {
      return [];
    }
  };

  const write = (items: CartItem[]) => {
    try {
      storage.setItem(KEY, JSON.stringify(items));
    } catch {
      // Quota or storage errors: the cart keeps working for this page view.
    }
    listeners.forEach((listener) => listener(items));
  };

  return {
    items: read,
    count: () => read().reduce((sum, item) => sum + item.qty, 0),
    total: () => read().reduce((sum, item) => sum + item.price * item.qty, 0),
    add(item: Omit<CartItem, "qty">, qty = 1) {
      const items = read();
      const existing = items.find((entry) => entry.slug === item.slug);
      if (existing) existing.qty = Math.min(existing.qty + qty, MAX_QTY);
      else items.push({ ...item, qty: Math.min(qty, MAX_QTY) });
      write(items);
    },
    setQty(slug: string, qty: number) {
      const items = read();
      const next = qty < 1 ? items.filter((item) => item.slug !== slug) : items.map((item) => (item.slug === slug ? { ...item, qty: Math.min(Math.floor(qty), MAX_QTY) } : item));
      write(next);
    },
    remove(slug: string) {
      write(read().filter((item) => item.slug !== slug));
    },
    replace(items: CartItem[]) {
      write(sanitize(items));
    },
    clear() {
      write([]);
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export type Cart = ReturnType<typeof createCart>;

let shared: Cart | undefined;

/** Single cart shared by every island and script on the page, synced across tabs. */
export function getCart(): Cart {
  if (!shared) {
    const cart = createCart();
    shared = cart;
    globalThis.addEventListener?.("storage", (event: StorageEvent) => {
      if (event.key === KEY) cart.replace(cart.items());
    });
  }
  return shared;
}
