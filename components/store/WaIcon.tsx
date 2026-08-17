// Ícono de WhatsApp (no viene en lucide-react).
export function WaIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} style={{ flex: 'none' }}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.2 14.8l-.4-.2-2.6.7.7-2.5-.2-.4A8 8 0 0 1 12 4zm-3.3 4.3c-.2 0-.5.1-.7.3-.3.3-.7.8-.7 1.7 0 1 .7 2 1.9 3.2 1.2 1.2 2.3 1.9 3.4 2.1.9.2 1.5 0 1.9-.3.4-.3.6-.8.6-1.2 0-.2 0-.3-.2-.4l-1.5-.7c-.2-.1-.3 0-.4.1l-.5.6c-.1.1-.2.2-.4.1-.5-.2-1.1-.6-1.6-1.1-.4-.5-.7-1-.8-1.2 0-.1 0-.2.1-.3l.4-.5c.1-.1.1-.3 0-.4l-.6-1.5c-.1-.2-.2-.3-.4-.3z" />
    </svg>
  )
}
