import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Páginas
import Home from "./pages/Home";
import Login from "./pages/Login";
import PropertyDetails from "./pages/PropertyDetails";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminNewProperty from "./pages/admin/AdminNewProperty";
import EditProperty from "./pages/admin/EditProperty";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* ===== ROTAS PÚBLICAS ===== */}

            {/* Página inicial */}
            <Route path="/" element={<Home />} />

            {/* Detalhes do imóvel - NOVA ROTA */}
            <Route path="/property/:uuid" element={<PropertyDetails />} />

            {/* Login */}
            <Route path="/login" element={<Login />} />

            {/* ===== ROTAS ADMINISTRATIVAS (PROTEGIDAS) ===== */}

            {/* Dashboard Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Gerenciar Imóveis */}
            <Route
              path="/admin/properties"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminProperties />
                </ProtectedRoute>
              }
            />

            {/* Novo Imóvel */}
            <Route
              path="/admin/properties/new"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminNewProperty />
                </ProtectedRoute>
              }
            />

            {/* Editar Imóvel */}
            <Route
              path="/admin/properties/:id/edit"
              element={
                <ProtectedRoute adminOnly={true}>
                  <EditProperty />
                </ProtectedRoute>
              }
            />

            {/* ===== ROTA 404 (OPCIONAL) ===== */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🏠</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                      Página não encontrada
                    </h1>
                    <p className="text-gray-600 mb-6">
                      A página que você procura não existe ou foi removida.
                    </p>
                    <div className="space-y-3">
                      <a href="/" className="btn-primary inline-block">
                        🏠 Ver Todos os Imóveis
                      </a>
                      <br />
                      <button
                        onClick={() => window.history.back()}
                        className="btn-secondary"
                      >
                        ← Voltar
                      </button>
                    </div>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
