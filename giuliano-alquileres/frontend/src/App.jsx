// src/App.jsx - OPTIMIZED VERSION WITH CODE SPLITTING & ACCESSIBILITY
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { initGA, initGTM } from "./utils/googleAnalytics";
import { startKeepAlive, stopKeepAlive } from "./utils/keepAlive";
import CookieConsent from "./components/common/CookieConsent";
import PageLoader from "./components/common/PageLoader";
import ScrollToTop from "./components/common/ScrollToTop";

// --- Páginas Críticas (Loaded Immediately) ---
// Páginas principais carregadas imediatamente para melhor experiência do usuário
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import GuestLogin from "./pages/auth/GuestLogin";
import Login from "./pages/auth/Login";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FAQ from "./pages/FAQ";
import NotFoundPage from "./pages/NotFoundPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import Cancellation from "./pages/Cancellation";
import Sitemap from "./pages/Sitemap";
import Diversity from "./pages/Diversity";
import Accessibility from "./pages/Accessibility";
import Host from "./pages/Host";
import HostResources from "./pages/HostResources";
import Refer from "./pages/Refer";
import Visit from "./pages/Visit";
import Forum from "./pages/Forum";
import ResponsibleHosting from "./pages/ResponsibleHosting";

// --- Lazy Loaded Pages (Code Splitting) ---
// Páginas menos acessadas carregadas sob demanda

// Auth Pages
const Register = lazy(() => import("./pages/auth/Register"));
const RegisterNew = lazy(() => import("./pages/auth/RegisterNew"));
const GuestRegister = lazy(() => import("./pages/auth/GuestRegister"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));

// User Profile Pages
const ProfileAirbnb = lazy(() => import("./pages/ProfileAirbnb"));

// Admin Pages
const AdminDashboardNew = lazy(() => import("./pages/admin/AdminDashboardNew"));
const AdminProperties = lazy(() => import("./pages/admin/AdminProperties"));
const AdminNewPropertyAirbnb = lazy(() => import("./pages/admin/AdminNewPropertyAirbnb"));
const EditProperty = lazy(() => import("./pages/admin/EditProperty"));
const UsersPage = lazy(() => import("./pages/admin/UsersPage"));
const AdminCityGuides = lazy(() => import("./pages/admin/AdminCityGuides"));
const AdminBookings = lazy(() => import("./pages/admin/AdminBookings"));

