// api.ts

import axios from "axios";
import { authService } from "./auth/auth.service";

// Rotas públicas que não precisam de token
const publicPaths = [
	"/auth/login",
	"/auth/register",
	"/auth/forgot-password",
	"/terms-of-use",
	"/terms-of-use/all",
];

const api = axios.create({
	baseURL: "https://backend-cammove.vercel.app",
	headers: {
		"Content-Type": "application/json",
	},
});

// Interceptor de requisição
api.interceptors.request.use(
	async (config) => {
		const isPublic = publicPaths.some((path) => config.url?.includes(path));
		if (isPublic) return config;

		const token = authService.getToken();
		if (token) {
			if (config.headers) {
				config.headers["Authorization"] = `Bearer ${token}`;
			}
		}

		return config;
	},
	(error) => Promise.reject(error),
);

// Interceptor de resposta: logout automático em 401
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const requestUrl = error.config?.url || "";
		const isPublic = publicPaths.some((path) => requestUrl.includes(path));

		if (!isPublic && error.response?.status === 401) {
			await authService.clearToken(); // limpa memória + AsyncStorage
			// opcional: notificar contexto / navegação
		}

		return Promise.reject(error);
	},
);

export default api;
