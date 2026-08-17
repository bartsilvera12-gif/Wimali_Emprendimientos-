-- =====================================================================
-- WIMALI EMPRENDIMIENTOS — 0005: datos demo (migración de PRODUCTS actual)
-- Idempotente: se puede correr varias veces sin duplicar.
-- =====================================================================

-- ---------- Categorías ------------------------------------------------
insert into wimaliemprendimientos.categories (name, slug, sort_order, active) values
  ('Tecnología', 'tecnologia', 1, true),
  ('Accesorios', 'accesorios', 2, true),
  ('Celulares',  'celulares',  3, true),
  ('Audio',      'audio',      4, true),
  ('Hogar',      'hogar',      5, true),
  ('Belleza',    'belleza',    6, true),
  ('Otros',      'otros',      7, true)
on conflict (slug) do nothing;

-- Imagen de portada de categorías (idempotente).
update wimaliemprendimientos.categories
set image_url = '/assets/categorias/accesorios.jpg'
where slug = 'accesorios';

-- ---------- Datos del negocio (una config activa) --------------------
insert into wimaliemprendimientos.business_settings (
  business_name, whatsapp_number, phone_display, address, map_query,
  opening_hours, shipping_text, payment_text, seo_title, seo_description, active
)
select
  'WIMALI EMPRENDIMIENTOS',
  '595995364978',
  '+595 995 364 978',
  'Dirección a confirmar · Paraguay',
  '',
  'Lunes a viernes 8:00 – 18:00 · Sábados 8:00 – 13:00',
  'Retiro en local y envíos a todo el país',
  'Efectivo o transferencia',
  'WIMALI Emprendimientos | Tecnología, Accesorios y Más',
  'Encontrá tecnología, accesorios, productos para el hogar, belleza y mucho más en WIMALI. Elegí tus productos y finalizá tu pedido fácilmente por WhatsApp.',
  true
where not exists (select 1 from wimaliemprendimientos.business_settings);

-- ---------- Secciones editables --------------------------------------
insert into wimaliemprendimientos.site_sections (section_key, eyebrow, title, subtitle, button_text, button_url, sort_order, active) values
  ('hero',         'WIMALI EMPRENDIMIENTOS', 'Todo lo que necesitás, en un solo lugar.', 'Tecnología, accesorios, hogar, belleza y mucho más. Encontrá lo que buscás y hacé tu pedido fácilmente por WhatsApp.', 'Ver productos', '#productos', 1, true),
  ('catalog',      'CATÁLOGO', 'Productos destacados', null, null, null, 2, true),
  ('offers',       'PROMOCIONES', 'Ofertas que no podés dejar pasar', 'Precios con descuento por tiempo limitado. Consultá disponibilidad antes de finalizar tu pedido.', null, null, 3, true),
  ('whatsapp_cta', null, '¿Encontraste lo que buscabas?', 'Hacé tu pedido directamente por WhatsApp y te ayudamos a finalizar tu compra.', 'Comprar por WhatsApp', null, 4, true),
  ('about',        'NOSOTROS', 'Sobre WIMALI', 'En WIMALI buscamos acercarte productos útiles, modernos y de calidad en un solo lugar, con una experiencia de compra sencilla y atención personalizada.', null, null, 5, true),
  ('location',     'UBICACIÓN', 'Encontranos', null, null, null, 6, true),
  ('social',       'REDES', 'Seguinos', null, null, null, 7, true),
  ('footer',       null, 'Todo lo que necesitás, en un solo lugar.', null, null, null, 8, true)
on conflict (section_key) do nothing;

-- ---------- Beneficios (Nosotros) ------------------------------------
insert into wimaliemprendimientos.benefits (title, description, icon, sort_order, active) values
  ('Variedad de productos', 'Tecnología, accesorios, hogar y belleza en un mismo catálogo.', 'package', 1, true),
  ('Atención personalizada', 'Te asesoramos por WhatsApp antes y después de tu compra.', 'message-circle', 2, true),
  ('Compra fácil', 'Elegí, agregá al pedido y finalizá en dos toques.', 'shopping-cart', 3, true),
  ('Confianza', 'Precios claros, stock real y ubicación visible.', 'shield-check', 4, true)
on conflict do nothing;

-- ---------- Redes sociales -------------------------------------------
insert into wimaliemprendimientos.social_links (platform, label, url, icon, sort_order, active) values
  ('instagram', 'Instagram', 'https://instagram.com/', 'instagram', 1, true),
  ('facebook',  'Facebook',  'https://facebook.com/',  'facebook',  2, true),
  ('whatsapp',  'WhatsApp',  'https://wa.me/595995364978', 'whatsapp', 3, true)
on conflict do nothing;

