import api from "../axios";
import type { PostEmail } from "./email.types";

export const postEmail = async (params: PostEmail) => {
	try {
		const response = await api.post("/email/send", params);
		return response.data; // Retorna os dados da resposta
	} catch (error) {
		console.error("Erro no login:", error);
		throw error; // Propaga o erro para quem chamar a função
	}
};
