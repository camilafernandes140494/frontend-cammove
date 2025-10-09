import { getAssessmentsSummary } from "@/api/assessments/assessments.api";
import { formatDate, getNextMonth } from "@/common/common";
import EmptyState from "@/components/EmptyState";
import FilterInput from "@/components/FilterInput";
import SelectStudent from "@/components/SelectStudent";
import Skeleton from "@/components/Skeleton";
import TermsCard from "@/components/TermsCard";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FlatList, View } from "react-native";
import {
	Appbar,
	Button,
	Card,
	IconButton,
	SegmentedButtons,
	Text,
} from "react-native-paper";

const Assessments = ({ navigation }: any) => {
	const [params, setParams] = useState<{ name: string }>({ name: "" });
	const { user } = useUser();
	const [value, setValue] = useState("assessments");
	const { theme } = useTheme();

	const {
		data: assessmentsSummary,
		isLoading,
		isFetching,
		refetch,
	} = useQuery({
		queryKey: ["getAssessmentsSummary", params],
		queryFn: () => getAssessmentsSummary(user?.id!, params),
		enabled: !!user?.id,
	});

	if (!user?.termsOfUse) {
		return (
			<View
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flex: 1,
					marginHorizontal: 16,
				}}
			>
				<TermsCard />
			</View>
		);
	}
	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
			<Appbar.Header mode="small">
				<Appbar.Content title="Avaliação" />
				<Button
					icon="plus"
					mode="contained"
					onPress={() =>
						navigation.navigate("CreateAssessments", { workoutId: undefined })
					}
				>
					Nova Avaliação
				</Button>
			</Appbar.Header>
			<View style={{ padding: 16 }}>
				<SegmentedButtons
					buttons={[
						{
							value: "assessments",
							label: "Avaliações",
							icon: "chart-bar",
						},
						{ value: "students", label: "Alunos", icon: "account-group" },
					]}
					onValueChange={setValue}
					value={value}
				/>
				<FilterInput
					onChange={(value) => setParams({ name: value })}
					placeholder="Pesquisar aluno(a)"
				/>

				{value === "students" && (
					<SelectStudent
						filterName={params?.name}
						onSelect={(student) => {
							navigation.navigate("DetailsAssessments", {
								studentId: student.studentId,
							});
						}}
						teacherId={user?.id!}
					/>
				)}
			</View>
			<FlatList
				data={
					value === "students" ? [] : [...(assessmentsSummary ?? [])].reverse()
				}
				keyExtractor={(item) => `${item.studentName}-${item.id}`}
				ListEmptyComponent={
					isLoading ? (
						<View>
							{Array.from({ length: 5 }).map((_, index) => (
								<Skeleton
									key={index}
									style={{
										width: "90%",
										height: 60,
										borderRadius: 4,
										marginVertical: 8,
										alignSelf: "center",
									}}
								/>
							))}
						</View>
					) : value === "assessments" ? (
						<EmptyState
							message="Nenhuma avaliação encontrada."
							onRetry={() => refetch()}
						/>
					) : (
						<View />
					)
				}
				onRefresh={refetch}
				refreshing={isLoading || isFetching}
				renderItem={({ item }) => (
					<>
						{value === "assessments" && (
							<Card
								style={{
									marginHorizontal: 16,
									borderRadius: 12,
									elevation: 5,
									marginBottom: 16,
								}}
							>
								<Card.Title
									right={(props) => (
										<IconButton
											{...props}
											icon="chevron-right"
											onPress={() => {
												navigation.navigate("CreateAssessments", {
													assessmentsId: item.assessmentsId,
													studentId: item.studentId,
												});
											}}
											size={24}
										/>
									)}
									subtitle={`Criado em: ${formatDate(item.createdAt, "datetime")}`}
									subtitleStyle={{ fontSize: 12, color: "gray" }}
									title={item.studentName}
									titleStyle={{ fontSize: 18, fontWeight: "bold" }}
								/>
								<Card.Content style={{ paddingVertical: 16 }}>
									<Text
										style={{ fontSize: 14, marginBottom: 8 }}
										variant="bodyMedium"
									>
										Próxima atualização
									</Text>
									<Text
										style={{
											fontSize: 16,
											color: theme.colors.primary,
											fontWeight: "500",
											marginBottom: 20,
										}}
										variant="bodySmall"
									>
										{getNextMonth(item.createdAt)}
									</Text>
								</Card.Content>
							</Card>
						)}
					</>
				)}
			/>
		</View>
	);
};

export default Assessments;
