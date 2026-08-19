-- ============================================================
-- WIMALI - Carga de 11 productos nuevos (con imagen estatica)
-- Pegar y ejecutar en el SQL Editor de Supabase.
-- Las imagenes viven en /public/assets/productos/ (desplegadas en Vercel).
-- ============================================================

-- Aro de luz LUO LU-260 26 cm con tripode 2 m
INSERT INTO wimaliemprendimientos.products (name, slug, price, stock, short_description, description, category_id, active, featured, is_offer, is_new)
VALUES ('Aro de luz LUO LU-260 26 cm con tripode 2 m', 'aro-de-luz-luo-lu-260-26-cm-con-tripode-2-m', 90000, 12, 'Aro de luz LED 26 cm con tripode de 2 m, 3 tonos de luz y control.', 'Aro de luz LED de 26 cm con 3 tonalidades (blanco frio, blanco calido y amarillo calido) y brillo regulable. Incluye tripode de piso extensible hasta 2 m, soporte para celular y control de mano. Perfecto para maquillaje, videollamadas, TikTok y fotos de producto.', (SELECT id FROM wimaliemprendimientos.categories WHERE slug='belleza'), true, false, false, false)
ON CONFLICT (slug) DO UPDATE SET price=EXCLUDED.price, stock=EXCLUDED.stock, short_description=EXCLUDED.short_description, description=EXCLUDED.description, category_id=EXCLUDED.category_id, active=true;
INSERT INTO wimaliemprendimientos.product_images (product_id, public_url, is_primary, sort_order)
SELECT p.id, '/assets/productos/aro-de-luz-luo-lu-260-26-cm-con-tripode-2-m.jpg', true, 0 FROM wimaliemprendimientos.products p
WHERE p.slug='aro-de-luz-luo-lu-260-26-cm-con-tripode-2-m' AND NOT EXISTS (SELECT 1 FROM wimaliemprendimientos.product_images pi WHERE pi.product_id=p.id);

-- Auricular Bluetooth KRAB KBA698
INSERT INTO wimaliemprendimientos.products (name, slug, price, stock, short_description, description, category_id, active, featured, is_offer, is_new)
VALUES ('Auricular Bluetooth KRAB KBA698', 'auricular-bluetooth-krab-kba698', 140000, 10, 'Bluetooth 6.0, 20 h de reproduccion, cancelacion ENC y pantalla de bateria.', 'Auriculares inalambricos KRAB KBA698 con Bluetooth 6.0, hasta 20 horas de reproduccion, cancelacion de ruido ENC y estuche con pantalla indicadora de bateria. Incluye cable de carga USB.', (SELECT id FROM wimaliemprendimientos.categories WHERE slug='audio'), true, false, false, false)
ON CONFLICT (slug) DO UPDATE SET price=EXCLUDED.price, stock=EXCLUDED.stock, short_description=EXCLUDED.short_description, description=EXCLUDED.description, category_id=EXCLUDED.category_id, active=true;
INSERT INTO wimaliemprendimientos.product_images (product_id, public_url, is_primary, sort_order)
SELECT p.id, '/assets/productos/auricular-bluetooth-krab-kba698.jpg', true, 0 FROM wimaliemprendimientos.products p
WHERE p.slug='auricular-bluetooth-krab-kba698' AND NOT EXISTS (SELECT 1 FROM wimaliemprendimientos.product_images pi WHERE pi.product_id=p.id);

-- Auriculares M10 TWS V5.3 True Wireless
INSERT INTO wimaliemprendimientos.products (name, slug, price, stock, short_description, description, category_id, active, featured, is_offer, is_new)
VALUES ('Auriculares M10 TWS V5.3 True Wireless', 'auriculares-m10-tws-v53-true-wireless', 90000, 15, 'TWS Bluetooth 5.3 con estuche indicador digital y funcion power bank.', 'Auriculares TWS M10 con Bluetooth 5.3, estuche con indicador digital de bateria y funcion power bank para cargar tu celular. Sonido estereo con graves potentes, controles tactiles y buena autonomia. Incluye estuche de carga.', (SELECT id FROM wimaliemprendimientos.categories WHERE slug='audio'), true, false, false, false)
ON CONFLICT (slug) DO UPDATE SET price=EXCLUDED.price, stock=EXCLUDED.stock, short_description=EXCLUDED.short_description, description=EXCLUDED.description, category_id=EXCLUDED.category_id, active=true;
INSERT INTO wimaliemprendimientos.product_images (product_id, public_url, is_primary, sort_order)
SELECT p.id, '/assets/productos/auriculares-m10-tws-v53-true-wireless.jpg', true, 0 FROM wimaliemprendimientos.products p
WHERE p.slug='auriculares-m10-tws-v53-true-wireless' AND NOT EXISTS (SELECT 1 FROM wimaliemprendimientos.product_images pi WHERE pi.product_id=p.id);

