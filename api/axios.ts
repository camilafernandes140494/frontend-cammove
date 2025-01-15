import axios from "axios";

// Configuração do Axios
const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptores (Requisição)
api.interceptors.request.use(
  (config) => {
    // Adicionar token ou outras modificações antes da requisição
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptores (Resposta)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratar erros globalmente
    if (error.response && error.response.status === 401) {
      // Lógica de logout ou redirecionamento
    }
    return Promise.reject(error);
  }
);

export default api;
