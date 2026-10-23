export interface OrderLine {
  name: string;
  unit: string;
  qty: number;
}

// wa.me links longer than this start failing in some browsers and WhatsApp clients.
export const MAX_URL_LENGTH = 2000;

const shorten = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

function buildMessage(lines: OrderLine[], nameMax: number, visible: number): string {
  const detail = lines.slice(0, visible).map((line) => `${line.qty} x ${shorten(line.name, nameMax)} (${line.unit})`);
  const hidden = lines.length - visible;
  if (hidden > 0) detail.push(`+ ${hidden} producto${hidden === 1 ? "" : "s"} más`);
  return ["Hola! Quiero consultar precio y disponibilidad de estos productos:", ...detail].join("\n");
}

/** Builds the wa.me link, shortening names and then dropping lines until it fits MAX_URL_LENGTH. */
export function buildOrderUrl(phone: string, lines: OrderLine[]): { url: string; truncated: boolean } {
  const toUrl = (text: string) => `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

  for (const nameMax of [60, 32, 20]) {
    const url = toUrl(buildMessage(lines, nameMax, lines.length));
    if (url.length <= MAX_URL_LENGTH) return { url, truncated: false };
  }
  for (let visible = lines.length - 1; visible > 0; visible--) {
    const url = toUrl(buildMessage(lines, 20, visible));
    if (url.length <= MAX_URL_LENGTH) return { url, truncated: true };
  }
  return { url: toUrl(buildMessage(lines, 20, 0)), truncated: true };
}
