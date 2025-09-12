import api from "../axios";
import type { TermsOfUseData } from "./termsOfUse.types";

export const getActiveTermsOfUse = async () => {
	try {
		const response = await api.get<TermsOfUseData>(`/terms-of-use`);
		return response.data; // Retorna os dados da resposta
	} catch (error) {
		console.error("Erro na coleta do termo de uso:", error);
		throw error; // Propaga o erro para quem chamar a função
	}
};
