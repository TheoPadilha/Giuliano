// src/App.jsx - VERSÃO COMPLETA E CORRIGIDA
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// --- Páginas Públicas ---
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";

// --- Páginas de Autenticação ---
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RegisterNew from "./pages/auth/RegisterNew";

// --- Páginas de Perfil ---
import Profile from "./pages/Profile";

// --- Páginas Administrativas ---
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminNewProperty from "./pages/admin/AdminNewProperty";
import EditProperty from "./pages/admin/EditProperty";
import UsersPage from "./pages/admin/UsersPage"; // <-- Importe a nova página que vamos criar

// --- Páginas de Pagamento ---
import Checkout from "./pages/Checkout";
import BookingCheckout from "./pages/BookingCheckout";
import BookingConfirmation from "./pages/BookingConfirmation";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentPending from "./pages/PaymentPending";
import PaymentFailure from "./pages/PaymentFailure";

// --- Páginas do Usuário ---
import MyBookings from "./pages/MyBookings";
import MyBookingsNew from "./pages/MyBookingsNew";
import Favorites from "./pages/Favorites";
import MyReviews from "./pages/MyReviews";

// --- Páginas de Utilidade ---
// É uma boa prática componentizar a página 404
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* =====================================
                ROTAS PÚBLICAS E DE AUTENTICAÇÃO
            ====================================== */}
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:uuid" element={<PropertyDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterNew />} />
            <Route path="/register-old" element={<Register />} />

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

            {/* Criar Novo Imóvel */}
            <Route
              path="/admin/properties/new"
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
            
            {/* Perfil do Usuário */}
            <Route
              path="/profile"
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
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
