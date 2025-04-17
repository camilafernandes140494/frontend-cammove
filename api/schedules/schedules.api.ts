// File: api.js
import api from '../axios';
import { SchedulesData } from './schedules.types';

export const postSchedule = async (
  teacherId: string,
  params: Partial<SchedulesData>,
) => {
  try {
    const response = await api.post(`/schedules/teachers/${teacherId}`, params);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro no login:', error);
    throw error; // Propaga o erro para quem chamar a função
  }
};

export const patchSchedule = async (
  teacherId: string,
  scheduleId: string,
  params: Partial<SchedulesData>,
) => {
  try {
    const response = await api.patch(
      `/schedules/teachers/${teacherId}/schedules/${scheduleId}`,
      params,
    );
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro no login:', error);
    throw error; // Propaga o erro para quem chamar a função
  }
};

export const getSchedule = async (
  teacherId: string,
  params?: Record<string, string>,
) => {
  try {
    const response = await api.get<SchedulesData[]>(
      `/schedules/teachers/${teacherId}`,
      { params },
    );
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro no login:', error);
    throw error; // Propaga o erro para quem chamar a função
  }
};

export const getScheduleById = async (
  teacherId: string,
  scheduleId: string,
) => {
  try {
    const response = await api.get<SchedulesData>(
      `/schedules/teachers/${teacherId}/schedules/${scheduleId}`,
    );
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro no login:', error);
    throw error; // Propaga o erro para quem chamar a função
  }
};
