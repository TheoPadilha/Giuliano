
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Instância principal do axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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

    // Se o erro for 401 e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Tentar renovar o token
          const response = await axios.post(
            `${API_URL}/auth/refresh`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const newToken = response.data.token;
          localStorage.setItem("token", newToken);
          
          // ATUALIZA O TOKEN NO CABEÇALHO PADRÃO DO AXIOS
          api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

          // Retentar a requisição original com o novo token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Se falhar ao renovar, limpar o token e redirecionar para login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ===== EXPORTS NOMEADOS PARA AUTENTICAÇÃO =====
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  verify: () => api.get("/auth/verify"),
  refresh: () => api.post("/auth/refresh"),
};

// ===== EXPORTS NOMEADOS PARA PROPRIEDADES =====
export const propertiesAPI = {
  getAll: (params) => api.get("/properties", { params }),
  getById: (id) => api.get(`/properties/${id}`),
  create: (data) => api.post("/properties", data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
};

// ===== EXPORTS NOMEADOS PARA UTILITIES =====
export const utilitiesAPI = {
  getCities: () => api.get("/utilities/cities"),
  getAmenities: () => api.get("/utilities/amenities"),
};

// ===== EXPORT DEFAULT (Instância do axios) =====
export default api;

// ===== EXPORT DA URL BASE =====
export { API_URL };