-- Power bank Ecopower EP-C852 12000 mAh MagSafe
INSERT INTO wimaliemprendimientos.products (name, slug, price, stock, short_description, description, category_id, active, featured, is_offer, is_new)
VALUES ('Power bank Ecopower EP-C852 12000 mAh MagSafe', 'power-bank-ecopower-ep-c852-12000-mah-magsafe', 110000, 10, 'Bateria 12.000 mAh con carga inalambrica magnetica y soporte plegable.', 'Bateria portatil de 12.000 mAh con carga inalambrica magnetica (MagSafe) y carga rapida. Diseno super slim con soporte plegable integrado. Compatible con Apple y Android. Incluye cable de carga.', (SELECT id FROM wimaliemprendimientos.categories WHERE slug='tecnologia'), true, false, false, false)
ON CONFLICT (slug) DO UPDATE SET price=EXCLUDED.price, stock=EXCLUDED.stock, short_description=EXCLUDED.short_description, description=EXCLUDED.description, category_id=EXCLUDED.category_id, active=true;
INSERT INTO wimaliemprendimientos.product_images (product_id, public_url, is_primary, sort_order)
SELECT p.id, '/assets/productos/power-bank-ecopower-ep-c852-12000-mah-magsafe.jpg', true, 0 FROM wimaliemprendimientos.products p
WHERE p.slug='power-bank-ecopower-ep-c852-12000-mah-magsafe' AND NOT EXISTS (SELECT 1 FROM wimaliemprendimientos.product_images pi WHERE pi.product_id=p.id);

-- Microfono inalambrico BYZ K9 (doble)
INSERT INTO wimaliemprendimientos.products (name, slug, price, stock, short_description, description, category_id, active, featured, is_offer, is_new)
VALUES ('Microfono inalambrico BYZ K9 (doble)', 'microfono-inalambrico-byz-k9-doble', 140000, 12, 'Set de 2 microfonos de solapa inalambricos, plug & play, Tipo-C y Lightning.', 'Set de 2 microfonos de solapa inalambricos, plug & play sin necesidad de apps. Compatibles con dispositivos Tipo-C y Lightning. Ideales para videos, entrevistas, TikTok y transmisiones en vivo.', (SELECT id FROM wimaliemprendimientos.categories WHERE slug='audio'), true, false, false, false)
ON CONFLICT (slug) DO UPDATE SET price=EXCLUDED.price, stock=EXCLUDED.stock, short_description=EXCLUDED.short_description, description=EXCLUDED.description, category_id=EXCLUDED.category_id, active=true;
INSERT INTO wimaliemprendimientos.product_images (product_id, public_url, is_primary, sort_order)
SELECT p.id, '/assets/productos/microfono-inalambrico-byz-k9-doble.jpg', true, 0 FROM wimaliemprendimientos.products p
WHERE p.slug='microfono-inalambrico-byz-k9-doble' AND NOT EXISTS (SELECT 1 FROM wimaliemprendimientos.product_images pi WHERE pi.product_id=p.id);

