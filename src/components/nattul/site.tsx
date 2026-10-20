import { useMemo, useState, type FormEvent } from "react";
import { asset } from "@/lib/asset";
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  ShoppingBag,
  X,
} from "lucide-react";
import {
  allProducts,
  branches,
  categories,
  formatGrams,
  socials,
  waHref,
  type BranchId,
  type Product,
} from "@/data/catalog";

export function Site() {
  const [slide, setSlide] = useState(0);
  const category = categories[slide];
  const [menuOpen, setMenuOpen] = useState(false);
  const [branchId, setBranchId] = useState<BranchId>("parana");
  const [grams, setGrams] = useState<Record<string, number>>(() =>
    Object.fromEntries(allProducts.map((product) => [product.id, product.defaultGrams])),
  );
  const [cart, setCart] = useState<Record<string, number>>({});
  const [trayOpen, setTrayOpen] = useState(false);
  const [waOpen, setWaOpen] = useState(false);
  const [form, setForm] = useState({ name: "", message: "", branchId: "parana" as BranchId });

  const branch = branches.find((item) => item.id === branchId) ?? branches[0];
  const lines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, amount]) => {
          const product = allProducts.find((item) => item.id === id);
          if (!product) return null;
          return { product, grams: amount };
        })
        .filter((line): line is { product: (typeof allProducts)[number]; grams: number } => Boolean(line)),
    [cart],
  );

  function goTo(index: number) {
    setSlide((index + categories.length) % categories.length);
  }

  function chooseGrams(product: Product, amount: number) {
    setGrams((current) => ({ ...current, [product.id]: amount }));
    setCart((current) => (current[product.id] ? { ...current, [product.id]: amount } : current));
  }

  function addProduct(product: Product) {
    const amount = grams[product.id] ?? product.defaultGrams;
    setCart((current) => ({ ...current, [product.id]: amount }));
    setTrayOpen(true);
  }

  function removeProduct(id: string) {
    setCart((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function orderMessage(targetName: string) {
    if (lines.length === 0) {
      return `Hola Nattul! Quería consultar productos, stock y horarios de la sucursal ${targetName}.`;
    }
    const body = lines
      .map((line) => `• ${line.product.name} — ${formatGrams(line.grams)}`)
      .join("\n");
    return `Hola Nattul! Armé este pedido:\n${body}\nLo retiraría en sucursal ${targetName}.`;
  }

  function openWhatsapp(targetId: BranchId) {
    const target = branches.find((item) => item.id === targetId) ?? branches[0];
    window.open(waHref(target.wa, orderMessage(target.name)), "_blank", "noopener,noreferrer");
    setWaOpen(false);
  }

  function submitContact(event: FormEvent) {
    event.preventDefault();
    const target = branches.find((item) => item.id === form.branchId) ?? branches[0];
    const who = form.name.trim() ? `Soy ${form.name.trim()}. ` : "";
    const text = `Hola Nattul ${target.name}! ${who}${form.message.trim() || "Quería hacer una consulta."}`;
    window.open(waHref(target.wa, text), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:px-6">
          <a href="#inicio" className="shrink-0">
            <img src={asset("/brand/logo.png")} alt="Nattul Almacén Natural" className="h-12 w-auto md:h-14" />
          </a>
          <nav className="ml-auto hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="#catalogo" className="hover:text-forest">
              Catálogo
            </a>
            <a href="#sucursales" className="hover:text-forest">
              Sucursales
            </a>
            <a href="#contacto" className="hover:text-forest">
              Contacto
            </a>
            <a href={socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-forest">
              <Instagram className="size-5" />
            </a>
            <a href={socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="text-forest">
              <Facebook className="size-5" />
            </a>
          </nav>
          <button
            type="button"
            onClick={() => setWaOpen((open) => !open)}
            className="hidden h-11 items-center gap-2 rounded-full bg-forest px-4 text-sm font-medium text-cream md:inline-flex"
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </button>
          <button
            type="button"
            className="ml-auto inline-flex size-11 items-center justify-center rounded-full border border-line md:hidden"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {menuOpen ? (
          <div className="border-t border-line px-4 py-4 md:hidden">
            <div className="flex flex-col gap-1 text-lg">
              <a href="#catalogo" onClick={() => setMenuOpen(false)} className="rounded-2xl px-3 py-3 hover:bg-foam">
                Catálogo
              </a>
              <a href="#sucursales" onClick={() => setMenuOpen(false)} className="rounded-2xl px-3 py-3 hover:bg-foam">
                Sucursales
              </a>
              <a href="#contacto" onClick={() => setMenuOpen(false)} className="rounded-2xl px-3 py-3 hover:bg-foam">
                Contacto
              </a>
            </div>
          </div>
        ) : null}
      </header>

      <main>
        <section id="inicio" className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:px-6 md:py-20">
          <div>
            <p className="text-sm font-medium tracking-wide text-leaf">Oro Verde · Paraná</p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-deep md:text-6xl">
              Tu punto sano en la ciudad.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Almacén natural y dietética. Frutos secos, semillas, cacao y yerba, con la calma de elegir a granel
              y pedir por WhatsApp a la sucursal que te quede cerca.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#catalogo"
                className="inline-flex h-12 items-center rounded-full bg-forest px-5 font-medium text-cream"
              >
                Ver el catálogo
              </a>
              <button
                type="button"
                onClick={() => setWaOpen(true)}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-forest px-5 font-medium text-forest"
              >
                <MessageCircle className="size-4" />
                Escribir al local
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img
              src={asset("/products/almendras.jpg")}
              alt="Almendras a granel"
              className="row-span-2 h-full min-h-80 w-full rounded-card object-cover"
            />
            <img src={asset("/products/cacao.jpg")} alt="Cacao amargo en polvo" className="h-40 w-full rounded-card object-cover md:h-48" />
            <img src={asset("/products/avena.jpg")} alt="Avena arrollada" className="h-40 w-full rounded-card object-cover md:h-48" />
          </div>
        </section>

        <section className="border-y border-line bg-paper">
          <ol className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
            <li>
              <p className="font-display text-3xl text-leaf">1</p>
              <p className="mt-2 font-medium">Elegí los gramos</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">Desde 100 g. Te llevás lo que vas a comer.</p>
            </li>
            <li>
              <p className="font-display text-3xl text-leaf">2</p>
              <p className="mt-2 font-medium">Sumá al pedido</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">Arrancá con la yerba, el cacao o lo que te falte.</p>
            </li>
            <li>
              <p className="font-display text-3xl text-leaf">3</p>
              <p className="mt-2 font-medium">Mandalo por WhatsApp</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">El local confirma stock antes de que vayas.</p>
            </li>
          </ol>
        </section>

        <section id="catalogo" className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-4xl text-deep md:text-5xl">Seis góndolas, un desliz.</h2>
          </div>

          <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
            {categories.map((category, index) => {
              const active = index === slide;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => goTo(index)}
                  className={`h-11 shrink-0 rounded-full px-4 text-sm font-medium ${
                    active ? "bg-forest text-cream" : "bg-paper text-ink border border-line"
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>

          <article className="mt-6">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-5">
              <div>
                <p className="text-sm font-medium text-leaf">{category.kicker}</p>
                <h3 className="mt-1 font-display text-3xl text-deep">{category.name}</h3>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-muted">{category.description}</p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:mt-8 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-10">
              {category.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  grams={grams[product.id] ?? product.defaultGrams}
                  inCart={Boolean(cart[product.id])}
                  onGrams={(amount) => chooseGrams(product, amount)}
                  onAdd={() => addProduct(product)}
                />
              ))}
            </div>
          </article>
        </section>

        <section id="sucursales" className="bg-deep text-cream">
          <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
            <h2 className="max-w-xl font-display text-4xl md:text-5xl">Dos sucursales, el mismo almacén.</h2>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {branches.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-card bg-forest">
                  <iframe
                    title={`Mapa de la sucursal ${item.name}`}
                    src={item.embed}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-64 w-full border-0"
                  />
                  <div className="space-y-4 p-5">
                    <div>
                      <h3 className="font-display text-3xl">{item.name}</h3>
                      <p className="mt-2 flex items-start gap-2 text-foam">
                        <MapPin className="mt-0.5 size-4 shrink-0" />
                        <span>
                          {item.address}
                          <br />
                          {item.city}
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={item.phoneHref}
                        className="inline-flex h-11 items-center rounded-full bg-cream px-4 text-sm font-medium text-deep"
                      >
                        {item.phone}
                      </a>
                      <button
                        type="button"
                        onClick={() => openWhatsapp(item.id)}
                        className="inline-flex h-11 items-center gap-2 rounded-full border border-foam px-4 text-sm font-medium text-cream"
                      >
                        <MessageCircle className="size-4" />
                        WhatsApp
                      </button>
                      <a
                        href={item.maps}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 items-center gap-1 rounded-full border border-foam px-4 text-sm font-medium text-cream"
                      >
                        Cómo llegar
                        <ArrowUpRight className="size-4" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contacto" className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:px-6 md:py-20">
          <div>
            <h2 className="font-display text-4xl text-deep md:text-5xl">Escribinos como al mostrador.</h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted">
              Horarios y stock cambian según el día. El mensaje abre WhatsApp de la sucursal que elijas, con tu
              consulta ya escrita.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              <li>
                <a href={`mailto:${socials.email}`} className="inline-flex items-center gap-2 font-medium text-forest">
                  <Mail className="size-4" />
                  {socials.email}
                </a>
              </li>
              <li>
                <a href={socials.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-medium text-forest">
                  <Instagram className="size-4" />
                  @nattul.almacennatural
                </a>
              </li>
              <li>
                <a href={socials.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-medium text-forest">
                  <Facebook className="size-4" />
                  Nattul Almacén Natural
                </a>
              </li>
            </ul>
          </div>
          <form onSubmit={submitContact} className="rounded-card border border-line bg-paper p-5 md:p-6">
            <label className="block text-sm font-medium" htmlFor="nombre">
              Nombre
            </label>
            <input
              id="nombre"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="mt-2 h-12 w-full rounded-2xl border border-line bg-cream px-4 outline-none focus:border-forest"
              placeholder="Cómo te llamamos"
            />
            <p className="mt-4 text-sm font-medium">Sucursal</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {branches.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, branchId: item.id }))}
                  className={`h-11 rounded-full text-sm font-medium ${
                    form.branchId === item.id ? "bg-forest text-cream" : "border border-line bg-cream text-ink"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <label className="mt-4 block text-sm font-medium" htmlFor="mensaje">
              Mensaje
            </label>
            <textarea
              id="mensaje"
              required
              value={form.message}
              onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
              rows={4}
              className="mt-2 w-full rounded-2xl border border-line bg-cream px-4 py-3 outline-none focus:border-forest"
              placeholder="¿Qué estás buscando?"
            />
            <button type="submit" className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-forest font-medium text-cream">
              <MessageCircle className="size-4" />
              Enviar por WhatsApp
            </button>
          </form>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-end md:justify-between md:px-6">
          <div>
            <img src={asset("/brand/logo.png")} alt="" className="h-10 w-auto" />
            <p className="mt-3 max-w-sm text-sm text-muted">Tu punto sano en la ciudad. Oro Verde y Paraná, Entre Ríos.</p>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Nattul nace de NaturalMente Dietética, la dietética online de la zona, y hoy abre la puerta en dos locales.
            </p>
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-muted">
              Fotos de Wikimedia Commons:{" "}
              <a href="https://commons.wikimedia.org/wiki/File:Traditional_mate_set_calabash_gourd_with_La_Merced_yerba_mate.jpg" className="underline" target="_blank" rel="noreferrer">Siarhei Besarab</a>,{" "}
              <a href="https://commons.wikimedia.org/wiki/File:Gr%C3%BCner_Mate_geschnitten.jpg" className="underline" target="_blank" rel="noreferrer">André Helbig</a>,{" "}
              <a href="https://commons.wikimedia.org/wiki/File:Erva_mate_chimarrao_in_big_cuia.jpg" className="underline" target="_blank" rel="noreferrer">ChimaAddicted</a>,{" "}
              <a href="https://commons.wikimedia.org/wiki/File:Blanc-manger_with_cocoa_powder_and_almonds.jpg" className="underline" target="_blank" rel="noreferrer">SKopp</a>,{" "}
              <a href="https://commons.wikimedia.org/wiki/File:Annatto_Seeds.jpg" className="underline" target="_blank" rel="noreferrer">Misterneedlemouse</a> y{" "}
              <a href="https://commons.wikimedia.org/wiki/File:Trail_Mix.JPG" className="underline" target="_blank" rel="noreferrer">Papathanasiouk</a>. Licencias CC BY-SA y CC0.
            </p>
            <p className="mt-4 max-w-sm text-xs text-muted">
              © 2026{" "}
              <a href="https://santinoaued.github.io" className="underline" target="_blank" rel="noreferrer">Santino Aued</a>
            </p>
          </div>
        </div>
      </footer>

      {lines.length > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper">
          <div className="mx-auto max-w-6xl px-4 py-3 md:px-6">
            <button
              type="button"
              onClick={() => setTrayOpen((open) => !open)}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <span className="inline-flex items-center gap-2 font-medium">
                <ShoppingBag className="size-4 text-forest" />
                Pedido · {lines.length} {lines.length === 1 ? "ítem" : "ítems"}
              </span>
            </button>
            {trayOpen ? (
              <div className="mt-3 max-h-64 space-y-3 overflow-y-auto border-t border-line pt-3">
                {lines.map((line) => (
                  <div key={line.product.id} className="flex items-center justify-between gap-3 text-sm">
                    <div>
                      <p className="font-medium">{line.product.name}</p>
                      <p className="text-muted">{formatGrams(line.grams)}</p>
                    </div>
                    <button type="button" onClick={() => removeProduct(line.product.id)} className="h-11 px-2 text-forest">
                      Quitar
                    </button>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-2">
                  {branches.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setBranchId(item.id)}
                      className={`h-11 rounded-full text-sm font-medium ${
                        branchId === item.id ? "bg-forest text-cream" : "border border-line text-ink"
                      }`}
                    >
                      Retiro en {item.name}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => openWhatsapp(branchId)}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-forest font-medium text-cream"
                >
                  <MessageCircle className="size-4" />
                  Mandar pedido a {branch.name}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {trayOpen ? null : (
      <div className={`fixed right-4 z-50 ${lines.length > 0 ? "bottom-24" : "bottom-5"}`}>
        {waOpen ? (
          <div className="mb-3 w-64 rounded-card border border-line bg-paper p-3 shadow-lg">
            <p className="px-1 text-sm font-medium">¿A qué sucursal escribís?</p>
            <div className="mt-2 flex flex-col gap-2">
              {branches.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openWhatsapp(item.id)}
                  className="h-11 rounded-full bg-forest px-3 text-sm font-medium text-cream"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <button
          type="button"
          aria-label="Abrir WhatsApp"
          onClick={() => setWaOpen((open) => !open)}
          className="inline-flex size-14 items-center justify-center rounded-full bg-forest text-cream shadow-lg"
        >
          {waOpen ? <X className="size-6" /> : <MessageCircle className="size-6" />}
        </button>
      </div>
      )}
    </div>
  );
}

function ProductCard({
  product,
  grams,
  inCart,
  onGrams,
  onAdd,
}: {
  product: Product;
  grams: number;
  inCart: boolean;
  onGrams: (grams: number) => void;
  onAdd: () => void;
}) {
  return (
    <article className="flex flex-col">
      {product.image ? (
        <img src={asset(product.image)} alt={product.name} className="aspect-square w-full rounded-2xl object-cover md:aspect-[4/3]" />
      ) : (
        <div className="flex aspect-square flex-col justify-between rounded-2xl bg-forest p-4 text-cream md:aspect-[4/3] md:p-5">
          <img src={asset("/brand/mark-cream.png")} alt="" className="size-12 md:size-14" />
          <div>
            <p className="text-sm text-foam">{formatGrams(grams)}</p>
            <p className="font-display text-2xl leading-tight md:text-3xl">{product.name}</p>
          </div>
        </div>
      )}
      <div className="flex flex-1 flex-col pt-4">
        {product.image ? <h4 className="font-display text-xl text-deep md:text-2xl">{product.name}</h4> : null}
        <p className="mt-1 text-sm leading-relaxed text-muted">{product.note}</p>
        <p className="mt-2 text-xs font-medium text-leaf">{product.tags.join(", ")}</p>
        <div className="mt-4 flex flex-wrap gap-1.5 md:gap-2">
          {product.gramsOptions.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => onGrams(amount)}
              className={`h-11 rounded-full px-2.5 text-sm font-medium md:px-3 ${
                grams === amount ? "bg-deep text-cream" : "border border-line bg-paper text-ink"
              }`}
            >
              {formatGrams(amount)}
            </button>
          ))}
        </div>
        <div className="mt-5">
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-forest px-4 text-sm font-medium text-cream"
          >
            {inCart ? "En el pedido" : "Sumar"}
          </button>
        </div>
      </div>
    </article>
  );
}
