import { BUSINESS } from '../config.js'

// Página de Política de Privacidad. No está enlazada en el sitio:
// se accede solo por la ruta /politicadeprivacidad (ver src/main.jsx).
export default function PrivacyPolicy() {
  const goHome = e => {
    e.preventDefault()
    // volver a la raíz del sitio
    const base = import.meta.env.BASE_URL || '/'
    window.location.href = base
  }

  return (
    <div className="legal">
      <header className="legal-header">
        <a href="/" className="legal-logo" onClick={goHome}>
          <img src="assets/wimali-logo.png" alt="WIMALI Emprendimientos" />
        </a>
        <a href="/" className="legal-back" onClick={goHome}>
          ← Volver a la tienda
        </a>
      </header>

      <main className="legal-main">
        <div className="legal-kicker">LEGAL</div>
        <h1 className="legal-title">Política de Privacidad</h1>
        <p className="legal-updated">Última actualización: agosto de 2026</p>

        <section className="legal-section">
          <h2>1. Introducción</h2>
          <p>
            En WIMALI Emprendimientos valoramos tu privacidad. Esta política explica qué
            información manejamos cuando usás nuestro catálogo web y cuando nos hacés un pedido a
            través de WhatsApp.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Qué información recopilamos</h2>
          <p>
            Nuestro sitio es un catálogo. No creamos cuentas ni te pedimos registrarte, y no
            almacenamos tus datos en un servidor propio. En concreto:
          </p>
          <ul>
            <li>
              <strong>Carrito y favoritos:</strong> se guardan únicamente en tu propio navegador
              (almacenamiento local del dispositivo). No se envían a ningún servidor.
            </li>
            <li>
              <strong>Datos del pedido:</strong> cuando finalizás una compra, se abre WhatsApp con
              un mensaje ya redactado. Los datos que compartas (nombre, dirección, teléfono) los
              enviás vos directamente por WhatsApp y quedan en esa conversación.
            </li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. Cómo usamos la información</h2>
          <p>
            Usamos los datos que nos compartís por WhatsApp con un único fin: gestionar tu consulta
            o pedido, coordinar el pago, el retiro o el envío, y brindarte atención. No vendemos ni
            cedemos tu información a terceros.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. WhatsApp y servicios de terceros</h2>
          <p>
            La comunicación se realiza a través de WhatsApp, que tiene sus propias condiciones y
            política de privacidad. El sitio también puede cargar fuentes tipográficas y un mapa de
            Google Maps para mostrar la ubicación. Te recomendamos revisar las políticas de esos
            servicios.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Cookies</h2>
          <p>
            No utilizamos cookies de seguimiento ni publicidad. Solo se usa el almacenamiento local
            del navegador para recordar tu carrito y tus favoritos en este dispositivo. Podés
            borrarlos limpiando los datos de navegación.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Tus derechos</h2>
          <p>
            Como no guardamos tus datos en nuestros sistemas, la información que compartiste vive en
            tu conversación de WhatsApp. Podés pedirnos por ese medio que eliminemos los mensajes o
            los datos de un pedido cuando quieras.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Contacto</h2>
          <p>
            Ante cualquier duda sobre esta política, escribinos por WhatsApp al{' '}
            <strong>{BUSINESS.phoneDisplay}</strong>.
          </p>
        </section>

        <footer className="legal-footer">
          <span>© WIMALI EMPRENDIMIENTOS</span>
          <span className="legal-credit">
            Desarrollado por{' '}
            <a href="https://neura.com.py" target="_blank" rel="noopener noreferrer">
              NEURA
            </a>
          </span>
        </footer>
      </main>
    </div>
  )
}
