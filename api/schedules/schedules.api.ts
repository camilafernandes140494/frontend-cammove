// File: api.js
import api from '../axios';
import {
  SchedulesData,
  SchedulesDateData,
  SchedulesStudentDateData,
} from './schedules.types';

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

export const getScheduleDates = async (teacherId: string) => {
  try {
    const response = await api.get<SchedulesStudentDateData[]>(
      `/schedules/teachers/${teacherId}/dates`,
    );
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro no login:', error);
    throw error; // Propaga o erro para quem chamar a função
  }
};

export const getScheduleDatesByStudent = async (
  teacherId: string,
  studentId: string,
) => {
  try {
    const response = await api.get<SchedulesStudentDateData[]>(
      `/schedules/teachers/${teacherId}/students/${studentId}/dates`,
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

export const deleteScheduleById = async (
  teacherId: string,
  scheduleId: string,
) => {
  try {
    const response = await api.delete(
      `/schedules/teachers/${teacherId}/schedules/${scheduleId}/delete`,
    );
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro no login:', error);
    throw error; // Propaga o erro para quem chamar a função
  }
};
