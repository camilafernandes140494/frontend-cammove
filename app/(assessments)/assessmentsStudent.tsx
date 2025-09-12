import { getAssessmentsByStudentId } from "@/api/assessments/assessments.api";
import EmptyState from "@/components/EmptyState";
import Skeleton from "@/components/Skeleton";
import TermsCard from "@/components/TermsCard";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import React from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Appbar, Card, Chip, IconButton } from "react-native-paper";

const AssessmentsStudent = ({ navigation }: any) => {
	const { user } = useUser();
	const { theme } = useTheme();

	const {
		data: assessmentsSummary,
		isLoading,
		isFetching,
		refetch,
	} = useQuery({
		queryKey: ["getAssessmentsByStudentId", user?.id],
		queryFn: () => getAssessmentsByStudentId(user?.id || ""),
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
				<Appbar.Content title="Minhas avaliações" />
			</Appbar.Header>
			<FlatList
				data={assessmentsSummary}
				keyExtractor={(item) => `${item.id}`}
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
					) : (
						<EmptyState
							message="Nenhuma avaliação encontrada."
							onRetry={() => refetch()}
						/>
					)
				}
				onRefresh={refetch}
				refreshing={isLoading || isFetching}
				renderItem={({ item }) => (
					<>
						{isLoading ? (
							<ActivityIndicator
								animating={true}
								size="large"
								style={{ marginTop: 16 }}
							/>
						) : (
							<Card
								style={{
									marginHorizontal: 16,
									borderRadius: 12,
									elevation: 5,
									marginTop: 16,
								}}
							>
								<Card.Title
									right={(props) => (
										<IconButton
											{...props}
											icon="chevron-right"
											onPress={() => {
												navigation.navigate("DetailsAssessmentsStudent", {
													assessmentsId: item.id,
												});
											}}
										/>
									)}
									subtitle={`ID ${item.id}`}
									subtitleStyle={{ fontSize: 12, color: "gray" }}
									title="Avaliação física"
									titleStyle={{ fontSize: 18, fontWeight: "bold" }}
								/>
								<Card.Content>
									<Chip
										disabled
										icon={() => (
											<Ionicons
												color={theme.colors.primary}
												name={"calendar"}
												size={18}
												style={{ marginRight: 4 }}
											/>
										)}
										style={{
											backgroundColor: theme.colors.primaryContainer,
											alignSelf: "flex-start",
										}}
										textStyle={{
											color: theme.colors.primary,
										}}
									>
										{format(
											new Date(item.createdAt),
											"dd 'de' MMMM 'de' yyyy",
											{ locale: ptBR },
										)}
									</Chip>
								</Card.Content>
							</Card>
						)}
					</>
				)}
			/>
		</View>
	);
};

export default AssessmentsStudent;
