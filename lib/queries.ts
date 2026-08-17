import { createReadClient } from '@/lib/supabase/server'
import type {
  BusinessSettings,
  Category,
  ProductWithRelations,
  SiteSection,
  Benefit,
  SocialLink,
} from '@/lib/supabase/types'

// Todas las consultas públicas leen del schema propio vía RLS (solo filas activas).

export async function getBusiness(): Promise<BusinessSettings | null> {
  const supabase = await createReadClient()
  const { data } = await supabase
    .from('business_settings')
    .select('*')
    .eq('active', true)
    .limit(1)
    .maybeSingle()
  return data as BusinessSettings | null
}

export async function getSections(): Promise<Record<string, SiteSection>> {
  const supabase = await createReadClient()
  const { data } = await supabase.from('site_sections').select('*').eq('active', true)
  const map: Record<string, SiteSection> = {}
  ;(data as SiteSection[] | null)?.forEach((s) => {
    map[s.section_key] = s
  })
  return map
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createReadClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true })
  return (data as Category[]) ?? []
}

const PRODUCT_SELECT =
  '*, category:categories(id,name,slug), images:product_images(id,public_url,alt_text,is_primary,sort_order)'

export async function getProducts(): Promise<ProductWithRelations[]> {
  const supabase = await createReadClient()
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('active', true)
    .order('sort_order', { ascending: true })
  return (data as ProductWithRelations[]) ?? []
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const supabase = await createReadClient()
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle()
  return (data as ProductWithRelations) ?? null
}

export async function getBenefits(): Promise<Benefit[]> {
  const supabase = await createReadClient()
  const { data } = await supabase
    .from('benefits')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true })
  return (data as Benefit[]) ?? []
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const supabase = await createReadClient()
  const { data } = await supabase
    .from('social_links')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true })
  return (data as SocialLink[]) ?? []
}

export async function getHeroProducts(): Promise<ProductWithRelations[]> {
  const supabase = await createReadClient()
  const { data } = await supabase
    .from('hero_products')
    .select('sort_order, product:products(' + PRODUCT_SELECT + ')')
    .eq('active', true)
    .order('sort_order', { ascending: true })
  const rows = (data as unknown as Array<{ product: ProductWithRelations | null }>) ?? []
  return rows.map((r) => r.product).filter(Boolean) as ProductWithRelations[]
}
