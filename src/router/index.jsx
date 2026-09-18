import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import PageTransition from '../components/common/PageTransition'
import Navbar from '../components/Navbar'
import Home   from '../pages/Home'
import Shop   from '../pages/Shop'
import Cart     from '../pages/Cart'
import Checkout from '../pages/Checkout'
import OurStory from '../pages/OurStory'
import Contact  from '../pages/Contact'
import CollectionsPage from '../pages/Collection/CollectionsPage'
import Journal from '../pages/Journal/Journal'
import Footer from '../components/Footer'
import ProtectedRoute from '../components/ProtectedRoute'
import Wishlist from '../pages/Wishlist'
import CustomOrderPage from '../pages/CustomOrder'
import CategoriesPage from '../pages/Categories'

/* ── Auth Pages ── */
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import ForgotPassword from '../pages/Auth/ForgotPassword'

/* ── User Account Pages ── */
import AccountLayout from '../pages/Account/AccountLayout'
import Profile from '../pages/Account/Profile'
import AccountOrders from '../pages/Account/Orders'
import AccountWishlist from '../pages/Account/Wishlist'
import AccountNotifications from '../pages/Account/Notifications'
import AccountSettings from '../pages/Account/Settings'
import Security from '../pages/Account/Security'

/* ── Admin Layout & Pages ── */
import AdminLayout   from '../pages/admin/layout/AdminLayout'
import Overview      from '../pages/admin/components/Overview'
import Orders        from '../pages/admin/components/Orders'
import Customers     from '../pages/admin/components/Customers'
import Payments      from '../pages/admin/components/Payments'
import Products      from '../pages/admin/components/Products'
import PromoCodes    from '../pages/admin/components/PromoCodes'
import Categories    from '../pages/admin/components/Categories'
import Reports       from '../pages/admin/components/Reports'
import AdminReviews  from '../pages/admin/components/Reviews'
import Notifications from '../pages/admin/components/Notifications'
import Settings      from '../pages/admin/components/Settings'
import AdminSecurity  from '../pages/admin/components/AdminSecurity'
import Messages      from '../pages/admin/components/Messages'
import AdminFAQs     from '../pages/admin/components/FAQs'
import FAQsPage      from '../pages/FAQs/FAQsPage'
import ProductDetails from '../pages/Product/ProductDetails'
import TrackOrderPage from '../pages/TrackOrder/TrackOrderPage'
import ShippingDeliveryPage from '../pages/ShippingDelivery/ShippingDeliveryPage'
import ReturnsExchangesPage from '../pages/ReturnsExchanges/ReturnsExchangesPage'
import SizeGuidePage  from '../pages/SizeGuide/SizeGuidePage'
import PrivacyPolicyPage from '../pages/PrivacyPolicy/PrivacyPolicyPage'
import TermsConditionsPage from '../pages/TermsConditions/TermsConditionsPage'
import CareersPage   from '../pages/Careers/CareersPage'

import WhatsAppButton from '../components/common/WhatsAppButton'
import AnnouncementBar from '../components/AnnouncementBar'

