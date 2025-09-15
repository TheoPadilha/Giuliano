import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Instância do axios
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
  (error) => {
    // Apenas logar o erro, sem redirecionar automaticamente
    if (error.response?.status === 401) {
      console.log("Erro 401 - Não autorizado:", error.config?.url);

      // Opcional: Disparar um evento customizado que outros componentes podem escutar
      window.dispatchEvent(
        new CustomEvent("unauthorized", {
          detail: {
            url: error.config?.url,
            message: error.response?.data?.message,
          },
        })
      );
    }

    return Promise.reject(error);
  }
);

export { api, API_URL };
export default api;
