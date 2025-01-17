// File: api.js
import { PostCreateUser } from "./auth.types";
import api from "../axios";

export const postCreateUser = async (params: PostCreateUser) => {
  try {
    const response = await api.post("/auth/register", {
      email: params.email,
      password: params.password,
    });
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro no login:", error);
    throw error; // Propaga o erro para quem chamar a função
  }
};
