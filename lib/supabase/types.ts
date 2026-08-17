// Tipos de las tablas del schema `wimaliemprendimientos`.
// Reflejan las columnas creadas en las migraciones SQL.

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  image_path: string | null
  active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  storage_path: string | null
  public_url: string
  alt_text: string | null
  is_primary: boolean
  sort_order: number
  created_at: string
}

export interface Product {
  id: string
  category_id: string | null
  sku: string | null
  slug: string
  name: string
  short_description: string | null
  description: string | null
  price: number
  previous_price: number | null
  stock: number
  featured: boolean
  is_new: boolean
  is_offer: boolean
  active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

// Producto con datos relacionados que usa el frontend.
export interface ProductWithRelations extends Product {
  category?: Pick<Category, 'id' | 'name' | 'slug'> | null
  images?: ProductImage[]
}

export interface HeroProduct {
  id: string
  product_id: string
  sort_order: number
  active: boolean
  created_at: string
}

export interface SiteSection {
  id: string
  section_key: string
  eyebrow: string | null
  title: string | null
  subtitle: string | null
  body: string | null
  button_text: string | null
  button_url: string | null
  active: boolean
  sort_order: number
  settings: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Benefit {
  id: string
  title: string
  description: string | null
  icon: string | null
  active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface BusinessSettings {
  id: string
  business_name: string
  whatsapp_number: string
  phone_display: string | null
  address: string | null
  map_query: string | null
  google_maps_url: string | null
  opening_hours: string | null
  shipping_text: string | null
  payment_text: string | null
  logo_url: string | null
  logo_path: string | null
  favicon_url: string | null
  seo_title: string | null
  seo_description: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface SocialLink {
  id: string
  platform: string
  label: string | null
  url: string
  icon: string | null
  active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface MediaAsset {
  id: string
  name: string | null
  storage_path: string
  public_url: string
  mime_type: string | null
  file_size: number | null
  alt_text: string | null
  created_by: string | null
  created_at: string
}

export interface AdminUser {
  id: string
  user_id: string
  email: string
  full_name: string | null
  role: 'super_admin' | 'admin'
  active: boolean
  created_at: string
  updated_at: string
}
