// File: api.js
import api from '../axios';
import { getWorkoutsSummaryResponse, WorkoutData } from './workout.types';

export const postWorkout = async (
  teacherId: string,
  studentId: string,
  params: WorkoutData,
) => {
  try {
    const response = await api.post(
      `/workouts/teachers/${teacherId}/students/${studentId}`,
      params,
    );
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro ao criar treino:', error);
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

export const getWorkoutsByStudentId = async (studentId: string) => {
  try {
    const response = await api.get<string[]>(`/workouts/students/${studentId}`);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro no login:', error);
    throw error; // Propaga o erro para quem chamar a função
  }
};

export const getWorkoutByStudentIdAndWorkoutId = async (
  workoutsId: string,
  studentId: string,
) => {
  try {
    const response = await api.get<WorkoutData>(
      `/workouts/${workoutsId}/students/${studentId}`,
    );
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro no login:', error);
    throw error; // Propaga o erro para quem chamar a função
  }
};
