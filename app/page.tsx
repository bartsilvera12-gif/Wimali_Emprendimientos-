'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Package,
  MessageCircle,
  ShoppingCart,
  ShieldCheck,
  Instagram,
  Facebook,
  type LucideIcon,
} from 'lucide-react'
import { StoreShell } from '@/components/store/StoreShell'
import { ProductCard } from '@/components/store/ProductCard'
import { ProductImage } from '@/components/store/ProductImage'
import { WaIcon } from '@/components/store/WaIcon'
import { TikTokIcon } from '@/components/store/TikTokIcon'
import {
  getBusiness,
  getSections,
  getCategories,
  getProducts,
  getBenefits,
  getSocialLinks,
} from '@/lib/queries'
import { waPlain } from '@/lib/whatsapp'
import type {
  BusinessSettings,
  Category,
  ProductWithRelations,
  SiteSection,
  Benefit,
  SocialLink,
} from '@/lib/supabase/types'

const BENEFIT_ICONS: Record<string, LucideIcon> = {
  package: Package,
  'message-circle': MessageCircle,
  'shopping-cart': ShoppingCart,
  'shield-check': ShieldCheck,
}

export default function HomePage() {
  const [business, setBusiness] = useState<BusinessSettings | null>(null)
  const [sections, setSections] = useState<Record<string, SiteSection>>({})
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<ProductWithRelations[]>([])
  const [benefits, setBenefits] = useState<Benefit[]>([])
  const [socials, setSocials] = useState<SocialLink[]>([])

  useEffect(() => {
    ;(async () => {
      const [b, s, c, p, be, so] = await Promise.all([
        getBusiness(),
        getSections(),
        getCategories(),
        getProducts(),
        getBenefits(),
        getSocialLinks(),
      ])
      setBusiness(b)
      setSections(s)
      setCategories(c)
      setProducts(p)
      setBenefits(be)
      setSocials(so)
    })()
  }, [])

  const whatsapp = business?.whatsapp_number || '595995364978'
  const wa = waPlain(whatsapp)
  const hero = sections['hero']
  const offersSec = sections['offers']
  const aboutSec = sections['about']
  const offers = products.filter(
    (p) => p.is_offer && p.stock > 0 && p.previous_price && p.previous_price > p.price,
  )
  const socialLinks = socials.filter((s) => s.platform.toLowerCase() !== 'whatsapp')
  const mapQuery = business?.map_query || business?.address || 'Paraguay'
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`

  return (
    <StoreShell whatsappNumber={whatsapp}>
      <main id="top">
        {/* HERO */}
        <section className="hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hero-bg" src="/assets/hero-bg.jpg" alt="" aria-hidden="true" />
          <div className="hero-overlay" />
          <div className="hero-inner">
            <div className="hero-copy">
              <h1 className="hero-title">
                <span className="hero-line">{hero?.title?.split(',')[0] ?? 'Todo lo que necesitás,'}</span>
                <span className="hero-gradient" style={{ color: '#ff4d59' }}>
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

        {/* CATEGORÍAS */}
        <section id="categorias" className="section section--cats reveal">
          <div className="section-inner">
            <div className="kicker">CATEGORÍAS</div>
            <h2 className="h2">¿Qué estás buscando?</h2>
            {categories.length > 0 ? (
              <div className="cat-grid">
                {categories.map((c) => {
                  const count = products.filter((p) => p.category?.id === c.id).length
                  return (
                    <div className="card-spotlight cat-card reveal" key={c.id}>
                      <Link href={`/categoria/${c.slug}`} className="cat-hit">
                        <div className="cat-img">
                          <ProductImage src={c.image_url} name={c.name} tone="dark" />
                        </div>
                        <div className="cat-shade" />
                        <div className="cat-text">
                          <div className="cat-name">{c.name}</div>
                          <div className="cat-count">
                            {count} {count === 1 ? 'producto' : 'productos'}
                          </div>
                        </div>
                      </Link>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="catalog-empty">
                <div className="catalog-empty-title">Cargando categorías…</div>
              </div>
            )}
          </div>
        </section>

        {/* OFERTAS */}
        {offers.length > 0 && (
          <section id="ofertas" className="section section--offers reveal">
            <div className="offers-glow" />
            <div className="section-inner">
              <div className="offers-head">
                <div className="kicker">{offersSec?.eyebrow ?? 'PROMOCIONES'}</div>
                <h2 className="h2 h2--light">{offersSec?.title ?? 'Ofertas que no podés dejar pasar'}</h2>
                <p className="offers-sub">{offersSec?.subtitle}</p>
              </div>
              <div className="prod-grid">
                {offers.map((p) => (
                  <ProductCard key={p.id} product={p} variant="light" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA WhatsApp */}
        <section className="section section--cta reveal">
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
        <section id="nosotros" className="section section--about reveal">
          <div className="section-inner section-inner--narrow">
            <div className="about-head">
              <div className="kicker">{aboutSec?.eyebrow ?? 'NOSOTROS'}</div>
              <h2 className="h2">{aboutSec?.title ?? 'Sobre WIMALI'}</h2>
              <p>{aboutSec?.subtitle}</p>
            </div>
            <div className="about-grid">
              {benefits.map((b) => {
                const Icon = (b.icon && BENEFIT_ICONS[b.icon]) || Package
                return (
                  <div className="card-spotlight about-card reveal" key={b.id}>
                    <div className="about-num about-num--icon">
                      <Icon size={19} />
                    </div>
                    <div className="about-title">{b.title}</div>
                    <p>{b.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* UBICACIÓN */}
        <section id="ubicacion" className="section section--location reveal">
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
        {socialLinks.length > 0 && (
          <section id="contacto" className="section section--contact reveal">
            <div className="section-inner section-inner--narrow">
              <div className="contact-head">
                <div className="kicker">REDES</div>
                <h2 className="h2">Seguinos</h2>
              </div>
              <div className="social-grid">
                {socialLinks.map((s) => {
                  const p = s.platform.toLowerCase()
                  const isWa = p === 'whatsapp'
                  return (
                    <a
                      key={s.id}
                      className={`social-card ${isWa ? 'social-card--wa' : ''}`}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className={`social-icon ${isWa ? 'social-icon--wa' : 'social-icon--cream'}`}>
                        {p === 'instagram' && <Instagram size={22} />}
                        {p === 'facebook' && <Facebook size={22} />}
                        {p === 'tiktok' && <TikTokIcon size={22} />}
                        {isWa && <WaIcon size={22} color="#fff" />}
                      </span>
                      <span>
                        <span className="social-name">{s.label ?? s.platform}</span>
                        <span className="social-desc">{s.platform}</span>
                      </span>
                    </a>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-grid">
            <div className="footer-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/wimali-logo.png" alt="WIMALI Emprendimientos" />
              <p>Todo lo que necesitás, en un solo lugar.</p>
            </div>

            <div>
              <div className="footer-title">NAVEGACIÓN</div>
              <div className="footer-links">
                <Link href="/#top">Inicio</Link>
                <Link href="/#categorias">Productos</Link>
                <Link href="/#ofertas">Ofertas</Link>
                <Link href="/#nosotros">Nosotros</Link>
              </div>
            </div>

            <div>
              <div className="footer-title">AYUDA</div>
              <div className="footer-links">
                <a href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                <Link href="/#ubicacion">Ubicación</Link>
                <Link href="/#contacto">Contacto</Link>
                {business?.phone_display && <span>{business.phone_display}</span>}
              </div>
            </div>

            {categories.length > 0 && (
              <div>
                <div className="footer-title">CATEGORÍAS</div>
                <div className="footer-links">
                  {categories.slice(0, 5).map((c) => (
                    <Link key={c.id} href={`/categoria/${c.slug}`}>
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {socialLinks.length > 0 && (
              <div>
                <div className="footer-title">REDES</div>
                <div className="footer-links">
                  {socialLinks.map((s) => (
                    <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.label ?? s.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="footer-bottom">
            <span className="footer-credit">
              Desarrollado por{' '}
              <a href="https://neura.com.py" target="_blank" rel="noopener noreferrer">
                NEURA
              </a>
            </span>
          </div>
        </footer>
      </main>
    </StoreShell>
  )
}
