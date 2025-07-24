import api from '../axios';
import type {
  WorkoutSuggestionData,
  WorkoutSuggestionResponse,
} from './gemini.type';

export const postWorkoutSuggestion = async (params: WorkoutSuggestionData) => {
  try {
    const response = await api.post<WorkoutSuggestionResponse>(
      '/gemini/workouts',
      params
    );
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    throw error; // Propaga o erro para quem chamar a função
  }
};
