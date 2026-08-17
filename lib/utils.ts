// Utilidad `cn` (estilo shadcn) para combinar clases. Versión liviana sin
// dependencias externas: filtra valores falsy y une con espacio.
export function cn(...inputs: Array<string | undefined | null | false>): string {
  return inputs.filter(Boolean).join(' ')
}
