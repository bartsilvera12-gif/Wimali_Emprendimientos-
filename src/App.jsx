import ClickSpark from './blocks/ClickSpark/ClickSpark.jsx'
import { StoreProvider, useStore } from './store.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import SearchBar from './components/SearchBar.jsx'
import Categories from './components/Categories.jsx'
import Catalog from './components/Catalog.jsx'
import Favorites from './components/Favorites.jsx'
import Offers from './components/Offers.jsx'
import CtaBanner from './components/CtaBanner.jsx'
import About from './components/About.jsx'
import LocationSection from './components/LocationSection.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import ProductView from './components/ProductView.jsx'
import BottomNav from './components/BottomNav.jsx'
import Fab from './components/Fab.jsx'

function Shell() {
  const { view, cartOpen, menuOpen, isMobile } = useStore()
  return (
    <div className="app">
      <Header />
      {view === 'home' ? (
        <main id="top">
          <Hero />
          <SearchBar />
          <Categories />
          <Catalog />
          <Offers />
          <CtaBanner />
          <About />
          <LocationSection />
          <Contact />
        </main>
      ) : view === 'favorites' ? (
        <Favorites />
      ) : (
        <ProductView />
      )}
      <Footer />
      {cartOpen && <CartDrawer />}
      <Fab />
      {isMobile && !cartOpen && !menuOpen && <BottomNav />}
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <ClickSpark sparkColor="#E4BD69" sparkSize={9} sparkRadius={18} sparkCount={8} duration={450}>
        <Shell />
      </ClickSpark>
    </StoreProvider>
  )
}