export default function AppRouter() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <AnnouncementBar />}
      {!isAdminRoute && <Navbar />}

      {/* Top Animated Gold Route Loading Indicator Bar */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bar-${location.pathname}`}
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#B8924A] via-[#E3CD91] to-[#B8924A] origin-left z-[100] pointer-events-none"
        />
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* ── Main Pages ── */}
          <Route path="/"                   element={<PageTransition><Home /></PageTransition>} />
          <Route path="/shop"               element={<PageTransition><Shop /></PageTransition>} />
          <Route path="/shop/:category"     element={<PageTransition><Shop /></PageTransition>} />
          <Route path="/categories"         element={<PageTransition><CategoriesPage /></PageTransition>} />
          <Route path="/collections"        element={<PageTransition><CollectionsPage /></PageTransition>} />
          <Route path="/collections/:slug"  element={<PageTransition><Shop /></PageTransition>} />
          <Route path="/product/:id"        element={<PageTransition><ProductDetails /></PageTransition>} />
          <Route path="/new-arrivals"       element={<PageTransition><Shop /></PageTransition>} />
          <Route path="/best-sellers"       element={<PageTransition><Shop /></PageTransition>} />

          {/* ── Brand Pages ── */}
          <Route path="/our-story"          element={<PageTransition><OurStory /></PageTransition>} />
          <Route path="/journal"            element={<PageTransition><Journal /></PageTransition>} />
          <Route path="/journal/:slug"      element={<PageTransition><Journal /></PageTransition>} />
          <Route path="/contact"            element={<PageTransition><Contact /></PageTransition>} />

          {/* ── Commerce Pages ── */}
          <Route path="/cart"               element={<PageTransition><Cart /></PageTransition>} />
          <Route path="/custom-order"       element={<PageTransition><CustomOrderPage /></PageTransition>} />
          <Route path="/checkout"           element={<ProtectedRoute><PageTransition><Checkout /></PageTransition></ProtectedRoute>} />
          
          {/* Wishlist route */}
          <Route path="/wishlist"           element={<ProtectedRoute><PageTransition><Wishlist /></PageTransition></ProtectedRoute>} />
          <Route path="/track-order"        element={<PageTransition><TrackOrderPage /></PageTransition>} />

          {/* ── Customer Care ── */}
          <Route path="/faqs"               element={<PageTransition><FAQsPage /></PageTransition>} />
          <Route path="/shipping-delivery"  element={<PageTransition><ShippingDeliveryPage /></PageTransition>} />
          <Route path="/returns-exchanges"  element={<PageTransition><ReturnsExchangesPage /></PageTransition>} />
          <Route path="/size-guide"         element={<PageTransition><SizeGuidePage /></PageTransition>} />

          {/* ── Legal ── */}
          <Route path="/privacy-policy"     element={<PageTransition><PrivacyPolicyPage /></PageTransition>} />
          <Route path="/terms-conditions"   element={<PageTransition><TermsConditionsPage /></PageTransition>} />
          <Route path="/careers"            element={<PageTransition><CareersPage /></PageTransition>} />

          {/* ── Auth ── */}
          <Route path="/login"              element={<PageTransition><Login /></PageTransition>} />
          <Route path="/register"           element={<PageTransition><Register /></PageTransition>} />
          <Route path="/forgot-password"    element={<PageTransition><ForgotPassword /></PageTransition>} />

          {/* ── User Account (nested layout) ── */}
          <Route path="/account" element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
            <Route index             element={<Profile />} />
            <Route path="orders"        element={<AccountOrders />} />
            <Route path="wishlist"      element={<AccountWishlist />} />
            <Route path="addresses"     element={<Profile />} />
            <Route path="payment-methods" element={<Profile />} />
            <Route path="notifications" element={<AccountNotifications />} />
            <Route path="settings"      element={<AccountSettings />} />
            <Route path="security"      element={<Security />} />
          </Route>

          {/* ── Admin (nested layout) ── */}
          <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
            <Route index             element={<Overview />} />
            <Route path="orders"        element={<Orders />} />
            <Route path="customers"     element={<Customers />} />
            <Route path="payments"      element={<Payments />} />
            <Route path="products"      element={<Products />} />
            <Route path="promo-codes"   element={<PromoCodes />} />
            <Route path="categories"    element={<Categories />} />
            <Route path="reports"       element={<Reports />} />
            <Route path="reviews"       element={<AdminReviews />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="messages"      element={<Messages />} />
            <Route path="faqs"          element={<AdminFAQs />} />
            <Route path="security"      element={<AdminSecurity />} />
            <Route path="settings"      element={<Settings />} />
          </Route>
        </Routes>
      </AnimatePresence>

      {!isAdminRoute && <WhatsAppButton />}
      {!isAdminRoute && <Footer />}
    </>
  )
}

