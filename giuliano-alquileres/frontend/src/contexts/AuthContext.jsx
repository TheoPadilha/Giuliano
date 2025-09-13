import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar token ao carregar a aplicação
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error("Erro ao parsear usuário do localStorage:", error);
        logout();
      }
    }

    setLoading(false);
  }, []);

  // Função de login
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token: newToken, user: userData } = response.data;

      // Verificar se o usuário é admin
      if (userData.role !== "admin") {
        return {
          success: false,
          error:
            "Acesso negado. Apenas administradores podem acessar o painel.",
        };
      }

      // Salvar no localStorage
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));

      // Atualizar estado
      setToken(newToken);
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error("Erro no login:", error);

      let errorMessage = "Erro ao fazer login";

      if (error.response?.status === 401) {
        errorMessage = "Email ou senha incorretos. Verifique suas credenciais.";
      } else if (error.response?.status === 404) {
        errorMessage = "Usuário não encontrado. Verifique o email digitado.";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // Função de registro
  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);

      const { token: newToken, user: userInfo } = response.data;

      // Salvar no localStorage
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userInfo));

      // Atualizar estado
      setToken(newToken);
      setUser(userInfo);

      return { success: true };
    } catch (error) {
      console.error("Erro no registro:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Erro ao criar conta",
      };
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // Verificar se token ainda é válido
  const verifyToken = async () => {
    try {
      const response = await api.get("/auth/verify");
      return response.data.valid;
    } catch (error) {
      logout();
      return false;
    }
  };

  // Verificar se usuário é admin
  const isAdmin = () => {
    return user?.role === "admin";
  };

  // Verificar se está autenticado
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    verifyToken,
    isAdmin,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