-- ---------- Productos (migración de los 16 actuales) -----------------
-- Helper de categoría por slug se resuelve inline en cada INSERT.
insert into wimaliemprendimientos.products
  (category_id, sku, slug, name, short_description, description, price, previous_price, stock, featured, is_new, is_offer, active, sort_order)
values
  ((select id from wimaliemprendimientos.categories where slug='audio'),      'WM-0001', 'microfono-inalambrico-dual',   'Micrófono inalámbrico dual',            'Set de dos micrófonos inalámbricos BYZ K9.', 'Set BYZ K9 de dos micrófonos inalámbricos con receptor USB-C y Lightning. Ideal para creación de contenido, entrevistas y transmisiones en vivo. Incluye estuche de carga.', 320000, 420000, 6, true, false, true, true, 1),
  ((select id from wimaliemprendimientos.categories where slug='audio'),      'WM-0002', 'auricular-bluetooth-tws',      'Auricular Bluetooth TWS',               'Auriculares M10 Bluetooth 5.3 con estuche.', 'Auriculares M10 in-ear con Bluetooth 5.3, estuche de carga con indicador digital y hasta 5 horas de autonomía por carga. Manos libres para llamadas.', 165000, null, 14, true, true, false, true, 2),
  ((select id from wimaliemprendimientos.categories where slug='accesorios'), 'WM-0003', 'cargador-rapido-usb-c-20w',    'Cargador rápido USB-C 20W',             'Cargador de pared PD 20W con cable.', 'Cargador de pared Ecopower EP-7050 con carga rápida PD de 20W y cable USB-C a USB-C incluido. Compatible con celulares Android y iPhone.', 85000, null, 22, true, false, false, true, 3),
  ((select id from wimaliemprendimientos.categories where slug='tecnologia'), 'WM-0004', 'power-bank-12000mah',          'Power bank inalámbrico 12.000 mAh',     'Batería portátil MagSafe 12.000 mAh.', 'Batería portátil Ecopower EP-C852 Smart Charge de 12.000 mAh con carga inalámbrica magnética, soporte plegable y carga rápida. Disponible en blanco y negro.', 210000, 260000, 9, true, false, true, true, 4),
  ((select id from wimaliemprendimientos.categories where slug='tecnologia'), 'WM-0005', 'consola-retro-portatil',       'Consola retro portátil',                'Consola LUO con 400 juegos clásicos.', 'Consola portátil LUO LU-SY04 con pantalla a color y 400 juegos clásicos precargados. Salida de video para TV y cables incluidos.', 295000, null, 5, true, true, false, true, 5),
  ((select id from wimaliemprendimientos.categories where slug='accesorios'), 'WM-0006', 'soporte-celular-escritorio',   'Soporte de celular para escritorio',    'Soporte magnético plegable ajustable.', 'Soporte magnético plegable LUO LU-4011 con ángulo ajustable y anillo metálico adhesivo incluido. Para escritorio, cocina o mesa de luz.', 55000, null, 30, true, false, false, true, 6),
  ((select id from wimaliemprendimientos.categories where slug='tecnologia'), 'WM-0007', 'aro-de-luz-26cm-tripode',      'Aro de luz 26 cm con trípode',          'Aro de luz LED con trípode extensible.', 'Aro de luz LED con tres temperaturas de color, diez niveles de intensidad, trípode extensible y soporte para celular.', 180000, 230000, 7, true, false, true, true, 7),
  ((select id from wimaliemprendimientos.categories where slug='audio'),      'WM-0008', 'microfono-solapero-lavalier',  'Micrófono solapero lavalier',           'Micrófono de solapa con cable 2 m.', 'Micrófono de solapa con cable de 2 metros y adaptador para celular o cámara. Sonido claro para videos y entrevistas.', 75000, null, 18, true, false, false, true, 8),
  ((select id from wimaliemprendimientos.categories where slug='belleza'),    'WM-0009', 'set-brochas-maquillaje',       'Set de brochas de maquillaje x12',      'Set de 12 brochas con estuche.', 'Set de doce brochas de fibra suave con estuche organizador. Para base, polvos, rubor y detalles de ojos.', 95000, 125000, 11, true, false, true, true, 9),
  ((select id from wimaliemprendimientos.categories where slug='hogar'),      'WM-0010', 'organizador-multiuso-hogar',   'Organizador multiuso para hogar',       'Organizador plegable con divisiones.', 'Organizador plegable con divisiones ajustables. Ideal para ropa, accesorios y artículos de escritorio.', 60000, null, 25, true, false, false, true, 10),
  ((select id from wimaliemprendimientos.categories where slug='celulares'),  'WM-0011', 'smartwatch-deportivo',         'Smartwatch deportivo',                  'Reloj inteligente con modos deportivos.', 'Reloj inteligente con medición de pulso, notificaciones, modos deportivos y correa de silicona intercambiable.', 240000, 290000, 8, true, false, true, true, 11),
  ((select id from wimaliemprendimientos.categories where slug='accesorios'), 'WM-0012', 'cable-hdmi-4k-2m',             'Cable HDMI 4K 2 m',                     'Cable HDMI 2.0 4K 60Hz de 2 metros.', 'Cable HDMI 2.0 de dos metros con soporte 4K a 60 Hz. Conectores reforzados.', 45000, null, 0, true, false, false, true, 12),
  ((select id from wimaliemprendimientos.categories where slug='accesorios'), 'WM-0013', 'cargador-con-cable-type-c',    'Cargador con cable Type-C 2.1A',        'Cargador con cable Type-C integrado.', 'Cargador de pared Ecopower EP-7053 con cable Type-C integrado y puerto USB adicional, 2.1A. Carga dos dispositivos a la vez.', 65000, null, 12, true, false, false, true, 13),
  ((select id from wimaliemprendimientos.categories where slug='audio'),      'WM-0014', 'microfono-inalambrico-x-vlog', 'Micrófono inalámbrico X Vlog',          'Kit Audisat X Vlog de 2 micrófonos.', 'Kit Audisat X Vlog de dos micrófonos inalámbricos con estuche de carga con pantalla, receptor USB-C, control táctil y cancelación de ruido.', 350000, null, 6, true, true, false, true, 14),
  ((select id from wimaliemprendimientos.categories where slug='audio'),      'WM-0015', 'auricular-bluetooth-krab',     'Auricular Bluetooth KRAB KBA698',       'Auriculares KRAB Bluetooth 6.0 ENC.', 'Auriculares KRAB KBA698 con Bluetooth 6.0, cancelación de sonido ENC, pantalla táctil y hasta 20 horas de uso con el estuche.', 145000, null, 10, true, false, false, true, 15),
  ((select id from wimaliemprendimientos.categories where slug='belleza'),    'WM-0016', 'torno-de-unas-electrico',      'Torno de uñas eléctrico',               'Torno de uñas recargable profesional.', 'Torno de uñas profesional recargable con base de apoyo, velocidad regulable, fresas intercambiables y cable USB-C. Ideal para manicura y esculpidas.', 185000, null, 7, true, true, false, true, 16)
