import { amountLimits, formatAmount, stepAmount } from "@/lib/amount";
import { getCart } from "@/lib/cart";

// One delegated handler for every "Agregar" button, so product grids ship no per-card JS.
const cart = getCart();

function renderCount() {
  const count = cart.count();
  document.querySelectorAll<HTMLElement>("[data-cart-count]").forEach((badge) => {
    badge.textContent = String(count);
    badge.hidden = count === 0;
  });
}

// Amount stepper on the product page: the container keeps the chosen amount in data-amount.
function step(button: HTMLElement) {
  const box = button.closest<HTMLElement>("[data-amount]");
  if (!box?.dataset.unit) return;
  const unit = box.dataset.unit;
  const amount = stepAmount(unit, Number(box.dataset.amount), Number(button.dataset.step) > 0 ? 1 : -1);
  const { min, max } = amountLimits(unit);
  box.dataset.amount = String(amount);
  const label = box.querySelector("[data-amount-label]");
  if (label) label.textContent = formatAmount(unit, amount);
  box.querySelector<HTMLButtonElement>('[data-step="-1"]')!.disabled = amount <= min;
  box.querySelector<HTMLButtonElement>('[data-step="1"]')!.disabled = amount >= max;
}

document.addEventListener("click", (event) => {
  const stepper = (event.target as Element).closest<HTMLElement>("[data-step]");
  if (stepper) return step(stepper);
  const button = (event.target as Element).closest<HTMLButtonElement>("[data-add-to-cart]");
  if (!button) return;
  const { slug, name, unit } = button.dataset;
  if (!slug || !name || !unit) return;
  const chosen = Number(button.closest<HTMLElement>("[data-amount]")?.dataset.amount);
  const amount = chosen > 0 ? chosen : undefined;
  cart.add({ slug, name, unit }, amount);
  const label = button.querySelector("[data-label]") ?? button;
  const original = label.textContent;
  label.textContent = "Agregado";
  setTimeout(() => (label.textContent = original), 1500);
  const status = document.querySelector("[data-cart-status]");
  if (status) status.textContent = `${name} agregado al pedido`;
});

cart.subscribe(renderCount);
renderCount();
