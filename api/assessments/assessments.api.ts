import api from "../axios";
import type { AssessmentData, BasicAssessmentItem } from "./assessments.types";

export const postAssessments = async (
	teacherId: string,
	studentId: string,
	params: Partial<AssessmentData>,
) => {
	try {
		const response = await api.post(
			`/physical-assessment/teachers/${teacherId}/students/${studentId}`,
			params,
		);
		return response.data; // Retorna os dados da resposta
	} catch (error) {
		console.error("Erro ao criar treino:", error);
		throw error; // Propaga o erro para quem chamar a função
	}
};

export const patchAssessments = async (
	assessmentsId: string,
	teacherId: string,
	studentId: string,
	params: Partial<AssessmentData>,
) => {
	try {
		const response = await api.patch(
			`/physical-assessment/${assessmentsId}/students/${studentId}/teacher/${teacherId}`,
			params,
		);
		return response.data; // Retorna os dados da resposta
	} catch (error) {
		console.error("Erro ao criar treino:", error);
		throw error; // Propaga o erro para quem chamar a função
	}
};

export const deleteAssessmentsByStudentId = async (
	assessmentsId: string,
	studentId: string,
	teacherId: string,
) => {
	try {
		const response = await api.delete(
			`/physical-assessment/${assessmentsId}/students/${studentId}/teacher/${teacherId}`,
		);
		return response.data; // Retorna os dados da resposta
	} catch (error) {
		console.error("Erro pra deletar avaliação:", error);
		throw error; // Propaga o erro para quem chamar a função
	}
};

export const getAssessmentsByStudentIdAndAssessmentsId = async (
	assessmentsId: string,
	studentId: string,
) => {
	try {
		const response = await api.get<AssessmentData>(
			`/physical-assessment/${assessmentsId}/students/${studentId}`,
		);
		return response.data; // Retorna os dados da resposta
	} catch (error) {
		console.error(
			"Erro no retorno do getAssessmentsByStudentIdAndAssessmentsId:",
			error,
		);
		throw error; // Propaga o erro para quem chamar a função
	}
};

export const getAssessmentsByStudentId = async (studentId: string) => {
	try {
		const response = await api.get<BasicAssessmentItem[]>(
			`/physical-assessment/students/${studentId}`,
		);
		return response.data; // Retorna os dados da resposta
	} catch (error) {
		console.error("Erro no getAssessmentsByStudentId:", error);
		throw error; // Propaga o erro para quem chamar a função
	}
};

export const getAssessmentsSummary = async (
	teacherId: string,
	params?: Record<string, string>,
) => {
	try {
		const response = await api.get<any[]>(
			`/physical-assessment/teachers/${teacherId}/summary`,
			{
				params,
			},
		);
		return response.data; // Retorna os dados da resposta
	} catch (error) {
		console.error("Erro no getAssessmentsSummary:", error);
		throw error; // Propaga o erro para quem chamar a função
	}
};
