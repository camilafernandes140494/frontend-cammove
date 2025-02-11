// File: api.js
import api from '../axios';
import { getWorkoutsSummaryResponse } from './workout.types';

export const postRelationship = async (
  teacherId: string,
  relationshipId: string,
) => {
  try {
    const response = await api.post(
      `/workouts/teachers/${teacherId}/relationships/${relationshipId}`,
    );
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro ao criar vinculo:', error);
    throw error; // Propaga o erro para quem chamar a função
  }
};

export const getWorkoutsSummary = async (
  teacherId: string,
  params?: Record<string, string>,
) => {
  try {
    const response = await api.get<getWorkoutsSummaryResponse[]>(
      `/workouts/teachers/${teacherId}/summary`,
      {
        params,
      },
    );
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro no login:', error);
    throw error; // Propaga o erro para quem chamar a função
  }
};
