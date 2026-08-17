export const WaIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color} style={{ flex: 'none' }}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.2 14.8l-.4-.2-2.6.7.7-2.5-.2-.4A8 8 0 0 1 12 4zm-3.3 4.3c-.2 0-.5.1-.7.3-.3.3-.7.8-.7 1.7 0 1 .7 2 1.9 3.2 1.2 1.2 2.3 1.9 3.4 2.1.9.2 1.5 0 1.9-.3.4-.3.6-.8.6-1.2 0-.2 0-.3-.2-.4l-1.5-.7c-.2-.1-.3 0-.4.1l-.5.6c-.1.1-.2.2-.4.1-.5-.2-1.1-.6-1.6-1.1-.4-.5-.7-1-.8-1.2 0-.1 0-.2.1-.3l.4-.5c.1-.1.1-.3 0-.4l-.6-1.5c-.1-.2-.2-.3-.4-.3z" />
  </svg>
)

export const SearchIcon = ({ size = 20, stroke = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="16.5" y1="16.5" x2="21" y2="21" />
  </svg>
)

export const CartIcon = ({ size = 21 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 4h2.2l2.3 11h10.1l2.1-7.4H6.1" />
    <circle cx="9.6" cy="19" r="1.5" />
    <circle cx="17.4" cy="19" r="1.5" />
  </svg>
)

export const ArrowRightIcon = ({ size = 19 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h13" />
    <path d="M12.5 6l6 6-6 6" />
  </svg>
)

export const ArrowLeftIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H6" />
    <path d="M11.5 6l-6 6 6 6" />
  </svg>
)

export const HomeIcon = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 11l8-6.5 8 6.5" />
    <path d="M6.5 10v9h11v-9" />
  </svg>
)

export const GridIcon = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="7" height="7" rx="2" />
    <rect x="13" y="4" width="7" height="7" rx="2" />
    <rect x="4" y="13" width="7" height="7" rx="2" />
    <rect x="13" y="13" width="7" height="7" rx="2" />
  </svg>
)

export const HeartIcon = ({ size = 19, filled = false }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20.3l-7.1-7.2a4.6 4.6 0 0 1 0-6.5 4.5 4.5 0 0 1 6.4 0l.7.7.7-.7a4.5 4.5 0 0 1 6.4 0 4.6 4.6 0 0 1 0 6.5z" />
  </svg>
)

export const InstagramIcon = ({ size = 22, stroke = '#0A0A0A' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={stroke} strokeWidth="1.7">
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r="1.2" fill={stroke} stroke="none" />
  </svg>
)

export const FacebookIcon = ({ size = 22, color = '#0A0A0A' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
    <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.4 1.5-1.4h1.4V5.1C15.9 5 15 5 14.1 5c-2.4 0-3.9 1.4-3.9 4v2H8v3h2.2v7h3.3z" />
  </svg>
)
