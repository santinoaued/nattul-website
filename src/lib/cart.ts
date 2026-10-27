import { clampAmount, packAmount } from "./amount.ts";

export interface CartItem {
  slug: string;
  name: string;
  unit: string;
  /** In the product's base measure: grams, millilitres or pieces (see amount.ts). */
  amount: number;
}

type Listener = (items: CartItem[]) => void;
type Storage = Pick<globalThis.Storage, "getItem" | "setItem">;

// v2 stores amounts instead of pack counts; v1 carts are dropped.
const KEY = "nattul:carrito:v2";

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
    const { slug, name, unit, amount } = item as Record<string, unknown>;
    if (typeof slug !== "string" || typeof name !== "string" || typeof unit !== "string") return [];
    if (!Number.isInteger(amount) || (amount as number) < 1) return [];
    return [{ slug, name, unit, amount: clampAmount(unit, amount as number) }];
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
    // Distinct products, not grams.
    count: () => read().length,
    add(item: Omit<CartItem, "amount">, amount = packAmount(item.unit)) {
      const items = read();
      const existing = items.find((entry) => entry.slug === item.slug);
      if (existing) existing.amount = clampAmount(item.unit, existing.amount + amount);
      else items.push({ ...item, amount: clampAmount(item.unit, amount) });
      write(items);
    },
    setAmount(slug: string, amount: number) {
      write(read().map((item) => (item.slug === slug ? { ...item, amount: clampAmount(item.unit, Math.round(amount)) } : item)));
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
