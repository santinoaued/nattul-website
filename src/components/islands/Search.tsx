import { href } from "@/lib/url";
import { useEffect, useMemo, useState } from "preact/hooks";
import { formatPrice, normalize } from "@/lib/format";
import type { Tag } from "@/lib/products";
import { loadIndex, type IndexEntry } from "@/lib/search-index";

interface Props {
  categories: { slug: string; name: string }[];
  tags: Record<Tag, string>;
  placeholder: string;
}

const STEP = 48;

function readParams() {
  const params = new URLSearchParams(location.search);
  return { q: params.get("q") ?? "", cat: params.get("categoria") ?? "", tags: params.getAll("etiqueta") as Tag[] };
}

export default function Search({ categories, tags, placeholder }: Props) {
  const [index, setIndex] = useState<IndexEntry[] | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [limit, setLimit] = useState(STEP);

  useEffect(() => {
    const initial = readParams();
    setQuery(initial.q);
    setCategory(initial.cat);
    setSelectedTags(initial.tags.filter((tag) => tag in tags));
    loadIndex().then(setIndex, () => setError(true));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("categoria", category);
    selectedTags.forEach((tag) => params.append("etiqueta", tag));
    const search = params.toString();
    history.replaceState(null, "", search ? `?${search}` : location.pathname);
    setLimit(STEP);
  }, [query, category, selectedTags]);

  const results = useMemo(() => {
    if (!index) return [];
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    return index.filter(
      (entry) =>
        (!category || entry.c === category) &&
        selectedTags.every((tag) => entry.t.includes(tag)) &&
        terms.every((term) => normalize(`${entry.n} ${entry.cn}`).includes(term)),
    );
  }, [index, query, category, selectedTags]);

  const toggleTag = (tag: Tag) =>
    setSelectedTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));

  return (
    <div>
      <form role="search" class="grid gap-4 md:grid-cols-[1fr_16rem]" onSubmit={(event) => event.preventDefault()}>
        <div>
          <label for="search-query" class="text-sm font-medium">
            Buscar
          </label>
          <input
            id="search-query"
            type="search"
            value={query}
            onInput={(event) => setQuery(event.currentTarget.value)}
            placeholder="Ej.: almendras, avena, sin TACC"
            class="mt-2 h-12 w-full rounded-full border border-line bg-paper px-5"
          />
        </div>
        <div>
          <label for="search-category" class="text-sm font-medium">
            Categoría
          </label>
          <select
            id="search-category"
            value={category}
            onChange={(event) => setCategory(event.currentTarget.value)}
            class="mt-2 h-12 w-full rounded-full border border-line bg-paper px-4"
          >
            <option value="">Todas</option>
            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <fieldset class="md:col-span-2">
          <legend class="text-sm font-medium">Características</legend>
          <div class="mt-2 flex flex-wrap gap-2">
            {(Object.entries(tags) as [Tag, string][]).map(([tag, label]) => (
              <label key={tag} class="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-paper px-4 text-sm has-[:checked]:border-forest has-[:checked]:bg-forest has-[:checked]:text-cream">
                <input type="checkbox" class="sr-only" checked={selectedTags.includes(tag)} onChange={() => toggleTag(tag)} />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      </form>

      <p role="status" class="mt-8 text-sm text-muted">
        {error
          ? "No pudimos cargar el catálogo. Probá recargar la página."
          : index === null
            ? "Cargando productos…"
            : `${results.length} producto${results.length === 1 ? "" : "s"}`}
      </p>

      <ul class="mt-4 grid min-h-[80vh] grid-cols-2 content-start gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {results.slice(0, limit).map((entry) => (
          <li key={entry.s} class="flex flex-col">
            <a href={href(`/productos/${entry.s}/`)} class="group block">
              {entry.i ? (
                <img src={entry.i} alt="" width={300} height={300} loading="lazy" decoding="async" class="aspect-square w-full rounded-2xl bg-foam object-cover" />
              ) : (
                <div class="flex aspect-square w-full items-center justify-center rounded-2xl bg-forest">
                  <img src={placeholder} alt="" width={56} height={56} class="size-14 opacity-80" />
                </div>
              )}
              <h2 class="mt-3 font-display text-lg leading-snug text-deep group-hover:underline">{entry.n}</h2>
            </a>
            <p class="mt-1 text-sm text-muted">{entry.u}</p>
            <div class="mt-auto flex items-center justify-between gap-2 pt-3">
              <p class="font-display text-lg text-deep">{formatPrice(entry.p)}</p>
              {entry.a ? (
                <button
                  type="button"
                  data-add-to-cart
                  data-slug={entry.s}
                  data-name={entry.n}
                  data-unit={entry.u}
                  data-price={entry.p}
                  aria-label={`Agregar ${entry.n} al pedido`}
                  class="inline-flex h-11 items-center rounded-full bg-forest px-4 text-sm font-medium text-cream"
                >
                  <span data-label>Agregar</span>
                </button>
              ) : (
                <span class="text-sm text-muted">Sin stock</span>
              )}
            </div>
          </li>
        ))}
      </ul>

      {results.length > limit && (
        <div class="mt-10 text-center">
          <button type="button" class="inline-flex h-12 items-center rounded-full border border-forest px-6 font-medium text-forest" onClick={() => setLimit(limit + STEP)}>
            Ver más productos
          </button>
        </div>
      )}
    </div>
  );
}
