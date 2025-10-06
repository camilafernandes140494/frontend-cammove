import { getWorkoutsSummary } from "@/api/workout/workout.api";
import type { getWorkoutsSummaryResponse } from "@/api/workout/workout.types";
import {
	checkDateStatus,
	type DateStatus,
	getNextMonth,
} from "@/common/common";
import CustomChip from "@/components/CustomChip";
import EmptyState from "@/components/EmptyState";
import FilterInput from "@/components/FilterInput";
import SelectStudent from "@/components/SelectStudent";
import Skeleton from "@/components/Skeleton";
import TermsCard from "@/components/TermsCard";
import { useStudent } from "@/context/StudentContext";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import {
	Appbar,
	Button,
	Card,
	Chip,
	IconButton,
	SegmentedButtons,
	Text,
} from "react-native-paper";

const Workouts = ({ navigation }: any) => {
	const [params, setParams] = useState<{ name: string }>();
	const [workoutsSummaryFilter, setWorkoutsSummaryFilter] =
		useState<getWorkoutsSummaryResponse[]>();
	const [dateStatus, setDateStatus] = useState<DateStatus>("INVALID_DATE");
	const [value, setValue] = useState("workouts");
	const { user } = useUser();
	const { theme } = useTheme();
	const { resetStudent } = useStudent();

	const {
		data: workoutsSummary,
		isLoading,
		isFetching,
		refetch,
	} = useQuery({
		queryKey: ["getRelationship", params],
		queryFn: () => getWorkoutsSummary(user?.id!, params),
		enabled: !!user?.id,
	});

	useEffect(() => {
		if (!workoutsSummary) return;
		let filteredData = workoutsSummary;

		if (params?.name) {
			filteredData = filteredData.filter((workout) =>
				workout.studentName.toLowerCase().includes(params.name.toLowerCase()),
			);
		}

		switch (dateStatus) {
			case "PAST":
				filteredData = filteredData.filter(
					(workout) => checkDateStatus(workout.expireAt) === "PAST",
				);
				break;
			case "UPCOMING":
				filteredData = filteredData.filter(
					(workout) => checkDateStatus(workout.expireAt) === "UPCOMING",
				);
				break;
			case "FUTURE":
				filteredData = filteredData.filter(
					(workout) => checkDateStatus(workout.expireAt) === "FUTURE",
				);
				break;
		}

		setWorkoutsSummaryFilter(filteredData);
	}, [workoutsSummary, params, dateStatus]);

	const LoadingSkeleton = () => (
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
	);

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
				<Appbar.Content title="Treinos" />
				<Button
					icon="plus"
					mode="contained"
					onPress={() => {
						resetStudent(),
							navigation.navigate("CreateWorkout", { workoutId: undefined });
					}}
				>
					Novo treino
				</Button>
			</Appbar.Header>

			<View style={{ padding: 16 }}>
				<SegmentedButtons
					value={value}
					onValueChange={setValue}
					buttons={[
						{ value: "workouts", label: "Treinos", icon: "dumbbell" },
						{ value: "students", label: "Alunos", icon: "account-group" },
					]}
				/>

				{value === "workouts" && (
					<View
						style={{
							flexDirection: "row",
							flexWrap: "wrap",
							padding: 10,
							gap: 10,
						}}
					>
						<CustomChip
							color="primary"
							label="Expirado"
							icon="alert-circle-outline"
							onSelect={(selected) =>
								setDateStatus(selected ? "PAST" : "INVALID_DATE")
							}
						/>
						<CustomChip
							color="error"
							label="Prestes a Expirar"
							icon="clock-alert-outline"
							onSelect={(selected) =>
								setDateStatus(selected ? "UPCOMING" : "INVALID_DATE")
							}
						/>
						<CustomChip
							color="tertiary"
							label="Em dia"
							icon="check-circle-outline"
							onSelect={(selected) =>
								setDateStatus(selected ? "FUTURE" : "INVALID_DATE")
							}
						/>
					</View>
				)}

				<FilterInput
					placeholder="Pesquisar aluno(a)"
					onChange={(value) => setParams({ name: value })}
				/>

				{workoutsSummaryFilter?.length === 0 && value === "workouts" && (
					<Text
						variant="titleSmall"
						style={{ marginTop: 16, textAlign: "center" }}
					>
						Nenhum dado encontrado
					</Text>
				)}

				{value === "students" && (
					<SelectStudent
						teacherId={user?.id!}
						onSelect={(student) => {
							navigation.navigate("DetailsWorkout", {
								studentId: student.studentId,
							});
						}}
						filterName={params?.name}
					/>
				)}
			</View>
			<FlatList
				data={value === "students" ? [] : workoutsSummaryFilter}
				keyExtractor={(item) => `${item.studentName}-${item.id}`}
				keyboardShouldPersistTaps="handled"
				refreshing={isLoading || isFetching}
				onRefresh={refetch}
				inverted
				ListEmptyComponent={
					!isLoading && !isFetching && value === "workouts" ? (
						<EmptyState message="Nenhum treino encontrado." onRetry={refetch} />
					) : (
						<View />
					)
				}
				ListFooterComponent={
					(isLoading || isFetching) && value === "workouts" ? (
						<LoadingSkeleton />
					) : (
						<View />
					)
				}
				renderItem={({ item }) => (
					<>
						{value === "workouts" && (
							<Card
								style={{
									marginHorizontal: 16,
									borderRadius: 12,
									elevation: 5,
									marginBottom: 16,
								}}
							>
								<Card.Title
									title={item?.studentName || ""}
									subtitle={item?.nameWorkout || ""}
									right={(props) => (
										<IconButton
											{...props}
											icon="chevron-right"
											size={24}
											onPress={() => {
												navigation.navigate("CreateWorkout", {
													workoutId: item?.workoutId || "",
													studentId: item?.studentId || "",
												});
											}}
										/>
									)}
									titleStyle={{ fontSize: 18, fontWeight: "bold" }}
									subtitleStyle={{ fontSize: 12, color: "gray" }}
								/>

								<Card.Content style={{ paddingVertical: 12 }}>
									{/* Infos em linha */}
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
											marginBottom: 16,
										}}
									>
										<View>
											<Text style={{ fontSize: 12, color: "gray" }}>
												Criado em
											</Text>
											<Text>
												{format(item?.createdAt, "dd/MM/yyyy - HH:mm")}
											</Text>
										</View>
										<View>
											<Text style={{ fontSize: 12, color: "gray" }}>
												Próxima atualização
											</Text>
											<Text
												style={{
													fontSize: 14,
													color: theme.colors.primary,
													fontWeight: "600",
												}}
											>
												{getNextMonth(item?.createdAt || "")}
											</Text>
										</View>
									</View>

									{/* Chip destacado no fim */}
									<Chip style={{ alignSelf: "flex-start" }}>
										{item?.workoutType || ""}
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

export default Workouts;
