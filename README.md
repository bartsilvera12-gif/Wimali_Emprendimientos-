# WIMALI Emprendimientos — Tienda web

Tienda online de WIMALI: catálogo con precios, ofertas, pedido y cierre de compra por WhatsApp.
Construida con **React + Vite** y componentes animados de **[ReactBits](https://reactbits.dev)**
(fondo Aurora, texto animado, contadores, tarjetas con spotlight, revelado al hacer scroll y
chispas al hacer clic).

## Desarrollo

```
npm install
npm run dev      # servidor local en http://localhost:5173
npm run build    # build de producción en dist/
```

## Contenido

```
index.html                  Entrada de Vite (título, fuentes, favicon)
src/
  config.js                 Datos del negocio (WhatsApp, dirección, horarios, redes)
  data/products.js          Catálogo de productos
  utils.js                  Formato de precios, mensajes de WhatsApp, mapa
  store.jsx                 Estado global (carrito, búsqueda, filtros, navegación)
  App.jsx                   Composición de la página
  index.css                 Estilos del rediseño
  components/               Secciones de la tienda (héroe, catálogo, ofertas, carrito…)
  blocks/                   Componentes de ReactBits (Aurora, SplitText, CountUp,
                            SpotlightCard, AnimatedContent, ClickSpark, ShinyText,
                            GradientText)
public/assets/
  wimali-logo.png           Logo WIMALI
```

`support.js`, `image-slot.js` y `assets/` en la raíz pertenecen a la versión estática
anterior y ya no se usan (la versión anterior completa queda en el historial de git).

## Configuración del negocio

Todo está en [src/config.js](src/config.js): número de WhatsApp, dirección, consulta del mapa,
horarios, Instagram y Facebook. El número actual es `595995364978`. La dirección figura como
"a confirmar" hasta que se defina la ubicación definitiva; al cambiarla se actualizan el mapa
de Google Maps y el botón "Cómo llegar".

## Productos

Los productos están en [src/data/products.js](src/data/products.js), con la misma estructura
prevista para la base de datos:

`id, slug, name, category, price, previous_price, stock, featured, description`

- `stock: 0` muestra **Agotado** y desactiva el botón de compra.
- `previous_price` genera automáticamente el precio tachado, el porcentaje de
  descuento y la aparición del producto en la sección **Ofertas**.
- `image` (opcional): URL o ruta de la foto principal, por ejemplo
  `assets/productos/auricular.jpg` (los archivos van en `public/assets/productos/`).
  `image2` (opcional) agrega una segunda foto en la ficha del producto.
  Sin foto se muestra un marcador de posición con el monograma del producto.
  Las fotos actuales provienen del `Foto.pdf` del negocio (12 fotos, agosto 2026).

Para cargar el catálogo definitivo basta reemplazar esa lista: el diseño no cambia.

## Publicar con GitHub Pages

El sitio ahora requiere un paso de build, así que hay dos opciones:

1. **GitHub Actions (recomendado):** Settings → Pages → Source: `GitHub Actions`, con el
   workflow oficial de Vite (sube el contenido de `dist/`).
2. **Manual:** ejecutar `npm run build` y publicar la carpeta `dist/` (por ejemplo en una
   rama `gh-pages`). El build usa rutas relativas (`base: './'`), por lo que funciona bajo
   `https://<usuario>.github.io/<repo>/` sin configuración extra.

## MCP de shadcn

El repo incluye `.mcp.json` con el servidor MCP de shadcn (`npx shadcn@latest mcp`), útil para
explorar e instalar más componentes del registry de ReactBits desde Claude Code.

© WIMALI EMPRENDIMIENTOS
