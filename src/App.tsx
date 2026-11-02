import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AnimatePresence, motion } from "framer-motion";
import Index from "./pages/Index";
import MenuPage from "./pages/MenuPage";
import DealsPage from "./pages/DealsPage";
import CartPage from "./pages/CartPage";
import Auth from "./pages/Auth";
import OrdersPage from "./pages/OrdersPage";
import WishlistPage from "./pages/WishlistPage";
import ResetPassword from "./pages/ResetPassword";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import FAQPage from "./pages/FAQPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import NotFound from "./pages/NotFound";
import TableMenuPage from "./pages/TableMenuPage";
import AdminDineIn from "./pages/admin/AdminDineIn";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminDeals from "./pages/admin/AdminDeals";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminRiders from "./pages/admin/AdminRiders";
import AdminDeliveryZones from "./pages/admin/AdminDeliveryZones";
import AdminCoupons from "./pages/admin/AdminCoupons";

// POS pages
import POSTerminal from "./pages/pos/POSTerminal";
import POSOrders from "./pages/pos/POSOrders";
import POSProducts from "./pages/pos/POSProducts";
import POSReports from "./pages/pos/POSReports";

// Rider pages
import RiderLogin from "./pages/rider/RiderLogin";
import RiderDashboard from "./pages/rider/RiderDashboard";
import RiderOrders from "./pages/rider/RiderOrders";
import RiderProfile from "./pages/rider/RiderProfile";
import RiderMap from "./pages/rider/RiderMap";
import RiderEarnings from "./pages/rider/RiderEarnings";
import RiderWallet from "./pages/rider/RiderWallet";
import RiderHistory from "./pages/rider/RiderHistory";
import RiderSchedule from "./pages/rider/RiderSchedule";
import RiderNotifications from "./pages/rider/RiderNotifications";
import RiderChat from "./pages/rider/RiderChat";
import RiderReviews from "./pages/rider/RiderReviews";
import RiderPerformance from "./pages/rider/RiderPerformance";
import RiderDocuments from "./pages/rider/RiderDocuments";
import RiderHelp from "./pages/rider/RiderHelp";
import RiderSettings from "./pages/rider/RiderSettings";

const queryClient = new QueryClient();

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.25 }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/menu" element={<PageTransition><MenuPage /></PageTransition>} />
        <Route path="/deals" element={<PageTransition><DealsPage /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><CartPage /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/orders" element={<PageTransition><OrdersPage /></PageTransition>} />
        <Route path="/wishlist" element={<PageTransition><WishlistPage /></PageTransition>} />
        <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/faq" element={<PageTransition><FAQPage /></PageTransition>} />
        <Route path="/track-order" element={<PageTransition><TrackOrderPage /></PageTransition>} />
        <Route path="/order-success" element={<PageTransition><OrderSuccessPage /></PageTransition>} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/menu" element={<AdminMenu />} />
        <Route path="/admin/deals" element={<AdminDeals />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
        <Route path="/admin/riders" element={<AdminRiders />} />
        <Route path="/admin/delivery-zones" element={<AdminDeliveryZones />} />
        <Route path="/admin/coupons" element={<AdminCoupons />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/dine-in" element={<AdminDineIn />} />
        <Route path="/table/:code" element={<TableMenuPage />} />

        {/* POS routes */}
        <Route path="/pos" element={<POSTerminal />} />
        <Route path="/pos/orders" element={<POSOrders />} />
        <Route path="/pos/products" element={<POSProducts />} />
        <Route path="/pos/reports" element={<POSReports />} />

        {/* Rider routes */}
        <Route path="/rider/login" element={<RiderLogin />} />
        <Route path="/rider" element={<RiderDashboard />} />
        <Route path="/rider/orders" element={<RiderOrders />} />
        <Route path="/rider/map" element={<RiderMap />} />
        <Route path="/rider/earnings" element={<RiderEarnings />} />
        <Route path="/rider/wallet" element={<RiderWallet />} />
        <Route path="/rider/history" element={<RiderHistory />} />
        <Route path="/rider/schedule" element={<RiderSchedule />} />
        <Route path="/rider/notifications" element={<RiderNotifications />} />
        <Route path="/rider/chat" element={<RiderChat />} />
        <Route path="/rider/reviews" element={<RiderReviews />} />
        <Route path="/rider/performance" element={<RiderPerformance />} />
        <Route path="/rider/documents" element={<RiderDocuments />} />
        <Route path="/rider/help" element={<RiderHelp />} />
        <Route path="/rider/settings" element={<RiderSettings />} />
        <Route path="/rider/profile" element={<RiderProfile />} />

        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AnimatedRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
