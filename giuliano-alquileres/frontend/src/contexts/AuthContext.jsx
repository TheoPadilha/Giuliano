import { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar autenticação ao carregar a aplicação
  useEffect(() => {
    checkAuth();
  }, []);

  // Auto-refresh do token a cada 6 dias (antes de expirar)
  useEffect(() => {
    if (isAuthenticated) {
      const refreshInterval = setInterval(() => {
        refreshToken();
      }, 6 * 24 * 60 * 60 * 1000); // 6 dias em milissegundos

      return () => clearInterval(refreshInterval);
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await authAPI.verify();
      setUser(response.data.user);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);

      return { success: true, user };
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao fazer login",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);

      return { success: true, user };
    } catch (error) {
      console.error("Erro ao registrar:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao registrar",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshToken = async () => {
    try {
      const response = await authAPI.refresh();
      const { token } = response.data;
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      logout();
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export default AuthContext;
