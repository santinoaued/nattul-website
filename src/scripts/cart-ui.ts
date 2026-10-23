import { getCart, MAX_QTY } from "@/lib/cart";
import { formatAmount } from "@/lib/format";

// One delegated handler for every "Agregar" button, so product grids ship no per-card JS.
const cart = getCart();

function renderCount() {
  const count = cart.count();
  document.querySelectorAll<HTMLElement>("[data-cart-count]").forEach((badge) => {
    badge.textContent = String(count);
    badge.hidden = count === 0;
  });
}

// Amount stepper on the product page: the container keeps the pack count in data-qty.
function step(button: HTMLElement) {
  const box = button.closest<HTMLElement>("[data-amount]");
  if (!box?.dataset.unit) return;
  const qty = Math.min(Math.max(Number(box.dataset.qty) + Number(button.dataset.step), 1), MAX_QTY);
  box.dataset.qty = String(qty);
  const label = box.querySelector("[data-amount-label]");
  if (label) label.textContent = formatAmount(box.dataset.unit, qty);
  box.querySelector<HTMLButtonElement>('[data-step="-1"]')!.disabled = qty <= 1;
  box.querySelector<HTMLButtonElement>('[data-step="1"]')!.disabled = qty >= MAX_QTY;
}

document.addEventListener("click", (event) => {
  const stepper = (event.target as Element).closest<HTMLElement>("[data-step]");
  if (stepper) return step(stepper);
  const button = (event.target as Element).closest<HTMLButtonElement>("[data-add-to-cart]");
  if (!button) return;
  const { slug, name, unit } = button.dataset;
  if (!slug || !name || !unit) return;
  const qty = Number(button.closest<HTMLElement>("[data-amount]")?.dataset.qty ?? 1);
  cart.add({ slug, name, unit }, qty);
  const label = button.querySelector("[data-label]") ?? button;
  const original = label.textContent;
  label.textContent = "Agregado";
  setTimeout(() => (label.textContent = original), 1500);
  const status = document.querySelector("[data-cart-status]");
  if (status) status.textContent = `${formatAmount(unit, qty)} de ${name} agregado al pedido`;
});

cart.subscribe(renderCount);
renderCount();