// Booking & Payment Pages
const BookingCheckout = lazy(() => import("./pages/BookingCheckout"));
const BookingConfirmation = lazy(() => import("./pages/BookingConfirmation"));
const BookingSuccess = lazy(() => import("./pages/BookingSuccess"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentPending = lazy(() => import("./pages/PaymentPending"));
const PaymentFailure = lazy(() => import("./pages/PaymentFailure"));

// User Account Pages
const MyBookingsNew = lazy(() => import("./pages/MyBookingsNew"));
const BookingDetails = lazy(() => import("./pages/BookingDetails"));
const Favorites = lazy(() => import("./pages/Favorites"));
const MyReviews = lazy(() => import("./pages/MyReviews"));

// Style Guide (Development only)
const StyleGuide = lazy(() => import("./pages/StyleGuide"));

function App() {
  // Inicializar Google Analytics e GTM quando o app carrega
  useEffect(() => {
    initGA();
    initGTM();

    // Iniciar keep-alive para manter o backend acordado (Render free tier)
    startKeepAlive();

    // Cleanup: parar keep-alive quando o componente desmontar
    return () => {
      stopKeepAlive();
    };
  }, []);

  return (
    <DarkModeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen bg-gray-50">
            {/* Main content wrapper */}
            <main id="main-content">
              <Suspense fallback={<PageLoader />}>
                <Routes>
            {/* =====================================
                ROTAS PÚBLICAS E DE AUTENTICAÇÃO
            ====================================== */}
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:uuid" element={<PropertyDetails />} />

            {/* Autenticação de Administradores */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterNew />} />
            <Route path="/register-old" element={<Register />} />

            {/* Autenticação de Hóspedes/Clientes */}
            <Route path="/guest-login" element={<GuestLogin />} />
            <Route path="/guest-register" element={<GuestRegister />} />

            {/* Recuperação de Senha */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Páginas Legais e Suporte */}
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route path="/cancellation" element={<Cancellation />} />
            <Route path="/sitemap" element={<Sitemap />} />

            {/* Comunidade */}
            <Route path="/diversity" element={<Diversity />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/refer" element={<Refer />} />
            <Route path="/visit" element={<Visit />} />

            {/* Anfitrião */}
            <Route path="/host" element={<Host />} />
            <Route path="/host-resources" element={<HostResources />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/responsible-hosting" element={<ResponsibleHosting />} />

            {/* Design System Style Guide */}
            <Route path="/style-guide" element={<StyleGuide />} />

            {/* =====================================
                ROTAS PROTEGIDAS PARA ADMINS
            ====================================== */}

            {/* --- Rota exclusiva do ADMIN_MASTER --- */}
            {/* Apenas o admin master pode ver e gerenciar todos os usuários. */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="admin_master">
                  <UsersPage />
                </ProtectedRoute>
              }
            />

            {/* --- Rotas que AMBOS (admin e admin_master) podem acessar --- */}
            {/* Graças à nossa lógica no ProtectedRoute, o admin_master também terá acesso aqui. */}

            {/* Dashboard Principal do Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboardNew />
                </ProtectedRoute>
              }
            />

            {/* Listagem de Imóveis do Admin */}
            <Route
              path="/admin/properties"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminProperties />
                </ProtectedRoute>
              }
            />

            {/* Criar Novo Imóvel */}
            <Route
              path="/admin/properties/new"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminNewPropertyAirbnb />
                </ProtectedRoute>
              }
            />

            {/* Editar Imóvel Existente */}
            <Route
              path="/admin/properties/:id/edit"
              element={
                <ProtectedRoute requiredRole="admin">
                  <EditProperty />
                </ProtectedRoute>
              }
            />

            {/* Guias de Turismo - Admin */}
            <Route
              path="/admin/city-guides"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminCityGuides />
                </ProtectedRoute>
              }
            />

            {/* Gerenciar Reservas - Admin */}
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminBookings />
                </ProtectedRoute>
              }
            />

            {/* =====================================
                ROTAS DE PAGAMENTO (Protegidas)
            ====================================== */}

            {/* Página de Checkout */}
            <Route
              path="/booking-checkout"
              element={
                <ProtectedRoute>
                  <BookingCheckout />
                </ProtectedRoute>
              }
            />

            {/* Página de Sucesso da Reserva (Beta Mode + Production) */}
            <Route
              path="/booking-success"
              element={
                <ProtectedRoute>
                  <BookingSuccess />
                </ProtectedRoute>
              }
            />

            {/* Nova Página de Confirmação */}
            <Route
              path="/booking-confirmation"
              element={
                <ProtectedRoute>
                  <BookingConfirmation />
                </ProtectedRoute>
              }
            />

            {/* Páginas de Retorno do Mercado Pago */}
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/pending" element={<PaymentPending />} />
            <Route path="/payment/failure" element={<PaymentFailure />} />

            {/* =====================================
                ROTAS DO USUÁRIO (Protegidas)
            ====================================== */}

            {/* Perfil do Usuário */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileAirbnb />
                </ProtectedRoute>
              }
            />

            {/* Minhas Reservas */}
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookingsNew />
                </ProtectedRoute>
              }
            />

            {/* Detalhes da Reserva */}
            <Route
              path="/my-bookings/:id"
              element={
                <ProtectedRoute>
                  <BookingDetails />
                </ProtectedRoute>
              }
            />

            {/* Meus Favoritos */}
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />

            {/* Minhas Avaliações */}
            <Route
              path="/my-reviews"
              element={
                <ProtectedRoute>
                  <MyReviews />
                </ProtectedRoute>
              }
            />

            {/* =====================================
                ROTA PARA PÁGINA NÃO ENCONTRADA (404)
            ====================================== */}
            <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </main>

            {/* Shared components outside main content */}
            {/* WhatsAppButton agora aparece apenas no Home */}
            <CookieConsent />
          </div>
        </Router>
      </FavoritesProvider>
    </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
