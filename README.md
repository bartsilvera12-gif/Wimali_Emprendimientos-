# WIMALI Emprendimientos — Tienda web

Tienda online de WIMALI: catálogo con precios, ofertas, pedido y cierre de compra por WhatsApp.
Es un sitio estático de un solo archivo: se puede publicar tal cual con **GitHub Pages**.

## Contenido

```
index.html          Toda la tienda (maquetación + lógica del pedido)
support.js          Runtime necesario para index.html
image-slot.js       Componente de los espacios de imagen de producto
assets/
  wimali-logo.png   Logo WIMALI
```

## Publicar con GitHub Pages

1. Crear un repositorio nuevo y subir estos archivos a la raíz.
2. Settings → Pages → Source: `Deploy from a branch` → branch `main`, carpeta `/ (root)`.
3. En 1–2 minutos el sitio queda online en `https://<usuario>.github.io/<repo>/`.

## Configuración del negocio

Dentro de `index.html`, al final, están los datos editables (número de WhatsApp,
dirección, mapa, horarios, Instagram y Facebook). El número actual es
`595995364978`. La dirección figura como "a confirmar" hasta que se defina la
ubicación definitiva; al cambiarla se actualizan el mapa de Google Maps y el
botón "Cómo llegar".

## Productos

Los productos están definidos en la constante `PRODUCTS` (dentro de `index.html`),
con la misma estructura prevista para la base de datos:

`id, slug, name, category, price, previous_price, stock, featured, description`

- `stock: 0` muestra **Agotado** y desactiva el botón de compra.
- `previous_price` genera automáticamente el precio tachado, el porcentaje de
  descuento y la aparición del producto en la sección **Ofertas**.

Para cargar el catálogo definitivo basta reemplazar esa lista: el diseño no cambia.

## Fotos de producto

Cada producto tiene un espacio de imagen. Las fotos definitivas se pueden dejar
fijas indicando la URL o ruta de la imagen en el atributo `src` del
`<image-slot>` correspondiente (por ejemplo `assets/productos/auricular.jpg`).

© WIMALI EMPRENDIMIENTOS
