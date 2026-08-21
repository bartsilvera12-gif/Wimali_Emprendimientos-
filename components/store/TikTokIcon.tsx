// Icono de TikTok (marca) como SVG inline. lucide-react no lo incluye.
export function TikTokIcon({ size = 22, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M16.5 3c.3 2.2 1.6 3.9 3.7 4.2v2.6c-1.3.1-2.5-.3-3.7-1v5.9c0 3.2-1.9 5.6-4.9 6.1-3.4.6-6.4-1.8-6.6-5.1-.2-3 2.1-5.6 5.1-5.7.3 0 .6 0 .9.1v2.7c-.3-.1-.6-.2-.9-.2-1.4 0-2.5 1.2-2.4 2.6.1 1.3 1.2 2.3 2.5 2.3 1.4 0 2.4-1 2.4-2.5V3h3.9z" />
    </svg>
  )
}
