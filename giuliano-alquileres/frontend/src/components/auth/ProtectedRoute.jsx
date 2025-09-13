import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Loading from "../common/Loading";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <Loading text="Verificando autenticação..." />;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Negado
          </h1>
          <p className="text-gray-600 mb-4">
            Você precisa ser administrador para acessar esta área.
          </p>
          <a href="/" className="btn-primary">
            Voltar ao início
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
