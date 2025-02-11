// File: api.js
import api from '../axios';
import { GetStudentsResponse } from './relationships.types';

export const postRelationship = async (
  teacherId: string,
  studentId: string,
) => {
  try {
    const response = await api.post(`/relationships/${teacherId}/${studentId}`);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro ao criar vinculo:', error);
    throw error; // Propaga o erro para quem chamar a função
  }
};

export const getRelationship = async (
  teacherId: string,
  params?: Record<string, string>,
) => {
  try {
    const response = await api.get<GetStudentsResponse>(
      `/relationships/${teacherId}/students`,
      { params },
    );
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro no login:', error);
    throw error; // Propaga o erro para quem chamar a função
  }
};