on conflict (slug) do nothing;

-- ---------- Imágenes de producto (legacy en /public/assets) ----------
-- public_url apunta a los archivos que ya viven en /public/assets/productos.
-- Cuando se suban a Supabase Storage desde el panel, se reemplazan.
insert into wimaliemprendimientos.product_images (product_id, storage_path, public_url, alt_text, is_primary, sort_order)
select p.id, null, img.url, p.name, img.is_primary, img.sort_order
from (values
  ('microfono-inalambrico-dual',   '/assets/productos/microfono-inalambrico-dual.jpg', true, 0),
  ('auricular-bluetooth-tws',      '/assets/productos/auricular-bluetooth-tws.jpg', true, 0),
  ('cargador-rapido-usb-c-20w',    '/assets/productos/cargador-rapido-usb-c-20w.jpg', true, 0),
  ('power-bank-12000mah',          '/assets/productos/power-bank-12000mah.jpg', true, 0),
  ('power-bank-12000mah',          '/assets/productos/power-bank-12000mah-b.jpg', false, 1),
  ('consola-retro-portatil',       '/assets/productos/consola-retro-portatil.jpg', true, 0),
  ('soporte-celular-escritorio',   '/assets/productos/soporte-celular-escritorio.jpg', true, 0),
  ('cargador-con-cable-type-c',    '/assets/productos/cargador-cable-type-c.jpg', true, 0),
  ('microfono-inalambrico-x-vlog', '/assets/productos/microfono-x-vlog.jpg', true, 0),
  ('microfono-inalambrico-x-vlog', '/assets/productos/microfono-x-vlog-b.jpg', false, 1),
  ('auricular-bluetooth-krab',     '/assets/productos/auricular-krab-kba698.jpg', true, 0),
  ('torno-de-unas-electrico',      '/assets/productos/torno-de-unas.jpg', true, 0)
) as img(product_slug, url, is_primary, sort_order)
join wimaliemprendimientos.products p on p.slug = img.product_slug
where not exists (
  select 1 from wimaliemprendimientos.product_images pi
  where pi.product_id = p.id and pi.public_url = img.url
);

-- ---------- Productos flotantes del Hero (máx. 3) --------------------
insert into wimaliemprendimientos.hero_products (product_id, sort_order, active)
select p.id, h.sort_order, true
from (values
  ('auricular-bluetooth-tws', 1),
  ('power-bank-12000mah', 2),
  ('microfono-inalambrico-dual', 3)
) as h(product_slug, sort_order)
join wimaliemprendimientos.products p on p.slug = h.product_slug
on conflict (product_id) do nothing;
