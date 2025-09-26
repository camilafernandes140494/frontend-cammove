// File: api.js
import api from "../axios";

export const logTrainingDay = async (
	studentId: string,
	workout: { nameWorkout: string; type?: string },
) => {
	try {
		const response = await api.post(
			`/workouts-day/students/${studentId}`,
			workout,
		);
		return response.data; // Retorna os dados da resposta
	} catch (error) {
		console.error("Erro ao criar treino:", error);
		throw error; // Propaga o erro para quem chamar a função
	}
};

export const getTrainingDays = async (studentId: string) => {
	try {
		const response = await api.get<
			{ date: string; nameWorkout: string; type: string }[]
		>(`/workouts-day/students/${studentId}`);
		return response.data; // Retorna os dados da resposta
	} catch (error) {
		console.error("Erro no getTrainingDays:", error);
		throw error; // Propaga o erro para quem chamar a função
	}
};