-- Mini consola retro LUO LU-SY04 (400 juegos)
INSERT INTO wimaliemprendimientos.products (name, slug, price, stock, short_description, description, category_id, active, featured, is_offer, is_new)
VALUES ('Mini consola retro LUO LU-SY04 (400 juegos)', 'mini-consola-retro-luo-lu-sy04-400-juegos', 75000, 10, 'Consola portatil con 400 juegos clasicos, pantalla a color y salida a TV.', 'Consola portatil retro con 400 juegos clasicos, pantalla a color, salida AV a TV y soporte para segundo control (2 jugadores). Incluye cable USB y cable AV. Diversion retro a donde vayas.', (SELECT id FROM wimaliemprendimientos.categories WHERE slug='tecnologia'), true, false, false, false)
ON CONFLICT (slug) DO UPDATE SET price=EXCLUDED.price, stock=EXCLUDED.stock, short_description=EXCLUDED.short_description, description=EXCLUDED.description, category_id=EXCLUDED.category_id, active=true;
INSERT INTO wimaliemprendimientos.product_images (product_id, public_url, is_primary, sort_order)
SELECT p.id, '/assets/productos/mini-consola-retro-luo-lu-sy04-400-juegos.jpg', true, 0 FROM wimaliemprendimientos.products p
WHERE p.slug='mini-consola-retro-luo-lu-sy04-400-juegos' AND NOT EXISTS (SELECT 1 FROM wimaliemprendimientos.product_images pi WHERE pi.product_id=p.id);

-- Cargador Ecopower EP-7050 20W PD (C a C)
INSERT INTO wimaliemprendimientos.products (name, slug, price, stock, short_description, description, category_id, active, featured, is_offer, is_new)
VALUES ('Cargador Ecopower EP-7050 20W PD (C a C)', 'cargador-ecopower-ep-7050-20w-pd-c-a-c', 25000, 25, 'Cargador de pared PD 20W Tipo-C con carga rapida. Incluye cable C a C.', 'Cargador de pared PD 20W con puerto Tipo-C y carga rapida (hasta 50% en 30 minutos). Incluye cable Tipo-C a Tipo-C. Compatible con celulares y tablets.', (SELECT id FROM wimaliemprendimientos.categories WHERE slug='accesorios'), true, false, false, false)
ON CONFLICT (slug) DO UPDATE SET price=EXCLUDED.price, stock=EXCLUDED.stock, short_description=EXCLUDED.short_description, description=EXCLUDED.description, category_id=EXCLUDED.category_id, active=true;
INSERT INTO wimaliemprendimientos.product_images (product_id, public_url, is_primary, sort_order)
SELECT p.id, '/assets/productos/cargador-ecopower-ep-7050-20w-pd-c-a-c.jpg', true, 0 FROM wimaliemprendimientos.products p
WHERE p.slug='cargador-ecopower-ep-7050-20w-pd-c-a-c' AND NOT EXISTS (SELECT 1 FROM wimaliemprendimientos.product_images pi WHERE pi.product_id=p.id);

-- Torno de unas electrico rosa con cristales
INSERT INTO wimaliemprendimientos.products (name, slug, price, stock, short_description, description, category_id, active, featured, is_offer, is_new)
VALUES ('Torno de unas electrico rosa con cristales', 'torno-de-unas-electrico-rosa-con-cristales', 200000, 6, 'Torno de unas recargable con base de carga, acabado rosa con strass.', 'Torno/pulidor de unas profesional recargable, con base de carga y acabado rosa con cristales. Velocidad regulable y giro reversible, bajo ruido y vibracion. Incluye fresa (flame bit) y cable USB. Ideal para manicura y pedicura.', (SELECT id FROM wimaliemprendimientos.categories WHERE slug='belleza'), true, false, false, false)
ON CONFLICT (slug) DO UPDATE SET price=EXCLUDED.price, stock=EXCLUDED.stock, short_description=EXCLUDED.short_description, description=EXCLUDED.description, category_id=EXCLUDED.category_id, active=true;
INSERT INTO wimaliemprendimientos.product_images (product_id, public_url, is_primary, sort_order)
SELECT p.id, '/assets/productos/torno-de-unas-electrico-rosa-con-cristales.jpg', true, 0 FROM wimaliemprendimientos.products p
WHERE p.slug='torno-de-unas-electrico-rosa-con-cristales' AND NOT EXISTS (SELECT 1 FROM wimaliemprendimientos.product_images pi WHERE pi.product_id=p.id);

