import api from '../axios';

export const postFiles = async (folder: string, formData: FormData) => {
  try {
    const response = await api.post(`/files/${folder}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar arquivo:', error);
    throw error;
  }
};

export const getFiles = async (folder: string, fileId: string) => {
  try {
    const response = await api.get(`/files/${folder}/${fileId}`);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro no login:', error);
    throw error; // Propaga o erro para quem chamar a função
  }
};
