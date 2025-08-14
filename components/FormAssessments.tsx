import {
	getAssessmentsByStudentIdAndAssessmentsId,
	patchAssessments,
	postAssessments,
} from "@/api/assessments/assessments.api";
import type { AssessmentData } from "@/api/assessments/assessments.types";
import { postEmail } from "@/api/email/email.api";
import type { PostEmail } from "@/api/email/email.types";
import { sendNotification } from "@/api/notifications/notifications.api";
import { calculateIMC } from "@/common/common";
import GeneratePDFBase64 from "@/common/GeneratePDFBase64";
import { useStudent } from "@/context/StudentContext";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FlatList, View } from "react-native";
import {
	Button,
	Card,
	Chip,
	Snackbar,
	Text,
	TextInput,
} from "react-native-paper";
import * as z from "zod";
import { FormField } from "./FormField";
import Skeleton from "./Skeleton";

interface FormAssessmentsProps {
	assessmentsId?: string;
}

const FormAssessments = ({ assessmentsId }: FormAssessmentsProps) => {
	const [visible, setVisible] = useState(false);
	const { student, resetStudent } = useStudent();
	const { user } = useUser();
	const { theme } = useTheme();
	const today = new Date();
	const navigation = useNavigation();
	const isFocused = useIsFocused();

	const {
		data: assessmentsByStudent,
		refetch,
		isLoading,
	} = useQuery({
		queryKey: [
			"getAssessmentsByStudentIdAndAssessmentsId",
			assessmentsId,
			student?.id,
		],
		queryFn: () =>
			getAssessmentsByStudentIdAndAssessmentsId(
				assessmentsId || "",
				student?.id || "",
			),
		enabled:
			isFocused && !!assessmentsId && !!student?.id && student.id !== user?.id,
	});

	const [sendEmail, setSendEmail] = useState(false);

	const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

	const handleSendPDFEmail = async () => {
		try {
			setSendEmail(true);
			const pdfBase64 = await GeneratePDFBase64(
				`
        Medições Corporais
    
        Peso: ${assessmentsByStudent?.bodyMeasurements?.weight || ""} kg
        Altura: ${assessmentsByStudent?.bodyMeasurements?.height || ""} cm
        Porcentagem de Gordura Corporal: ${assessmentsByStudent?.bodyMeasurements?.bodyFatPercentage || ""}%
        IMC: ${assessmentsByStudent?.bodyMeasurements?.imc || ""}
    
        Circunferências 
        Cintura: ${assessmentsByStudent?.bodyMeasurements?.waistCircumference || ""} cm
        Quadril: ${assessmentsByStudent?.bodyMeasurements?.hipCircumference || ""} cm
        Peito: ${assessmentsByStudent?.bodyMeasurements?.chestCircumference || ""} cm
        Braço Direita: ${assessmentsByStudent?.bodyMeasurements?.rightArmCircumference || ""} cm | Braço Esquerda: ${assessmentsByStudent?.bodyMeasurements?.leftArmCircumference || ""} cm
        Coxa Direita: ${assessmentsByStudent?.bodyMeasurements?.rightThighCircumference || ""} cm | Coxa Esquerda: ${assessmentsByStudent?.bodyMeasurements?.leftThighCircumference || ""} cm
        Panturrilha Direita: ${assessmentsByStudent?.bodyMeasurements?.rightCalfCircumference || ""} cm | Panturrilha Esquerda: ${assessmentsByStudent?.bodyMeasurements?.leftCalfCircumference || ""} cm
        Pescoço: ${assessmentsByStudent?.bodyMeasurements?.neckCircumference || ""} cm
    
        Composição Corporal
        Massa Muscular: ${assessmentsByStudent?.bodyMass.muscleMass || ""} kg
        Massa Óssea: ${assessmentsByStudent?.bodyMass.boneMass || ""} kg
    
        Frequência Cardíaca
        Em repouso: ${assessmentsByStudent?.heartRate?.restingHeartRate || ""} bpm
        Máxima: ${assessmentsByStudent?.heartRate?.maxHeartRate || ""} bpm
    
        Equilíbrio e Mobilidade 
        Teste de Equilíbrio: ${assessmentsByStudent?.balanceAndMobility?.balanceTest || ""}
        Teste de Mobilidade: ${assessmentsByStudent?.balanceAndMobility?.mobilityTest || ""}
    
        Postura 
        Avaliação Postural: ${assessmentsByStudent?.posture?.postureAssessment || ""}
    
        Histórico Médico 
        Lesões Anteriores: ${assessmentsByStudent?.medicalHistory?.injuryHistory || ""}
        Condições Médicas: ${assessmentsByStudent?.medicalHistory?.medicalConditions || ""}
        Dores Crônicas: ${assessmentsByStudent?.medicalHistory?.chronicPain || ""}
    
        Objetivos 
        ${assessmentsByStudent?.fitnessGoals || ""}
    
        Observações
        ${assessmentsByStudent?.observations || ""}
    
        Caso tenha dúvidas ou precise de ajustes no seu plano de treino, me avise! Vamos juntos alcançar seus objetivos.
    
        Atenciosamente,
        ${user?.name}
        Equipe CamMove 
    `,
				student,
			);

			const emailData: PostEmail = {
				to: [student?.email || ""],
				subject: " Sua Avaliação Física – Resultados e Análise",
				body: `Olá ${student?.name} <br><br>

        Tudo bem? Segue em anexo sua avaliação física com todos os detalhes sobre seu progresso e pontos de melhoria. <br><br>

        Com base nesses resultados, podemos ajustar seu treino e estabelecer novas metas para que você continue evoluindo.<br><br>
        
        Se tiver dúvidas ou quiser marcar uma conversa para discutirmos os próximos passos, me avise! Estou à disposição.<br><br>

        Vamos juntos alcançar seus objetivos! 💪<br><br>

        Atenciosamente,
        ${user?.name}<br><br>
        Equipe CamMove 🚀 `,
				attachments: [
					{
						filename: `avaliacao-${formattedDate}.pdf`,
						content: pdfBase64, // Conteúdo em base64
						encoding: "base64", // Valor fixo para 'base64'
					},
				],
			};

			// Chamando a função da API
			await postEmail(emailData);
		} catch (error) {
			console.error("Erro ao gerar/enviar PDF:", error);
		} finally {
			setSendEmail(false);
		}
	};

	const schema = z.object({
		studentName: z.string(),
		studentId: z.string(),
		bodyMeasurements: z.object({
			weight: z.string().optional(),
			height: z.string().optional(),
			bodyFatPercentage: z.string().optional(),
			imc: z.string().optional(),
			waistCircumference: z.string().optional(),
			hipCircumference: z.string().optional(),
			chestCircumference: z.string().optional(),
			rightArmCircumference: z.string().optional(),
			leftArmCircumference: z.string().optional(),
			rightThighCircumference: z.string().optional(),
			leftThighCircumference: z.string().optional(),
			rightCalfCircumference: z.string().optional(),
			leftCalfCircumference: z.string().optional(),
			neckCircumference: z.string().optional(),
		}),
		bodyMass: z.object({
			muscleMass: z.string().optional(),
			boneMass: z.string().optional(),
		}),
		heartRate: z.object({
			restingHeartRate: z.string().optional(),
			maxHeartRate: z.string().optional(),
		}),
		balanceAndMobility: z.object({
			balanceTest: z.object({
				value: z.string().optional(),
				label: z.string().optional(),
			}),
			mobilityTest: z.object({
				value: z.string().optional(),
				label: z.string().optional(),
			}),
		}),
		posture: z.object({
			postureAssessment: z.object({
				value: z.string().optional(),
				label: z.string().optional(),
			}),
		}),
		medicalHistory: z.object({
			injuryHistory: z.string().optional(),
			medicalConditions: z.string().optional(),
			chronicPain: z.string().optional(),
		}),
		fitnessGoals: z.string().optional(),
		observations: z.string().optional(),
		assessmentDate: z.string().optional(),
	});

	const mapAssessmentToForm = useMemo(
		() => ({
			studentName: student?.name || "",
			studentId: student?.id || "",
			bodyMeasurements: {
				weight: assessmentsByStudent?.bodyMeasurements?.weight || undefined,
				height: assessmentsByStudent?.bodyMeasurements?.height || undefined,
				bodyFatPercentage:
					assessmentsByStudent?.bodyMeasurements?.bodyFatPercentage ||
					undefined,
				imc: assessmentsByStudent?.bodyMeasurements?.imc || "",
				waistCircumference:
					assessmentsByStudent?.bodyMeasurements?.waistCircumference ||
					undefined,
				hipCircumference:
					assessmentsByStudent?.bodyMeasurements?.hipCircumference || undefined,
				chestCircumference:
					assessmentsByStudent?.bodyMeasurements?.chestCircumference ||
					undefined,
				rightArmCircumference:
					assessmentsByStudent?.bodyMeasurements?.rightArmCircumference ||
					undefined,
				leftArmCircumference:
					assessmentsByStudent?.bodyMeasurements?.leftArmCircumference ||
					undefined,
				rightThighCircumference:
					assessmentsByStudent?.bodyMeasurements?.rightThighCircumference ||
					undefined,
				leftThighCircumference:
					assessmentsByStudent?.bodyMeasurements?.leftThighCircumference ||
					undefined,
				rightCalfCircumference:
					assessmentsByStudent?.bodyMeasurements?.rightCalfCircumference ||
					undefined,
				leftCalfCircumference:
					assessmentsByStudent?.bodyMeasurements?.leftCalfCircumference ||
					undefined,
				neckCircumference:
					assessmentsByStudent?.bodyMeasurements?.neckCircumference ||
					undefined,
			},
			bodyMass: {
				muscleMass: assessmentsByStudent?.bodyMass?.muscleMass || undefined,
				boneMass: assessmentsByStudent?.bodyMass?.boneMass || undefined,
			},
			heartRate: {
				restingHeartRate:
					assessmentsByStudent?.heartRate?.restingHeartRate || undefined,
				maxHeartRate:
					assessmentsByStudent?.heartRate?.maxHeartRate || undefined,
			},
			balanceAndMobility: {
				balanceTest: {
					label: assessmentsByStudent?.balanceAndMobility?.balanceTest || "",
					value: assessmentsByStudent?.balanceAndMobility?.balanceTest || "",
				},
				mobilityTest: {
					label: assessmentsByStudent?.balanceAndMobility?.mobilityTest || "",
					value: assessmentsByStudent?.balanceAndMobility?.mobilityTest || "",
				},
			},
			posture: {
				postureAssessment: {
					label: assessmentsByStudent?.posture?.postureAssessment || "",
					value: assessmentsByStudent?.posture?.postureAssessment || "",
				},
			},
			medicalHistory: {
				injuryHistory:
					assessmentsByStudent?.medicalHistory?.injuryHistory || "",
				medicalConditions:
					assessmentsByStudent?.medicalHistory?.medicalConditions || "",
				chronicPain: assessmentsByStudent?.medicalHistory?.chronicPain || "",
			},
			fitnessGoals: assessmentsByStudent?.fitnessGoals || "",
			observations: assessmentsByStudent?.observations || "",
			assessmentDate: assessmentsByStudent?.assessmentDate || "",
		}),
		[assessmentsByStudent, student],
	);

	const { control, handleSubmit, watch, setValue, getValues, reset } = useForm<
		z.infer<typeof schema>
	>({
		resolver: zodResolver(schema),
		defaultValues: mapAssessmentToForm,
	});

	useEffect(() => {
		if (assessmentsByStudent) {
			reset(mapAssessmentToForm);
		}
	}, [mapAssessmentToForm, assessmentsByStudent, reset]);

	const selectedWeight = watch("bodyMeasurements.weight");
	const selectedHeight = watch("bodyMeasurements.height");

	const imcDescription = useMemo(() => {
		const alturaStr = String(selectedHeight ?? "0");
		const pesoStr = String(selectedWeight ?? "0");

		const alturaEmMetros = Number(alturaStr.replace(",", ".")) / 100;
		const peso = Number(pesoStr.replace(",", "."));

		const resultadoIMC = calculateIMC(peso, alturaEmMetros || 0);

		return `${resultadoIMC.categoria} - ${resultadoIMC.imc}`;
	}, [selectedWeight, selectedHeight]);

	useEffect(() => {
		const currentIMC = getValues("bodyMeasurements.imc");
		if (currentIMC !== imcDescription) {
			setValue("bodyMeasurements.imc", imcDescription);
		}
	}, [imcDescription]);

	const assessmentMutation = useMutation({
		mutationFn: async (data: Partial<AssessmentData>) => {
			if (assessmentsId) {
				await patchAssessments(
					assessmentsId,
					user?.id || "",
					student?.id || "",
					data,
				);
			} else {
				await postAssessments(user?.id || "", student?.id || "", data);
			}
		},
		onSuccess: async () => {
			if (assessmentsId) {
				refetch();
			} else {
				navigation.navigate("Assessments" as never);
			}
			handleSendPDFEmail();
			await sendNotification({
				title: "📊 Avaliação física liberada!",
				message:
					"Sua avaliação chegou! Confira seus resultados e acompanhe seu progresso. 🚀",
				token: [student?.deviceToken || ""],
			});
		},
		onError: () => {
			setVisible(true);
		},
		onSettled: () => {
			resetStudent();
		},
	});

	const onSubmit = (data: Partial<AssessmentData>) => {
		const dataToSend = {
			...data,
			posture: {
				postureAssessment: getValues().posture.postureAssessment.value,
			},
			balanceAndMobility: {
				balanceTest: getValues().balanceAndMobility.balanceTest.value,
				mobilityTest: getValues().balanceAndMobility.mobilityTest.value,
			},
		};
		assessmentMutation.mutate(dataToSend);
	};

	const createdAtText = assessmentsByStudent?.createdAt
		? `Criado em: ${format(new Date(assessmentsByStudent.createdAt), "dd/MM/yyyy - HH:mm")}`
		: "Criado em: --";

	return (
		<>
			<>
				{assessmentsId && (
					<View
						style={{
							backgroundColor: theme.colors.secondaryContainer,
							paddingBottom: 12,

							gap: 8,
						}}
					>
						<Text
							style={{ marginLeft: 16, color: theme.colors.outline }}
							variant="bodySmall"
						>
							{createdAtText}
						</Text>
						<Text
							style={{ marginLeft: 16, color: theme.colors.outline }}
							variant="bodySmall"
						>
							ID: {assessmentsId}
						</Text>
						<View
							style={{
								padding: 12,
							}}
						>
							<Button
								disabled={sendEmail}
								icon="email-fast-outline"
								mode="contained"
								onPress={handleSendPDFEmail}
							>
								Enviar por e-mail
							</Button>
						</View>
					</View>
				)}
			</>
			<FlatList
				contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
				data={[{}]}
				keyboardShouldPersistTaps="handled"
				keyExtractor={() => "FormWorkout"}
				renderItem={() => (
					<>
						{assessmentsId && isLoading ? (
							<FormAssessmentsSkeleton />
						) : (
							<View style={{ padding: 20, gap: 16 }}>
								<Card>
									<Card.Title title="Medidas Corporais" />
									<Card.Content style={{ gap: 10 }}>
										<FormField
											control={control}
											keyboardType="numeric"
											label="Peso"
											left={<TextInput.Icon icon="scale-balance" />}
											mode="flat"
											name="bodyMeasurements.weight"
											right={<TextInput.Affix text=" kg" />}
											type="text"
										/>
										<FormField
											control={control}
											keyboardType="numeric"
											label="Altura"
											left={<TextInput.Icon icon="human-male-height-variant" />}
											mode="flat"
											name="bodyMeasurements.height"
											right={<TextInput.Affix text=" cm" />}
											type="text"
										/>
										<FormField
											control={control}
											keyboardType="numeric"
											label="Porcentagem de Gordura Corporal"
											left={<TextInput.Icon icon="percent" />}
											mode="flat"
											name="bodyMeasurements.bodyFatPercentage"
											right={<TextInput.Affix text=" %" />}
											type="text"
										/>

										<Chip icon="information">{`${imcDescription} (IMC)`}</Chip>
									</Card.Content>
								</Card>

								<Card>
									<Card.Title title="Medidas de Circunferência" />
									<Card.Content style={{ gap: 10 }}>
										<FormField
											control={control}
											keyboardType="numeric"
											label="Cintura"
											left={<TextInput.Icon icon="ruler" />}
											mode="flat"
											name="bodyMeasurements.waistCircumference"
											right={<TextInput.Affix text=" cm" />}
											type="text"
										/>

										<FormField
											control={control}
											keyboardType="decimal-pad"
											label="Quadril" // permite ponto nos iPhones
											left={<TextInput.Icon icon="ruler" />}
											mode="flat"
											name="bodyMeasurements.hipCircumference"
											right={<TextInput.Affix text=" cm" />}
											type="text"
										/>
										<FormField
											control={control}
											keyboardType="numeric"
											label="Peito"
											left={<TextInput.Icon icon="ruler" />}
											mode="flat"
											name="bodyMeasurements.chestCircumference"
											right={<TextInput.Affix text=" cm" />}
											type="text"
										/>
										<FormField
											control={control}
											keyboardType="numeric"
											label="Pescoço"
											left={<TextInput.Icon icon="ruler" />}
											mode="flat"
											name="bodyMeasurements.neckCircumference"
											right={<TextInput.Affix text=" cm" />}
											type="text"
										/>
									</Card.Content>
								</Card>

								<Card>
									<Card.Title title="Medidas de Braços" />
									<Card.Content style={{ gap: 10 }}>
										<FormField
											control={control}
											keyboardType="numeric"
											label="Braço Direito"
											left={<TextInput.Icon icon="ruler" />}
											mode="flat"
											name="bodyMeasurements.rightArmCircumference"
											right={<TextInput.Affix text=" cm" />}
											type="text"
										/>
										<FormField
											control={control}
											keyboardType="numeric"
											label="Braço Esquerdo"
											left={<TextInput.Icon icon="ruler" />}
											mode="flat"
											name="bodyMeasurements.leftArmCircumference"
											right={<TextInput.Affix text=" cm" />}
											type="text"
										/>
									</Card.Content>
								</Card>

								<Card>
									<Card.Title title="Medidas das Pernas" />
									<Card.Content style={{ gap: 10 }}>
										<FormField
											control={control}
											keyboardType="numeric"
											label="Coxa Direita"
											left={<TextInput.Icon icon="ruler" />}
											mode="flat"
											name="bodyMeasurements.rightThighCircumference"
											right={<TextInput.Affix text=" cm" />}
											type="text"
										/>
										<FormField
											control={control}
											keyboardType="numeric"
											label="Coxa Esquerda"
											left={<TextInput.Icon icon="ruler" />}
											mode="flat"
											name="bodyMeasurements.leftThighCircumference"
											right={<TextInput.Affix text=" cm" />}
											type="text"
										/>
										<FormField
											control={control}
											keyboardType="numeric"
											label="Panturrilha Direita"
											left={<TextInput.Icon icon="ruler" />}
											mode="flat"
											name="bodyMeasurements.rightCalfCircumference"
											right={<TextInput.Affix text=" cm" />}
											type="text"
										/>
										<FormField
											control={control}
											keyboardType="numeric"
											label="Panturrilha Esquerda"
											left={<TextInput.Icon icon="ruler" />}
											mode="flat"
											name="bodyMeasurements.leftCalfCircumference"
											right={<TextInput.Affix text=" cm" />}
											type="text"
										/>
									</Card.Content>
								</Card>

								<Card>
									<Card.Title title="Massa Corporal" />
									<Card.Content style={{ gap: 10 }}>
										<FormField
											control={control}
											keyboardType="numeric"
											label="Massa Muscular"
											left={<TextInput.Icon icon="scale-balance" />}
											mode="flat"
											name="bodyMass.muscleMass"
											right={<TextInput.Affix text=" kg" />}
											type="text"
										/>
										<FormField
											control={control}
											keyboardType="numeric"
											label="Massa Óssea"
											left={<TextInput.Icon icon="bone" />}
											mode="flat"
											name="bodyMass.boneMass"
											right={<TextInput.Affix text=" kg" />}
											type="text"
										/>
									</Card.Content>
								</Card>

								<Card>
									<Card.Title title="Frequência Cardíaca" />
									<Card.Content style={{ gap: 10 }}>
										<FormField
											control={control}
											keyboardType="numeric"
											label="Em repouso"
											left={<TextInput.Icon icon="sleep" />}
											mode="flat"
											name="heartRate.restingHeartRate"
											right={<TextInput.Affix text=" bpm" />}
											type="text"
										/>
										<FormField
											control={control}
											keyboardType="numeric"
											label="Máxima"
											left={<TextInput.Icon icon="heart-pulse" />}
											mode="flat"
											name="heartRate.maxHeartRate"
											right={<TextInput.Affix text=" bpm" />}
											type="text"
										/>
									</Card.Content>
								</Card>

								<Card>
									<Card.Title title="Histórico Médico" />
									<Card.Content style={{ gap: 10 }}>
										<FormField
											control={control}
											label="Lesões Anteriores"
											left={<TextInput.Icon icon="bandage" />}
											mode="flat"
											name="medicalHistory.injuryHistory"
											type="text"
										/>
										<FormField
											control={control}
											label="Condições Médicas"
											left={<TextInput.Icon icon="stethoscope" />}
											mode="flat"
											name="medicalHistory.medicalConditions"
											type="text"
										/>
										<FormField
											control={control}
											label="Dores Crônicas"
											left={<TextInput.Icon icon="pill" />}
											mode="flat"
											name="medicalHistory.chronicPain"
											type="text"
										/>
									</Card.Content>
								</Card>
								<Card>
									<Card.Title title="Equilíbrio, Mobilidade e Postura" />
									<Card.Content style={{ gap: 10 }}>
										<Text>Teste de Equilíbrio</Text>

										<FormField
											control={control}
											getLabel={(option) => option.label}
											label="Teste de Equilíbrio"
											name="balanceAndMobility.balanceTest"
											options={[
												{ label: "Boa", value: "Boa" },
												{ label: "Regular", value: "Regular" },
												{ label: "Ruim", value: "Ruim" },
											]}
											type="select"
										/>
										<Text>Teste de Mobilidade</Text>

										<FormField
											control={control}
											getLabel={(option) => option.label}
											label="Teste de Mobilidade"
											name="balanceAndMobility.mobilityTest"
											options={[
												{ label: "Boa", value: "Boa" },
												{ label: "Regular", value: "Regular" },
												{ label: "Ruim", value: "Ruim" },
											]}
											type="select"
										/>

										<Text>Teste de Postura</Text>
										<FormField
											control={control}
											getLabel={(option) => option.label}
											label="Teste de Postura"
											name="posture.postureAssessment"
											options={[
												{ label: "Boa", value: "Boa" },
												{ label: "Regular", value: "Regular" },
												{ label: "Ruim", value: "Ruim" },
											]}
											type="select"
										/>
									</Card.Content>
								</Card>

								<Card>
									<Card.Title title="Objetivo" />
									<Card.Content style={{ gap: 10 }}>
										<FormField
											control={control}
											label="Objetivo"
											left={<TextInput.Icon icon="bullseye-arrow" />}
											mode="flat"
											name="fitnessGoals"
											type="text"
										/>
									</Card.Content>
								</Card>

								<Card>
									<Card.Title title="Observação" />
									<Card.Content style={{ gap: 10 }}>
										<FormField
											control={control}
											label="Observação"
											left={<TextInput.Icon icon="comment" />}
											mode="flat"
											name="observations"
											type="text"
										/>
									</Card.Content>
								</Card>

								<Snackbar
									action={{
										label: "Close",
										icon: "close",
										onPress: () => setVisible(false),
									}}
									onDismiss={() => setVisible(false)}
									visible={visible}
								>
									<Text>Erro ao cadastrar treino</Text>
								</Snackbar>
								<Button
									disabled={assessmentMutation.isPending}
									loading={assessmentMutation.isPending}
									mode="contained"
									onPress={handleSubmit(onSubmit)}
								>
									Enviar
								</Button>
							</View>
						)}
					</>
				)}
				style={{ flex: 1 }}
			/>
		</>
	);
};

