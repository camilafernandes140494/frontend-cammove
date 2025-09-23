// api.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { type AxiosRequestConfig } from "axios";

// Rotas públicas que não precisam de token
const publicPaths = ["/auth/login", "/auth/register", "/auth/forgot-password"];

const api = axios.create({
	baseURL: "https://backend-cammove.vercel.app",
	headers: {
		"Content-Type": "application/json",
	},
});

// Interceptor de requisição
api.interceptors.request.use(
	async (config: AxiosRequestConfig) => {
		try {
			const isPublic = publicPaths.some((path) => config.url?.includes(path));
			if (isPublic) return config;

			const storedUser = await AsyncStorage.getItem("@user_data");
			const user = storedUser ? JSON.parse(storedUser) : null;

			if (user?.token) {
				if (!config.headers) {
					config.headers = {};
				}
				config.headers["Authorization"] = `Bearer ${user.token}`;
			}
		} catch (err) {
			console.error("Erro ao pegar token do AsyncStorage:", err);
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

		// Só remove usuário se for rota protegida
		if (!isPublic && error.response?.status === 401) {
			console.log(
				"Token inválido ou expirado. Removendo usuário do AsyncStorage.",
			);
			await AsyncStorage.removeItem("@user_data");
		}

		return Promise.reject(error);
	},
);

export default api;
