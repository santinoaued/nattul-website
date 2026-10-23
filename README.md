# Nattul: catálogo online

Catálogo de una dietética. El cliente arma una lista de productos y la envía por WhatsApp para consultar precios y disponibilidad. El sitio no muestra precios ni tiene pagos online.

Es un sitio estático hecho con [Astro](https://astro.build), pensado para Cloudflare Pages. Solo el carrito y el buscador cargan JavaScript (islas de Preact); el resto es HTML.

## Requisitos

- Node.js 24 (ver `.nvmrc`).

## Instalar y correr

```bash
npm install
npm run dev
```

El sitio queda en `http://localhost:4321`.

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Genera el sitio en `dist/` |
| `npm run preview` | Sirve `dist/` para revisar el build |
| `npm run check` | Chequeo de tipos de TypeScript y Astro |
| `npm test` | Tests del parser CSV, carrito y mensaje de WhatsApp |
| `npm run check:links` | Busca enlaces internos rotos en `dist/` (correr después del build) |
| `npm run demo:800` | Genera `data/productos-800.csv` con 800 productos sintéticos |

## Estructura

```
data/                    CSV de productos de ejemplo
public/                  Archivos servidos tal cual: favicon, imagen OG, fuentes, _headers
scripts/                 Generador de datos sintéticos y chequeo de enlaces
src/
  assets/                Imágenes de marca y productos (se optimizan en el build)
  components/            Componentes Astro
    islands/             Componentes interactivos: carrito y buscador
  config/site.ts         Datos del negocio
  content.config.ts      Colección de productos
  layouts/               Layout base (head, SEO, header, footer)
  lib/                   Lógica: CSV, esquema de productos, carrito, WhatsApp, formatos
  pages/                 Rutas del sitio
  scripts/               JS del lado del cliente (botones "Agregar" y contador)
  styles/global.css      Tokens de marca: colores, tipografías, espaciados
```

## Datos del negocio

Todo está en `src/config/site.ts`: nombre, WhatsApp, email, redes, sucursales (dirección, horarios, link de mapas), zonas de envío, compra mínima y medios de pago.

Los valores marcados como `PLACEHOLDER` son de ejemplo y se tienen que reemplazar con los datos reales. `demoMode: true` muestra el aviso de sitio de demostración.

## Productos

### De dónde salen

En el build, el sitio lee un CSV:

1. Si `PRODUCTS_CSV_URL` está definida, lee la planilla de Google Sheets publicada como CSV.
2. Si no, lee el archivo de `PRODUCTS_CSV_PATH` (por defecto `data/productos-demo.csv`).

Para publicar la planilla: en Google Sheets, **Archivo → Compartir → Publicar en la web**, elegí la hoja de productos y el formato **CSV**, y copiá el link en `PRODUCTS_CSV_URL`.

Cada cambio en la planilla se ve en el sitio después de un nuevo build. En Cloudflare Pages se puede disparar con un deploy hook.

### Formato de la planilla

La primera fila tiene que tener exactamente estos encabezados:

| Columna | Obligatoria | Formato | Ejemplo |
| --- | --- | --- | --- |
| `id` | Sí | Código único del producto | `NAT-0001` |
| `slug` | No | Minúsculas, números y guiones. Si queda vacío, se genera desde el nombre | `almendras-enteras` |
| `nombre` | Sí | Texto | `Almendras enteras` |
| `categoria` | Sí | Texto. Define las páginas de categoría | `Frutos secos` |
| `subcategoria` | No | Texto | `Almendras y nueces` |
| `unidad` | Sí | `100 g`, `1 kg`, `500 ml`, `1 l` o `unidad` | `250 g` |
| `descripcion` | Sí | Texto | `Almendras con piel...` |
| `imagen` | No | `/products/archivo.jpg` (local) o URL `https://` | `/products/almendras.jpg` |
| `etiquetas` | No | Separadas por `\|`: `sin-tacc`, `vegano`, `organico`, `sin-azucar`, `sin-sal`, `integral` | `sin-tacc\|vegano` |
| `disponible` | Sí | `si` o `no` | `si` |

Si una fila tiene un dato inválido, el build falla e indica el producto y el campo, por ejemplo:

```
products → X-1 data does not match collection schema.
  unit: unidad: "100 g", "1 kg", "500 ml" o "unidad"
```

También falla si hay `id` o `slug` repetidos, o si falta alguna columna.

### Imágenes

- **Locales:** el archivo va en `src/assets/products/` y en la planilla se escribe `/products/<archivo>`. Astro genera versiones AVIF y WebP en varios tamaños.
- **Externas (Cloudflare R2 u otro almacenamiento):** en la planilla va la URL completa `https://...`, y el dominio se agrega en `IMAGES_ORIGIN` para que la política de seguridad lo permita. Estas imágenes no se redimensionan en el build, así que conviene subirlas ya optimizadas: WebP de unos 600 px de lado.

## Deploy en Cloudflare Pages

1. En Cloudflare, ir a **Workers & Pages → Create → Pages → Connect to Git** y elegir este repositorio.
2. Configurar el build:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
3. En **Settings → Environment variables**, cargar:
   - `SITE_URL`: la URL final del sitio (por ejemplo, `https://nattul.pages.dev` o el dominio propio).
   - `PRODUCTS_CSV_URL`: la planilla publicada como CSV (opcional; sin ella se usa el CSV demo).
   - `IMAGES_ORIGIN`: el dominio de las imágenes externas, si las hay.
   - `BASE_PATH`: no hace falta en Cloudflare; solo se usa si el sitio vive dentro de una subcarpeta.
   - La versión de Node se toma de `.nvmrc`.
4. Cada push a la rama principal publica una versión nueva. Para actualizar productos sin tocar el código, crear un **Deploy hook** y llamarlo cuando cambie la planilla.

Los headers de seguridad están en `public/_headers`. La política de contenido (CSP) para scripts y estilos la genera Astro en cada página, con hashes.

## Demo en GitHub Pages

Mientras no esté en Cloudflare, la demo se publica en https://santinoaued.github.io/nattul-website/ con `.github/workflows/pages.yml`, en cada push a `main`. Ese workflow compila con `BASE_PATH=/nattul-website`, porque GitHub Pages sirve el sitio dentro de esa carpeta.

GitHub Pages no aplica `public/_headers`, así que ahí solo rige la CSP de cada página. Cuando el sitio pase a Cloudflare, conviene borrar el workflow y desactivar Pages en la configuración del repositorio.

## Variables de entorno

Ver `.env.example`. Para desarrollo local, copiarlo como `.env`. Ese archivo no se sube al repositorio.

## Créditos y licencias

- Fuentes Fraunces y Outfit: SIL Open Font License, servidas desde `public/fonts`.
- Las fotos de producto de la demo son provisorias y se reemplazan por fotos propias del cliente.
