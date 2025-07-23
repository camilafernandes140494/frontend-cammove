import api from "../axios";
import { WorkoutSuggestionData, WorkoutSuggestionResponse } from "./gemini.type";

export const postWorkoutSuggestion = async (
  params: WorkoutSuggestionData,
) => {
  try {
    const response = await api.post<{treino: WorkoutSuggestionResponse[]}>(
      `/gemini/workouts`,
      params,
    );
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro ao sugerir treino:', error);
    throw error; // Propaga o erro para quem chamar a função
  }
};