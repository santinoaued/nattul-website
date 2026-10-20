# Nattul Almacén Natural

Sitio de Nattul: catálogo a granel, sucursales en Paraná y Oro Verde, y pedidos por WhatsApp.

## Desarrollo

```bash
npm install
npm run dev
```

El servidor queda en `http://localhost:8080`.

## Build para GitHub Pages

```bash
PAGES_BUILD=1 npx vite build
```

El resultado queda en `.vercel/output/static`. Por defecto, las rutas asumen que el sitio vive en `/nattul-website/`. Para probar en raíz, usá `PAGES_BASE=/`.

## Publicación

Cada push a `main` ejecuta `.github/workflows/pages.yml`, que compila el sitio y lo publica en GitHub Pages. En la configuración del repo, en **Settings → Pages**, la fuente tiene que ser **GitHub Actions**.

## Dónde editar

- Productos, precios y categorías: `src/data/catalog.ts`.
- Sucursales, teléfonos y redes: `src/data/catalog.ts` (`branches`, `socials`).
- Diseño y secciones: `src/components/nattul/site.tsx`.
- Colores y tipografía: `src/styles.css`.
