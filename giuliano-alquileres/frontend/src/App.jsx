// src/App.jsx - OPTIMIZED VERSION WITH CODE SPLITTING & ACCESSIBILITY
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { initGA, initGTM } from "./utils/googleAnalytics";
import CookieConsent from "./components/common/CookieConsent";
import PageLoader from "./components/common/PageLoader";

// --- Páginas Críticas (Loaded Immediately) ---
// Keep home and essential pages as eager imports for better initial load
import Home from "./pages/Home";
import WhatsAppButton from "./components/common/WhatsAppButton";

// --- Lazy Loaded Pages (Code Splitting) ---

// Public Pages
const Properties = lazy(() => import("./pages/Properties"));
const PropertyDetails = lazy(() => import("./pages/PropertyDetails"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Auth Pages
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const RegisterNew = lazy(() => import("./pages/auth/RegisterNew"));
const GuestLogin = lazy(() => import("./pages/auth/GuestLogin"));
const GuestRegister = lazy(() => import("./pages/auth/GuestRegister"));

// User Profile Pages
const Profile = lazy(() => import("./pages/Profile"));
const ProfileAirbnb = lazy(() => import("./pages/ProfileAirbnb"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminDashboardNew = lazy(() => import("./pages/admin/AdminDashboardNew"));
const AdminProperties = lazy(() => import("./pages/admin/AdminProperties"));
const AdminNewProperty = lazy(() => import("./pages/admin/AdminNewProperty"));
const AdminNewPropertyAirbnb = lazy(() => import("./pages/admin/AdminNewPropertyAirbnb"));
const EditProperty = lazy(() => import("./pages/admin/EditProperty"));
const UsersPage = lazy(() => import("./pages/admin/UsersPage"));
const AdminCityGuides = lazy(() => import("./pages/admin/AdminCityGuides"));

// Booking & Payment Pages
const Checkout = lazy(() => import("./pages/Checkout"));
const BookingCheckout = lazy(() => import("./pages/BookingCheckout"));
const BookingConfirmation = lazy(() => import("./pages/BookingConfirmation"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentPending = lazy(() => import("./pages/PaymentPending"));
const PaymentFailure = lazy(() => import("./pages/PaymentFailure"));

// User Account Pages
const MyBookings = lazy(() => import("./pages/MyBookings"));
const MyBookingsNew = lazy(() => import("./pages/MyBookingsNew"));
const Favorites = lazy(() => import("./pages/Favorites"));
const MyReviews = lazy(() => import("./pages/MyReviews"));

// Style Guide (Development only)
const StyleGuide = lazy(() => import("./pages/StyleGuide"));

function App() {
  // Inicializar Google Analytics e GTM quando o app carrega
  useEffect(() => {
    initGA();
    initGTM();
  }, []);

  return (
    <DarkModeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <Router>
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

            {/* Dashboard Principal do Admin - Nova Versão */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboardNew />
                </ProtectedRoute>
              }
            />

            {/* Dashboard Antigo */}
            <Route
              path="/admin/dashboard-old"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
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

            {/* Criar Novo Imóvel - Versão Airbnb */}
            <Route
              path="/admin/properties/new"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminNewPropertyAirbnb />
                </ProtectedRoute>
              }
            />

            {/* Criar Novo Imóvel - Versão Antiga */}
            <Route
              path="/admin/properties/new-old"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminNewProperty />
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

            {/* =====================================
                ROTAS DE PAGAMENTO (Protegidas)
            ====================================== */}

            {/* Nova Página de Checkout Profissional */}
            <Route
              path="/booking-checkout"
              element={
                <ProtectedRoute>
                  <BookingCheckout />
                </ProtectedRoute>
              }
            />

            {/* Página de Checkout Antiga (para bookings existentes) */}
            <Route
              path="/checkout/:bookingId"
              element={
                <ProtectedRoute>
                  <Checkout />
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

            {/* Perfil do Usuário - Estilo Airbnb */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileAirbnb />
                </ProtectedRoute>
              }
            />

            {/* Perfil Antigo - Para Backup */}
            <Route
              path="/profile-old"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Minhas Reservas - Nova Versão */}
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookingsNew />
                </ProtectedRoute>
              }
            />

            {/* Minhas Reservas - Versão Antiga (manter por compatibilidade) */}
            <Route
              path="/my-bookings-old"
              element={
                <ProtectedRoute>
                  <MyBookings />
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
            <WhatsAppButton />
            <CookieConsent />
          </div>
        </Router>
      </FavoritesProvider>
    </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
