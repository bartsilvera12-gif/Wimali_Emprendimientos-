import Particles from '../blocks/Particles/Particles.jsx'
import SplitText from '../blocks/SplitText/SplitText.jsx'
import GradientText from '../blocks/GradientText/GradientText.jsx'

export default function Hero() {
  return (
    <section className="hero">
      <img className="hero-bg" src="assets/hero-bg.png" alt="" aria-hidden="true" />
      <div className="hero-overlay" />
      <div className="hero-particles">
        <Particles
          particleColors={['#c9913d', '#e4bd69', '#f6e3bd']}
          particleCount={140}
          particleSpread={14}
          speed={0.14}
          particleBaseSize={90}
          sizeRandomness={1}
          alphaParticles
          moveParticlesOnHover
          particleHoverFactor={2}
        />
      </div>

      <div className="hero-inner">
        <div className="hero-copy">
          <h1 className="hero-title">
            <SplitText
              text="Todo lo que necesitás,"
              tag="span"
              className="hero-line"
              splitType="chars"
              delay={26}
              duration={0.9}
              textAlign="left"
            />
            <GradientText
              className="hero-gradient"
              colors={['#C9913D', '#E4BD69', '#F6F1E7', '#E4BD69', '#C9913D']}
              animationSpeed={5}
            >
              en un solo lugar.
            </GradientText>
          </h1>
          <p className="hero-sub">
            Tecnología, accesorios, hogar, belleza y mucho más. Encontrá lo que buscás y hacé tu
            pedido fácilmente por WhatsApp.
          </p>
        </div>
      </div>
    </section>
  )
}
