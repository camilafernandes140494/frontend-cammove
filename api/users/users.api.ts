// File: api.js
import api from "../axios";
import type { PostUser, Users } from "./users.types";

export const postUser = async (IdUser: string, params: Partial<PostUser>) => {
	try {
		const response = await api.post(`/users/${IdUser}`, params);
		return response.data; // Retorna os dados da resposta
	} catch (error) {
		console.error("Erro no login:", error);
		throw error; // Propaga o erro para quem chamar a função
	}
};

export const postDeviceToken = async (
	IdUser: string,
	params: Partial<PostUser>,
) => {
	try {
		const response = await api.post(`/users/${IdUser}/device-token`, params);
		return response.data;
	} catch (error) {
		console.error("Erro no cadastro do device token:", error);
		throw error;
	}
};

export const patchUser = async (IdUser: string, params: Partial<PostUser>) => {
	try {
		const response = await api.patch(`/users/${IdUser}`, params);
		return response.data; // Retorna os dados da resposta
	} catch (error) {
		console.error("Erro no login:", error);
		throw error; // Propaga o erro para quem chamar a função
	}
};

export const getUserById = async (IdUser: string) => {
	try {
		const response = await api.get<Users>(`/users/${IdUser}`);
		return response.data; // Retorna os dados da resposta
	} catch (error) {
		console.error("Erro no login:", error);
		throw error; // Propaga o erro para quem chamar a função
	}
};

export const getUsers = async (params?: Record<string, string>) => {
	try {
		const response = await api.get<Users[]>(`/users`, { params });
		return response.data; // Retorna os dados da resposta
	} catch (error) {
		console.error("Erro no login:", error);
		throw error; // Propaga o erro para quem chamar a função
	}
};
