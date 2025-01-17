import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-cammove.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error("Erro na requisição:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erro da resposta da API
      console.error(`Erro na resposta: ${error.response.status}`);
      if (error.response.status === 401) {
        // Lógica de logout ou redirecionamento
      }
    } else if (error.request) {
      // Erro na requisição, por exemplo, se não há resposta do servidor
      console.error(
        "Erro na requisição (sem resposta do servidor):",
        error.request
      );
    } else {
      // Erro ao configurar a requisição
      console.error("Erro ao configurar a requisição:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
