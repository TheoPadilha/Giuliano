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

// --- Páginas Administrativas ---
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminNewProperty from "./pages/admin/AdminNewProperty";
import EditProperty from "./pages/admin/EditProperty";
import UsersPage from "./pages/admin/UsersPage"; // <-- Importe a nova página que vamos criar

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
            <Route path="/register" element={<Register />} />

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
