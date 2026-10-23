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

document.addEventListener("click", (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>("[data-add-to-cart]");
  if (!button) return;
  const { slug, name, unit } = button.dataset;
  if (!slug || !name || !unit) return;
  cart.add({ slug, name, unit });
  const label = button.querySelector("[data-label]") ?? button;
  const original = label.textContent;
  label.textContent = "Agregado";
  setTimeout(() => (label.textContent = original), 1500);
  const status = document.querySelector("[data-cart-status]");
  if (status) status.textContent = `${name} agregado al pedido`;
});

cart.subscribe(renderCount);
renderCount();