-- Aro de luz LUO LU-380 38 cm
INSERT INTO wimaliemprendimientos.products (name, slug, price, stock, short_description, description, category_id, active, featured, is_offer, is_new)
VALUES ('Aro de luz LUO LU-380 38 cm', 'aro-de-luz-luo-lu-380-38-cm', 160000, 8, 'Aro de luz LED 38 cm con soporte para 3 celulares y varias temperaturas.', 'Aro de luz LED de 38 cm con multiples temperaturas de color y brillo regulable. Soporte para hasta 3 celulares. Luz amplia y uniforme para maquillaje, fotografia, video y transmisiones en vivo.', (SELECT id FROM wimaliemprendimientos.categories WHERE slug='belleza'), true, false, false, false)
ON CONFLICT (slug) DO UPDATE SET price=EXCLUDED.price, stock=EXCLUDED.stock, short_description=EXCLUDED.short_description, description=EXCLUDED.description, category_id=EXCLUDED.category_id, active=true;
INSERT INTO wimaliemprendimientos.product_images (product_id, public_url, is_primary, sort_order)
SELECT p.id, '/assets/productos/aro-de-luz-luo-lu-380-38-cm.jpg', true, 0 FROM wimaliemprendimientos.products p
WHERE p.slug='aro-de-luz-luo-lu-380-38-cm' AND NOT EXISTS (SELECT 1 FROM wimaliemprendimientos.product_images pi WHERE pi.product_id=p.id);

-- Soporte multifuncional LUO LU-4011
INSERT INTO wimaliemprendimientos.products (name, slug, price, stock, short_description, description, category_id, active, featured, is_offer, is_new)
VALUES ('Soporte multifuncional LUO LU-4011', 'soporte-multifuncional-luo-lu-4011', 30000, 20, 'Soporte plegable con fuerte succion y angulo ajustable. Portatil.', 'Soporte plegable para celular con base de fuerte succion y angulo ajustable. Diseno compacto y portatil, ideal para escritorio o auto. Incluye anillo metalico adhesivo.', (SELECT id FROM wimaliemprendimientos.categories WHERE slug='accesorios'), true, false, false, false)
ON CONFLICT (slug) DO UPDATE SET price=EXCLUDED.price, stock=EXCLUDED.stock, short_description=EXCLUDED.short_description, description=EXCLUDED.description, category_id=EXCLUDED.category_id, active=true;
INSERT INTO wimaliemprendimientos.product_images (product_id, public_url, is_primary, sort_order)
SELECT p.id, '/assets/productos/soporte-multifuncional-luo-lu-4011.jpg', true, 0 FROM wimaliemprendimientos.products p
WHERE p.slug='soporte-multifuncional-luo-lu-4011' AND NOT EXISTS (SELECT 1 FROM wimaliemprendimientos.product_images pi WHERE pi.product_id=p.id);

-- Tensiometro de brazo Ecopower EP-2740
INSERT INTO wimaliemprendimientos.products (name, slug, price, stock, short_description, description, category_id, active, featured, is_offer, is_new)
VALUES ('Tensiometro de brazo Ecopower EP-2740', 'tensiometro-de-brazo-ecopower-ep-2740', 100000, 8, 'Medidor de presion arterial digital de brazo, alta precision, carga USB.', 'Medidor de presion arterial digital de brazo, de alta precision. Pantalla LCD grande con lectura de sistolica, diastolica y pulso, indicador WHO y memoria. Carga por USB. Facil de usar en casa.', (SELECT id FROM wimaliemprendimientos.categories WHERE slug='hogar'), true, false, false, false)
ON CONFLICT (slug) DO UPDATE SET price=EXCLUDED.price, stock=EXCLUDED.stock, short_description=EXCLUDED.short_description, description=EXCLUDED.description, category_id=EXCLUDED.category_id, active=true;
INSERT INTO wimaliemprendimientos.product_images (product_id, public_url, is_primary, sort_order)
SELECT p.id, '/assets/productos/tensiometro-de-brazo-ecopower-ep-2740.jpg', true, 0 FROM wimaliemprendimientos.products p
WHERE p.slug='tensiometro-de-brazo-ecopower-ep-2740' AND NOT EXISTS (SELECT 1 FROM wimaliemprendimientos.product_images pi WHERE pi.product_id=p.id);

