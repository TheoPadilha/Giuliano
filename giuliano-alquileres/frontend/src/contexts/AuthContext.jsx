import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import api from "../services/api"; // Importa a instância do Axios

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // Efeito para configurar o token na instância do Axios sempre que ele mudar
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  const checkAuth = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    setLoading(true);
    try {
      // A rota /verify agora é /api/auth/verify
      const response = await api.get("/api/auth/verify");
      const fetchedUser = response.data.user;
      setUser(fetchedUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(fetchedUser));
    } catch (error) {
      console.error("Erro ao verificar autenticação, limpando sessão:", error);
      setUser(null);
      setIsAuthenticated(false);
      setToken(null); // Limpa o token do estado
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Verificar autenticação ao carregar a aplicação
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      const { token: newToken, user: loggedInUser } = response.data;

      setToken(newToken); // Atualiza o token no estado e no localStorage (via useEffect)
      setUser(loggedInUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      return { success: true, user: loggedInUser };
    } catch (error) {
      console.error("Erro ao fazer login:", error);

      // Capturar mensagem detalhada do backend (incluindo status 403)
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || errorData?.error || "Erro ao fazer login";

      return {
        success: false,
        error: errorData?.error || "Erro ao fazer login",
        message: errorMessage,
      };
    }
  };

  // --- CORREÇÃO CRÍTICA ---
  // A função de registro NÃO deve fazer login automático.
  const register = async (userData) => {
    try {
      // A rota de registro não retorna mais token, apenas uma mensagem de sucesso.
      const response = await api.post("/api/auth/register", userData);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Erro ao registrar:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Erro ao registrar",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setToken(null); // Limpa o token do estado e do localStorage (via useEffect)
    localStorage.removeItem("user");
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    token, // Expondo o token para ser usado nos cabeçalhos
    login,
    register,
    logout,
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
