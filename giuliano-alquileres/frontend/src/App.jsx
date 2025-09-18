import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Páginas
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminNewProperty from "./pages/admin/AdminNewProperty";
import EditProperty from "./pages/admin/EditProperty"; // Importar

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/properties"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminProperties />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/properties/new"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminNewProperty />
                </ProtectedRoute>
              }
            />

            {/* ROTA DE EDIÇÃO ATIVADA */}
            <Route
              path="/admin/properties/:id/edit"
              element={
                <ProtectedRoute adminOnly={true}>
                  <EditProperty />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
