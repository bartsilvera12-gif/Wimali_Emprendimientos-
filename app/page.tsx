import Link from 'next/link'
import { Search } from 'lucide-react'
import { StoreShell } from '@/components/store/StoreShell'
import { ProductCard } from '@/components/store/ProductCard'
import { ProductImage } from '@/components/store/ProductImage'
import { WaIcon } from '@/components/store/WaIcon'
import {
  getBusiness,
  getSections,
  getCategories,
  getProducts,
  getBenefits,
  getSocialLinks,
} from '@/lib/queries'
import { waPlain } from '@/lib/whatsapp'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [business, sections, categories, products, benefits, socials] = await Promise.all([
    getBusiness(),
    getSections(),
    getCategories(),
    getProducts(),
    getBenefits(),
    getSocialLinks(),
  ])

  const whatsapp = business?.whatsapp_number || '595995364978'
  const wa = waPlain(whatsapp)
  const hero = sections['hero']
  const offersSec = sections['offers']
  const aboutSec = sections['about']
  const offers = products.filter(
    (p) => p.is_offer && p.stock > 0 && p.previous_price && p.previous_price > p.price,
  )
  const mapQuery = business?.map_query || business?.address || 'Paraguay'
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`

  return (
    <StoreShell whatsappNumber={whatsapp}>
      <main id="top">
        {/* HERO */}
        <section className="hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hero-bg" src="/assets/hero-bg.png" alt="" aria-hidden="true" />
          <div className="hero-overlay" />
          <div className="hero-inner">
            <div className="hero-copy">
              <h1 className="hero-title">
                <span className="hero-line">{hero?.title?.split(',')[0] ?? 'Todo lo que necesitás,'}</span>
                <span className="hero-gradient" style={{ color: '#E4BD69' }}>
                  {hero?.title?.split(',').slice(1).join(',').trim() || 'en un solo lugar.'}
                </span>
              </h1>
              <p className="hero-sub">
                {hero?.subtitle ??
                  'Tecnología, accesorios, hogar, belleza y mucho más. Encontrá lo que buscás y hacé tu pedido fácilmente por WhatsApp.'}
              </p>
            </div>
          </div>
        </section>

        {/* BUSCADOR */}
        <div className="search-wrap">
          <div className="search-box">
            <div className="search-bar">
              <Search size={22} color="#8a8a8a" />
              <input placeholder="" aria-label="Buscar productos" readOnly />
              <Link href="#productos" className="search-go">
                Buscar
              </Link>
            </div>
          </div>
        </div>

        {/* CATEGORÍAS */}
        <section id="categorias" className="section section--cats">
          <div className="section-inner">
            <div className="kicker">{sections['catalog']?.eyebrow ?? 'CATEGORÍAS'}</div>
            <h2 className="h2">¿Qué estás buscando?</h2>
            <div className="cat-grid">
              {categories.map((c) => (
                <div className="card-spotlight cat-card" key={c.id}>
                  <Link href="#productos" className="cat-hit">
                    <div className="cat-img">
                      <ProductImage src={c.image_url} name={c.name} tone="dark" />
                    </div>
                    <div className="cat-shade" />
                    <div className="cat-text">
                      <div className="cat-name">{c.name}</div>
                      <div className="cat-count">
                        {products.filter((p) => p.category?.id === c.id).length} productos
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CATÁLOGO */}
        <section id="productos" className="section section--catalog">
          <div className="section-inner">
            <div className="catalog-head">
              <div>
                <div className="kicker">CATÁLOGO</div>
                <h2 className="h2">Productos destacados</h2>
              </div>
              <div className="catalog-tools">
                <span className="result-label">
                  {products.length === 1 ? '1 producto' : `${products.length} productos`}
                </span>
              </div>
            </div>
            {products.length > 0 ? (
              <div className="prod-grid">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="catalog-empty">
                <div className="catalog-empty-title">Todavía no hay productos cargados</div>
                <p>Cargalos desde el panel de administración.</p>
              </div>
            )}
          </div>
        </section>

        {/* OFERTAS */}
        {offers.length > 0 && (
          <section id="ofertas" className="section section--offers">
            <div className="offers-glow" />
            <div className="section-inner">
              <div className="offers-head">
                <div className="kicker">{offersSec?.eyebrow ?? 'PROMOCIONES'}</div>
                <h2 className="h2 h2--light">{offersSec?.title ?? 'Ofertas que no podés dejar pasar'}</h2>
                <p className="offers-sub">{offersSec?.subtitle}</p>
              </div>
              <div className="prod-grid">
                {offers.map((p) => (
                  <ProductCard key={p.id} product={p} variant="dark" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA WhatsApp */}
        <section className="section section--cta">
          <div className="cta-banner">
            <div>
              <h2>¿Encontraste lo que buscabas?</h2>
              <p>Hacé tu pedido directamente por WhatsApp y te ayudamos a finalizar tu compra.</p>
            </div>
            <div className="cta-banner-btn">
              <a className="btn-white" href={wa} target="_blank" rel="noopener noreferrer">
                <WaIcon size={22} color="#128C4A" />
                Comprar por WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* NOSOTROS */}
        <section id="nosotros" className="section section--about">
          <div className="section-inner section-inner--narrow">
            <div className="about-head">
              <div className="kicker">{aboutSec?.eyebrow ?? 'NOSOTROS'}</div>
              <h2 className="h2">{aboutSec?.title ?? 'Sobre WIMALI'}</h2>
              <p>{aboutSec?.subtitle}</p>
            </div>
            <div className="about-grid">
              {benefits.map((b, i) => (
                <div className="card-spotlight about-card" key={b.id}>
                  <div className="about-num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="about-title">{b.title}</div>
                  <p>{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* UBICACIÓN */}
        <section id="ubicacion" className="section section--location">
          <div className="section-inner">
            <div className="kicker">UBICACIÓN</div>
            <h2 className="h2">Encontranos</h2>
            <div className="loc-grid">
              <div className="map-box">
                <iframe title="Mapa WIMALI" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
              <div className="info-card">
                <div>
                  <div className="info-label">DIRECCIÓN</div>
                  <div className="info-value">{business?.address ?? 'Dirección a confirmar · Paraguay'}</div>
                </div>
                <div className="info-sep" />
                <div>
                  <div className="info-label">HORARIOS</div>
                  <div className="info-hours">{business?.opening_hours}</div>
                </div>
                <div className="info-sep" />
                <div>
                  <div className="info-label">WHATSAPP</div>
                  <div className="info-value">{business?.phone_display ?? '+595 995 364 978'}</div>
                </div>
                <div className="info-actions">
                  <a
                    className="btn-gold btn-gold--sm"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cómo llegar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* REDES */}
        <section id="contacto" className="section section--contact">
          <div className="section-inner section-inner--narrow">
            <div className="contact-head">
              <div className="kicker">REDES</div>
              <h2 className="h2">Seguinos</h2>
            </div>
            <div className="social-grid">
              {socials.map((s) => (
                <a
                  key={s.id}
                  className="social-card"
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="social-icon social-icon--cream" />
                  <span>
                    <span className="social-name">{s.label ?? s.platform}</span>
                    <span className="social-desc">{s.platform}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-grid">
            <div className="footer-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/wimali-logo.png" alt="WIMALI Emprendimientos" />
              <p>Todo lo que necesitás, en un solo lugar.</p>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {business?.business_name ?? 'WIMALI EMPRENDIMIENTOS'}</span>
            <span className="footer-credit">
              Desarrollado por{' '}
              <a href="https://neura.com.py" target="_blank" rel="noopener noreferrer">
                NEURA
              </a>
            </span>
            <span className="footer-address">{business?.address}</span>
          </div>
        </footer>
      </main>
    </StoreShell>
  )
}
