import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, redirecionar para login apropriado
  if (!isAuthenticated) {
    // Se a rota requer admin, redireciona para login admin
    // Caso contrário, redireciona para login de hóspede
    const loginPath = requiredRole && (requiredRole === "admin" || requiredRole === "admin_master")
      ? "/login"
      : "/guest-login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // ====================================================================
  // --- INÍCIO DA LÓGICA DE HIERARQUIA DE PERMISSÃO (A PARTE NOVA) ---
  // ====================================================================

  // Se a rota requer um papel específico, vamos verificar.
  if (requiredRole) {
    const userRole = user?.role; // Papel do usuário logado (ex: 'admin' ou 'admin_master')

    let hasPermission = false;

    // Cenário 1: A rota requer 'admin_master'
    if (requiredRole === "admin_master") {
      // Apenas o 'admin_master' tem permissão.
      if (userRole === "admin_master") {
        hasPermission = true;
      }
    }
    // Cenário 2: A rota requer 'admin'
    else if (requiredRole === "admin") {
      // Tanto 'admin' quanto 'admin_master' têm permissão, pois o master pode tudo.
      if (userRole === "admin" || userRole === "admin_master") {
        hasPermission = true;
      }
    }
    // Cenário 3: A rota requer 'client' (hóspede)
    else if (requiredRole === "client") {
      // Apenas clientes têm permissão
      if (userRole === "client") {
        hasPermission = true;
      }
    }

    // Se, após todas as verificações, o usuário não tiver permissão...
    if (!hasPermission) {
      // ...renderiza a sua excelente tela de "Acesso Negado".
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🚫</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Acesso Negado
            </h2>
            <p className="text-gray-600 mb-6">
              Você não tem permissão para acessar esta página.
            </p>
            <button
              onClick={() => window.history.back()}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-medium shadow-md hover:bg-red-700 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      );
    }
  }
  // ====================================================================
  // --- FIM DA LÓGICA DE HIERARQUIA DE PERMISSÃO ---
  // ====================================================================

  // Se a rota não requer um papel específico (requiredRole é null),
  // ou se o usuário passou na verificação de permissão,
  // então renderiza o componente filho (a página protegida).
  return children;
};

export default ProtectedRoute;
