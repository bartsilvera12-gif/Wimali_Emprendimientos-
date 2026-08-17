import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PrivacyPolicy from './components/PrivacyPolicy.jsx'

// Enrutado mínimo: la política de privacidad es una página oculta a la que
// solo se llega escribiendo /politicadeprivacidad en la URL (o su hash).
const path = (window.location.pathname + window.location.hash).toLowerCase()
const isPrivacy = path.includes('politicadeprivacidad')

createRoot(document.getElementById('root')).render(
  <StrictMode>{isPrivacy ? <PrivacyPolicy /> : <App />}</StrictMode>,
)
