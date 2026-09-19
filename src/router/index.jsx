import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import PageTransition from '../components/common/PageTransition'
import Navbar from '../components/Navbar'
import Home from '../pages/Home'
import Footer from '../components/Footer'
import ProtectedRoute from '../components/ProtectedRoute'
import WhatsAppButton from '../components/common/WhatsAppButton'
import AnnouncementBar from '../components/AnnouncementBar'

/* ── Lazy Loaded Main Pages ── */
const Shop = lazy(() => import('../pages/Shop'))
const Cart = lazy(() => import('../pages/Cart'))
const Checkout = lazy(() => import('../pages/Checkout'))
const OurStory = lazy(() => import('../pages/OurStory'))
const Contact = lazy(() => import('../pages/Contact'))
const CollectionsPage = lazy(() => import('../pages/Collection/CollectionsPage'))
const Journal = lazy(() => import('../pages/Journal/Journal'))
const Wishlist = lazy(() => import('../pages/Wishlist'))
const CustomOrderPage = lazy(() => import('../pages/CustomOrder'))
const CategoriesPage = lazy(() => import('../pages/Categories'))
const ProductDetails = lazy(() => import('../pages/Product/ProductDetails'))
const TrackOrderPage = lazy(() => import('../pages/TrackOrder/TrackOrderPage'))
const ShippingDeliveryPage = lazy(() => import('../pages/ShippingDelivery/ShippingDeliveryPage'))
const ReturnsExchangesPage = lazy(() => import('../pages/ReturnsExchanges/ReturnsExchangesPage'))
const SizeGuidePage = lazy(() => import('../pages/SizeGuide/SizeGuidePage'))
const PrivacyPolicyPage = lazy(() => import('../pages/PrivacyPolicy/PrivacyPolicyPage'))
const TermsConditionsPage = lazy(() => import('../pages/TermsConditions/TermsConditionsPage'))
const CareersPage = lazy(() => import('../pages/Careers/CareersPage'))
const FAQsPage = lazy(() => import('../pages/FAQs/FAQsPage'))

/* ── Auth Pages ── */
const Login = lazy(() => import('../pages/Auth/Login'))
const Register = lazy(() => import('../pages/Auth/Register'))
const ForgotPassword = lazy(() => import('../pages/Auth/ForgotPassword'))

/* ── User Account Pages ── */
const AccountLayout = lazy(() => import('../pages/Account/AccountLayout'))
const Profile = lazy(() => import('../pages/Account/Profile'))
const AccountOrders = lazy(() => import('../pages/Account/Orders'))
const AccountWishlist = lazy(() => import('../pages/Account/Wishlist'))
const AccountNotifications = lazy(() => import('../pages/Account/Notifications'))
const AccountSettings = lazy(() => import('../pages/Account/Settings'))
const Security = lazy(() => import('../pages/Account/Security'))

/* ── Admin Layout & Pages ── */
const AdminLayout = lazy(() => import('../pages/admin/layout/AdminLayout'))
const Overview = lazy(() => import('../pages/admin/components/Overview'))
const Orders = lazy(() => import('../pages/admin/components/Orders'))
const Customers = lazy(() => import('../pages/admin/components/Customers'))
const Payments = lazy(() => import('../pages/admin/components/Payments'))
const Products = lazy(() => import('../pages/admin/components/Products'))
const PromoCodes = lazy(() => import('../pages/admin/components/PromoCodes'))
const Categories = lazy(() => import('../pages/admin/components/Categories'))
const Reports = lazy(() => import('../pages/admin/components/Reports'))
const AdminReviews = lazy(() => import('../pages/admin/components/Reviews'))
const Notifications = lazy(() => import('../pages/admin/components/Notifications'))
const Settings = lazy(() => import('../pages/admin/components/Settings'))
const AdminSecurity = lazy(() => import('../pages/admin/components/AdminSecurity'))
const Messages = lazy(() => import('../pages/admin/components/Messages'))
const AdminFAQs = lazy(() => import('../pages/admin/components/FAQs'))

const RouteFallback = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3 py-16">
    <div className="w-8 h-8 border-3 border-[#FF1F3D] border-t-transparent rounded-full animate-spin" />
  </div>
);

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
        <Suspense fallback={<RouteFallback />}>
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
        </Suspense>
      </AnimatePresence>

      {!isAdminRoute && <WhatsAppButton />}
      {!isAdminRoute && <Footer />}
    </>
  )
}

