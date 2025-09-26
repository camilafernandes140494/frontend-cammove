// File: api.js
import api from "../axios";
import type { ReviewData } from "./reviews.types";

export const postReview = async (
	teacherId: string,
	studentId: string,
	params: Partial<ReviewData>,
) => {
	try {
		const response = await api.post(
			`/reviews/teachers/${teacherId}/students/${studentId}`,
			params,
		);
		return response.data; // Retorna os dados da resposta
	} catch (error) {
		console.error("Erro no postReview:", error);
		throw error; // Propaga o erro para quem chamar a função
	}
};

export const patchReview = async (
	teacherId: string,
	studentId: string,
	workoutId: string,
	params: Partial<ReviewData>,
) => {
	try {
		const response = await api.patch(
			`/reviews/teachers/${teacherId}/students/${studentId}/workouts/${workoutId}`,
			params,
		);
		return response.data; // Retorna os dados da resposta
	} catch (error) {
		console.error("Erro no patchReview:", error);
		throw error; // Propaga o erro para quem chamar a função
	}
};

export const getReviewById = async (
	teacherId: string,
	workoutId: string,
	studentId: string,
) => {
	try {
		const response = await api.get<Partial<ReviewData>>(
			`/reviews/teachers/${teacherId}/students/${studentId}/workouts/${workoutId}`,
		);
		return response.data; // Retorna os dados da resposta
	} catch (error) {
		console.error("Erro no getReviewById:", error);
		throw error; // Propaga o erro para quem chamar a função
	}
};

export const getReviewsByTeacher = async (
	teacherId: string,
	params?: Record<string, string>,
) => {
	try {
		const response = await api.get<Partial<ReviewData>[]>(
			`/reviews/teachers/${teacherId}/reviews`,
			{ params },
		);
		return response.data; // Retorna os dados da resposta
	} catch (error) {
		console.error("Erro no getReviewsByTeacher:", error);
		throw error; // Propaga o erro para quem chamar a função
	}
};

export const getReview = async (params?: Record<string, string>) => {
	try {
		const response = await api.get<ReviewData[]>(`/reviews`, { params });
		return response.data; // Retorna os dados da resposta
	} catch (error) {
		console.error("Erro no getReview:", error);
		throw error; // Propaga o erro para quem chamar a função
	}
};
