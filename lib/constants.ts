// Constantes compartidas del proyecto.

// Schema propio de Supabase donde viven todas las tablas del proyecto.
export const DB_SCHEMA =
  process.env.NEXT_PUBLIC_SUPABASE_SCHEMA || 'wimaliemprendimientos'

// Bucket de Storage para todas las imágenes.
export const STORAGE_BUCKET = 'wimaliemprendimientos-media'

// Umbral de stock bajo para los indicadores.
export const LOW_STOCK_THRESHOLD = 6
