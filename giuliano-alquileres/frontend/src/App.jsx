// src/App.jsx - VERSÃO COMPLETA E CORRIGIDA
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Páginas Públicas
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";

// Páginas de Autenticação
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Páginas Administrativas
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
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:uuid" element={<PropertyDetails />} />

            {/* ===== ROTAS DE AUTENTICAÇÃO ===== */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ===== ROTAS ADMINISTRATIVAS (PROTEGIDAS) ===== */}

            {/* Dashboard Principal */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Listagem de Imóveis Admin */}
            <Route
              path="/admin/properties"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminProperties />
                </ProtectedRoute>
              }
            />

            {/* Criar Novo Imóvel */}
            <Route
              path="/admin/properties/new"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminNewProperty />
                </ProtectedRoute>
              }
            />

            {/* Editar Imóvel Existente */}
            <Route
              path="/admin/properties/:id/edit"
              element={
                <ProtectedRoute adminOnly={true}>
                  <EditProperty />
                </ProtectedRoute>
              }
            />

            {/* ===== ROTA 404 ===== */}
            <Route
              path="*"
              element={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                  <div className="text-center max-w-md">
                    {/* Ícone */}
                    <div className="text-8xl mb-6">🏠</div>

                    {/* Número 404 */}
                    <h1 className="text-6xl font-bold text-red-600 mb-4">
                      404
                    </h1>

                    {/* Título */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Página não encontrada
                    </h2>

                    {/* Descrição */}
                    <p className="text-gray-600 mb-8">
                      A página que você procura não existe ou foi removida.
                    </p>

                    {/* Botões de Ação */}
                    <div className="space-y-3">
                      <a
                        href="/"
                        className="inline-block w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        🏠 Voltar para Home
                      </a>
                      <button
                        onClick={() => window.history.back()}
                        className="w-full bg-white text-gray-700 border-2 border-gray-300 hover:border-red-600 hover:text-red-600 font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        ← Página Anterior
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
