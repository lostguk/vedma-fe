import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import FloatingPanel from './components/FloatingPanel/FloatingPanel'
import CartToast from './components/CartToast/CartToast'
import CookieBanner from './components/CookieBanner/CookieBanner'
import AgeGate from './components/AgeGate/AgeGate'
import PageTransition from './components/PageTransition/PageTransition'
import useScrollToTop from './hooks/useScrollToTop'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage/CatalogPage'
import ProductPage from './pages/ProductPage/ProductPage'
import FavoritesPage from './pages/FavoritesPage/FavoritesPage'
import CheckoutPage from './pages/CheckoutPage/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage/OrderSuccessPage'
import OrderErrorPage from './pages/OrderErrorPage/OrderErrorPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import StaticPage from './pages/StaticPage/StaticPage'
import VerifyEmailPage from './pages/VerifyEmailPage/VerifyEmailPage'
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage'

function AppContent() {
  useScrollToTop()

  return (
    <>
      <Header />
      <main>
        <PageTransition>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/order-error" element={<OrderErrorPage />} />
            <Route path="/payment-success" element={<OrderSuccessPage />} />
            <Route path="/payment-error" element={<OrderErrorPage />} />
            <Route path="/profile/*" element={<ProfilePage />} />
            <Route path="/delivery" element={<StaticPage />} />
            <Route path="/returns" element={<StaticPage />} />
            <Route path="/contacts" element={<StaticPage />} />
            <Route path="/privacy" element={<StaticPage />} />
            <Route path="/offer" element={<StaticPage />} />
            <Route path="/verify-registration/:user/:hash" element={<VerifyEmailPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </PageTransition>
      </main>
      <Footer />
      <FloatingPanel />
      <CartToast />
      <CookieBanner />
      <AgeGate />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
