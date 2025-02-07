import api from '../axios';
import { Exercise, Upload } from './exercise.types';

export const postExercise = async (params: Exercise) => {
  try {
    const response = await api.post(`/exercises`, params);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro no login:', error);
    throw error; // Propaga o erro para quem chamar a função
  }
};

export const getExercises = async (params?: Record<string, string>) => {
  try {
    const response = await api.get<Exercise[]>(`/exercises`, { params });
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro ao carregar exercícios:', error);
    throw error; // Propaga o erro para quem chamar a função
  }
};

export const getExerciseById = async (exerciseId: string) => {
  try {
    const response = await api.get<Exercise>(`/exercises/${exerciseId}`);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro ao carregar exercícios:', error);
    throw error; // Propaga o erro para quem chamar a função
  }
};

export const postUpload = async (formData: FormData) => {
  try {
    const response = await api.post<{ url: string }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Garantir que o Content-Type esteja como multipart/form-data
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao carregar fotos:', error);
    throw error;
  }
};
