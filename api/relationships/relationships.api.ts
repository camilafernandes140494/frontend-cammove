// File: api.js
import api from "../axios";

export const postRelationship = async (
  teacherId: string,
  studentId: string
) => {
  try {
    const response = await api.post(`/relationships/${teacherId}/${studentId}`);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao criar vinculo:", error);
    throw error; // Propaga o erro para quem chamar a função
  }
};