export default FormAssessments;

const FormAssessmentsSkeleton = () => {
	const renderFieldSkeleton = () => (
		<View style={{ marginBottom: 12 }}>
			<Skeleton style={{ marginTop: 24, height: 48 }} />
		</View>
	);

	const renderCardSkeleton = (title: string, fields = 3) => (
		<Card style={{ marginBottom: 16 }}>
			<Card.Title title={title} />
			<Card.Content>
				{[...Array(fields)].map((_, index) => (
					<View key={index}>{renderFieldSkeleton()}</View>
				))}
			</Card.Content>
		</Card>
	);

	return (
		<View style={{ padding: 20 }}>
			{renderCardSkeleton("Medidas Corporais", 3)}
			{renderCardSkeleton("Medidas de Circunferência", 4)}
			{renderCardSkeleton("Medidas de Braços", 2)}
			{renderCardSkeleton("Medidas das Pernas", 4)}
			{renderCardSkeleton("Massa Corporal", 2)}
			{renderCardSkeleton("Frequência Cardíaca", 2)}
			{renderCardSkeleton("Histórico Médico", 3)}
			{renderCardSkeleton("Equilíbrio, Mobilidade e Postura", 3)}
			{renderCardSkeleton("Objetivo", 1)}
			{renderCardSkeleton("Observação", 1)}

			<Skeleton style={{ marginTop: 24, height: 48, borderRadius: 26 }} />
		</View>
	);
};
