import axios from "axios";

// Remover barra final para evitar URLs duplas
const API_URL = (
  import.meta.env.VITE_API_URL || "https://giulianoa-backend.onrender.com"
).replace(/\/$/, "");

// Instância principal do axios
const api = axios.create({
  baseURL: `${API_URL}`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper seguro para localStorage
const safeLocalStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn("localStorage não disponível:", error);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn("localStorage não disponível:", error);
      return false;
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn("localStorage não disponível:", error);
      return false;
    }
  },
};

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = safeLocalStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas e erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Tratamento de erro de rede
    if (!error.response) {
      if (error.message === "Network Error") {
        console.error("Erro de rede: Verifique sua conexão com a internet");
        return Promise.reject(new Error("Sem conexão com a internet"));
      }
      // Timeout ou outros erros sem resposta
      return Promise.reject(error);
    }

    // Se for erro 403 (Forbidden - conta pendente/rejeitada), não tentar refresh
    if (error.response?.status === 403) {
      return Promise.reject(error);
    }

    // Se o erro for 401 e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const token = safeLocalStorage.getItem("token");
        if (token) {
          // Tentar renovar o token
          const response = await axios.post(
            `${API_URL}/api/auth/refresh`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const newToken = response.data.token;
          safeLocalStorage.setItem("token", newToken);

          // ATUALIZA O TOKEN NO CABEÇALHO PADRÃO DO AXIOS
          api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

          // Retentar a requisição original com o novo token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Se falhar ao renovar, limpar o token e redirecionar para login
        safeLocalStorage.removeItem("token");
        safeLocalStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ===== EXPORTS NOMEADOS PARA AUTENTICAÇÃO =====
export const authAPI = {
  register: (userData) => api.post("/api/auth/register", userData),
  login: (credentials) => api.post("/api/auth/login", credentials),
  verify: () => api.get("/api/auth/verify"),
  refresh: () => api.post("/api/auth/refresh"),
};

// ===== EXPORTS NOMEADOS PARA PROPRIEDADES =====
export const propertiesAPI = {
  getAll: (params) => api.get("/api/properties", { params }),
  getById: (id) => api.get(`/api/properties/${id}`),
  create: (data) => api.post("/api/properties", data),
  update: (id, data) => api.put(`/api/properties/${id}`, data),
  delete: (id) => api.delete(`/api/properties/${id}`),
};

// ===== EXPORTS NOMEADOS PARA UTILITIES =====
export const utilitiesAPI = {
  getCities: () => api.get("/api/utilities/cities"),
  getAmenities: () => api.get("/api/utilities/amenities"),
};

// ===== EXPORT DEFAULT (Instância do axios) =====
export default api;

// ===== EXPORT DA URL BASE =====
export { API_URL };



