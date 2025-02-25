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

export const patchWorkout = async (
  workoutId: string,
  teacherId: string,
  studentId: string,
  params: Partial<WorkoutData>,
) => {
  try {
    const response = await api.patch(
      `/workouts/${workoutId}/students/${studentId}/teacher/${teacherId}`,
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

export const deleteWorkoutsByStudentId = async (
  workoutId: string,
  studentId: string,
  teacherId: string,
) => {
  try {
    const response = await api.delete(
      `/workouts/${workoutId}/students/${studentId}/teacher/${teacherId}`,
    );
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro no login:', error);
    throw error; // Propaga o erro para quem chamar a função
  }
};

export const duplicateWorkout = async (
  workoutId: string,
  studentId: string,
  teacherId: string,
) => {
  try {
    const response = await api.post(
      `/workouts/${workoutId}/students/${studentId}/teachers/${teacherId}/duplicate`,
    );
    return response.data;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
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
