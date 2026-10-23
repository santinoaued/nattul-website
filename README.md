# Nattul: catálogo online

Catálogo de una dietética con pedido por WhatsApp. Sitio estático hecho con Astro, pensado para Cloudflare Pages.

En construcción: la documentación completa se agrega en la fase 7.

## Desarrollo

```bash
npm install
npm run dev
```

## Productos

Los productos salen de un CSV con estas columnas:

`id, slug, nombre, categoria, subcategoria, precio, unidad, descripcion, imagen, etiquetas, disponible`

- Si `PRODUCTS_CSV_URL` está definida, se lee la planilla de Google Sheets publicada como CSV.
- Si no, se lee `PRODUCTS_CSV_PATH` (por defecto `data/productos-demo.csv`).
- `npm run demo:800` genera `data/productos-800.csv` con 800 productos sintéticos para pruebas de rendimiento.

Los datos se validan durante el build. Si una fila es inválida, el build falla e indica el producto y el campo.

## Datos del negocio

Están en `src/config/site.ts`. Los valores marcados como PLACEHOLDER se reemplazan con los datos reales del cliente.
