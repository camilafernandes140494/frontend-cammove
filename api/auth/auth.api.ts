// File: api.js
import { PostCreateUser } from './auth.types';
import api from '../axios';

export const postCreateUser = async (params: PostCreateUser) => {
  try {
    const response = await api.post('/auth/register', {
      email: params.email,
      password: params.password,
    });
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro no login:', error);
    throw error; // Propaga o erro para quem chamar a função
  }
};

export const postLogin = async (params: PostCreateUser) => {
  try {
    const response = await api.post('/auth/login', {
      email: params.email,
      password: params.password,
    });
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro no login:', error);
    throw error; // Propaga o erro para quem chamar a função
  }
};

export const postResetPassword = async (params: Partial<PostCreateUser>) => {
  try {
    const response = await api.post('/auth/forgot-password', {
      email: params.email,
    });
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro no login:', error);
    throw error; // Propaga o erro para quem chamar a função
  }
};
