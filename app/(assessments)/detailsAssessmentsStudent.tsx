import { getAssessmentsByStudentIdAndAssessmentsId } from "@/api/assessments/assessments.api";
import InfoField from "@/components/InfoField";
import StudentCard from "@/components/StudentCard";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import {
	type NavigationProp,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import React from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { Appbar, Card, Chip, Divider, Text } from "react-native-paper";

export type RootStackParamList = {
	AssessmentsStudent: undefined;
	CreateAssessments: { assessmentsId?: string };
};

const DetailsAssessmentsStudent = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const { theme } = useTheme();
	const route = useRoute();

	const { assessmentsId } = route.params as {
		assessmentsId: string | undefined;
	};

	const { user } = useUser();

	const {
		data: assessmentsByStudent,
		refetch,
		isLoading,
		isFetching,
	} = useQuery({
		queryKey: [
			"getAssessmentsByStudentIdAndAssessmentsId",
			assessmentsId,
			user?.id,
		],
		queryFn: () =>
			getAssessmentsByStudentIdAndAssessmentsId(
				assessmentsId || "",
				user?.id || "",
			),
		enabled: Boolean(assessmentsId && user?.id), // ✅ só ativa quando os dois existem
	});

	return (
		<>
			<Appbar.Header>
				<Appbar.BackAction
					onPress={() => navigation.navigate("AssessmentsStudent")}
				/>
				<Appbar.Content title="Avaliação" />
			</Appbar.Header>
			<StudentCard>
				{assessmentsId && (
					<Text
						style={{ marginLeft: 16, color: theme.colors.outline }}
						variant="bodySmall"
					>
						ID: {assessmentsId}
					</Text>
				)}
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						gap: 12,
						alignItems: "center",
						marginLeft: 16,
						marginTop: 16,
					}}
				>
					<Ionicons color={theme.colors.primary} name={"calendar"} size={18} />
					{assessmentsByStudent?.createdAt ? (
						<Text>
							{format(
								new Date(assessmentsByStudent.createdAt),
								"dd 'de' MMMM 'de' yyyy",
								{
									locale: ptBR,
								},
							)}
						</Text>
					) : null}
				</View>
			</StudentCard>
			<ScrollView
				refreshControl={
					<RefreshControl
						onRefresh={refetch}
						refreshing={isLoading || isFetching}
					/>
				}
				style={{
					flex: 1,
					backgroundColor: theme.colors.background,
					padding: 16,
				}}
			>
				<View style={{ display: "flex", gap: 16 }}>
					<Card>
						<Card.Title title="Medidas Corporais" />
						<Card.Content style={{ gap: 10 }}>
							<InfoField
								description={`${assessmentsByStudent?.bodyMeasurements?.weight || "-"}${
									assessmentsByStudent?.bodyMeasurements?.weight ? " kg" : ""
								}`}
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
								title="Peso"
							/>
							<Divider />
							<InfoField
								description={`${assessmentsByStudent?.bodyMeasurements?.height || "-"}${
									assessmentsByStudent?.bodyMeasurements?.height ? " cm" : ""
								}`}
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
								title="Altura"
							/>
							<Divider />
							<InfoField
								description={`${assessmentsByStudent?.bodyMeasurements?.bodyFatPercentage || "-"}${
									assessmentsByStudent?.bodyMeasurements?.bodyFatPercentage
										? " %"
										: ""
								}`}
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
								title="% Gordura Corporal"
							/>
							<Divider />

							<Chip icon="information">
								{`${assessmentsByStudent?.bodyMeasurements?.imc} (IMC)`}
							</Chip>
						</Card.Content>
					</Card>

					<Card>
						<Card.Title title="Medidas de Circunferência" />
						<Card.Content style={{ gap: 10 }}>
							<InfoField
								description={`${assessmentsByStudent?.bodyMeasurements?.waistCircumference || "-"}${
									assessmentsByStudent?.bodyMeasurements?.waistCircumference
										? " cm"
										: ""
								}`}
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
								title="Cintura"
							/>
							<Divider />
							<InfoField
								description={`${assessmentsByStudent?.bodyMeasurements?.hipCircumference || "-"}${
									assessmentsByStudent?.bodyMeasurements?.hipCircumference
										? " cm"
										: ""
								}`}
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
								title="Quadril"
							/>
							<Divider />
							<InfoField
								description={`${assessmentsByStudent?.bodyMeasurements?.chestCircumference || "-"}${
									assessmentsByStudent?.bodyMeasurements?.chestCircumference
										? " cm"
										: ""
								}`}
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
								title="Peito"
							/>
							<Divider />
							<InfoField
								description={`${assessmentsByStudent?.bodyMeasurements?.neckCircumference || "-"}${
									assessmentsByStudent?.bodyMeasurements?.neckCircumference
										? " cm"
										: ""
								}`}
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
								title="Pescoço"
							/>
						</Card.Content>
					</Card>

					<Card>
						<Card.Title title="Medidas de Braços" />
						<Card.Content style={{ gap: 10 }}>
							<InfoField
								description={`${assessmentsByStudent?.bodyMeasurements?.rightArmCircumference || "-"}${
									assessmentsByStudent?.bodyMeasurements?.rightArmCircumference
										? " cm"
										: ""
								}`}
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
								title="Braço Direito"
							/>
							<Divider />
							<InfoField
								description={`${assessmentsByStudent?.bodyMeasurements?.leftArmCircumference || "-"}${
									assessmentsByStudent?.bodyMeasurements?.leftArmCircumference
										? " cm"
										: ""
								}`}
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
								title="Braço Esquerdo"
							/>
						</Card.Content>
					</Card>

					<Card>
						<Card.Title title="Medidas das Pernas" />
						<Card.Content style={{ gap: 10 }}>
							<InfoField
								description={`${assessmentsByStudent?.bodyMeasurements?.rightThighCircumference || "-"}${
									assessmentsByStudent?.bodyMeasurements
										?.rightThighCircumference
										? " cm"
										: ""
								}`}
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
								title="Coxa Direita"
							/>
							<Divider />
							<InfoField
								description={`${assessmentsByStudent?.bodyMeasurements?.leftThighCircumference || "-"}${
									assessmentsByStudent?.bodyMeasurements?.leftThighCircumference
										? " cm"
										: ""
								}`}
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
								title="Coxa Esquerda"
							/>
							<Divider />
							<InfoField
								description={`${assessmentsByStudent?.bodyMeasurements?.rightCalfCircumference || "-"}${
									assessmentsByStudent?.bodyMeasurements?.rightCalfCircumference
										? " cm"
										: ""
								}`}
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
								title="Panturrilha Direita"
							/>
							<Divider />
							<InfoField
								description={`${assessmentsByStudent?.bodyMeasurements?.leftCalfCircumference || "-"}${
									assessmentsByStudent?.bodyMeasurements?.leftCalfCircumference
										? " cm"
										: ""
								}`}
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
								title="Panturrilha Esquerda"
							/>
						</Card.Content>
					</Card>

					<Card>
						<Card.Title title="Massa Corporal" />
						<Card.Content style={{ gap: 10 }}>
							<InfoField
								description={`${assessmentsByStudent?.bodyMass?.muscleMass || "-"}${
									assessmentsByStudent?.bodyMass?.muscleMass ? " kg" : ""
								}`}
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
								title="Massa Muscular"
							/>
							<Divider />
							<InfoField
								description={`${assessmentsByStudent?.bodyMass?.boneMass || "-"}${
									assessmentsByStudent?.bodyMass?.boneMass ? " kg" : ""
								}`}
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
								title="Massa Óssea"
							/>
						</Card.Content>
					</Card>

					<Card>
						<Card.Title title="Frequência Cardíaca" />
						<Card.Content style={{ gap: 10 }}>
							<InfoField
								description={`${assessmentsByStudent?.heartRate?.restingHeartRate || "-"}${
									assessmentsByStudent?.heartRate?.restingHeartRate
										? " bpm"
										: ""
								}`}
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
								title="Em repouso"
							/>
							<Divider />
							<InfoField
								description={`${assessmentsByStudent?.heartRate?.maxHeartRate || "-"}${
									assessmentsByStudent?.heartRate?.maxHeartRate ? " bpm" : ""
								}`}
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
								title="Máxima"
							/>
						</Card.Content>
					</Card>

					<Card>
						<Card.Title title="Histórico Médico" />
						<Card.Content style={{ gap: 10 }}>
							<InfoField
								description={
									assessmentsByStudent?.medicalHistory?.injuryHistory ||
									"Não informado."
								}
								title="Lesões Anteriores"
							/>
							<Divider />
							<InfoField
								description={
									assessmentsByStudent?.medicalHistory?.medicalConditions ||
									"Não informado."
								}
								title="Condições Médicas"
							/>
							<Divider />
							<InfoField
								description={
									assessmentsByStudent?.medicalHistory?.chronicPain ||
									"Não informado."
								}
								title="Dores Crônicas"
							/>
						</Card.Content>
					</Card>
					<Card>
						<Card.Title title="Equilíbrio, Mobilidade e Postura" />
						<Card.Content style={{ gap: 10 }}>
							<InfoField
								description={
									assessmentsByStudent?.balanceAndMobility?.balanceTest ||
									"Não informado."
								}
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
								title="Teste de Equilíbrio"
							/>
							<Divider />
							<InfoField
								description={
									assessmentsByStudent?.balanceAndMobility?.mobilityTest ||
									"Não informado."
								}
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
								title="Teste de Mobilidade"
							/>
							<Divider />
							<InfoField
								description={
									assessmentsByStudent?.posture?.postureAssessment ||
									"Não informado."
								}
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
								title="Teste de Postura"
							/>
						</Card.Content>
					</Card>

					<Card>
						<Card.Title title="Objetivo" />
						<Card.Content style={{ gap: 10 }}>
							<Text>
								{assessmentsByStudent?.fitnessGoals
									? assessmentsByStudent?.fitnessGoals
									: "Nenhuma objetivo registrado."}
							</Text>
						</Card.Content>
					</Card>

					<Card>
						<Card.Title title="Observação" />
						<Card.Content style={{ gap: 10 }}>
							<Text>
								{assessmentsByStudent?.observations
									? assessmentsByStudent?.observations
									: "Nenhuma observação registrada"}
							</Text>
						</Card.Content>
					</Card>
				</View>
			</ScrollView>
		</>
	);
};

export default DetailsAssessmentsStudent;
