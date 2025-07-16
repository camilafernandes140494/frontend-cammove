import api from "../axios";
import { WorkoutSuggestionData } from "./openai.type";

export const postWorkoutSuggestion = async (
  params: WorkoutSuggestionData,
) => {
  try {
    const response = await api.post(
      `/gemini/workouts`,
      params,
    );
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro ao sugerir treino:', error);
    throw error; // Propaga o erro para quem chamar a função
  }
};