import {
	deleteAssessmentsByStudentId,
	getAssessmentsByStudentId,
} from "@/api/assessments/assessments.api";
import { duplicateWorkout } from "@/api/workout/workout.api";
import CustomModal from "@/components/CustomModal";
import EmptyState from "@/components/EmptyState";
import Skeleton from "@/components/Skeleton";
import StudentCard from "@/components/StudentCard";
import { useSnackbar } from "@/context/SnackbarContext";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { type NavigationProp, useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { Appbar, Button, Card, Chip, IconButton } from "react-native-paper";
import { useStudent } from "../../context/StudentContext";

export type RootStackParamList = {
	Assessments: undefined;
	CreateAssessments: { assessmentsId?: string; studentId?: string };
};

type DetailsAssessmentsProps = {
	route: {
		params?: {
			studentId?: string;
		};
	};
};

const DetailsAssessments = ({ route }: DetailsAssessmentsProps) => {
	const { student, refetchStudent } = useStudent();
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const [isLoadingButton, setIsLoadingButton] = useState(false);
	const { theme } = useTheme();

	const { user } = useUser();
	const { studentId } = route.params || {};
	const { showSnackbar } = useSnackbar();

	const activeStudentId = useMemo(() => {
		return studentId ?? student?.id ?? "";
	}, [studentId, student?.id]);

	useEffect(() => {
		if (studentId) {
			refetchStudent(activeStudentId);
		}
	}, [activeStudentId]);

	const {
		data: assessmentsStudent,
		isLoading,
		refetch,
		isFetching,
	} = useQuery({
		queryKey: ["getAssessmentsByStudentId", student?.id],
		queryFn: () => getAssessmentsByStudentId(student?.id || ""),
		enabled: !!student?.id,
	});

	const handleDelete = async (assessmentsId: string) => {
		try {
			await deleteAssessmentsByStudentId(
				assessmentsId,
				student?.id || "",
				user?.id || "",
			);
			refetch();
		} catch (error) {
			showSnackbar("Erro ao criar exercício", "error");
		}
	};

	const handleDuplicate = async (workoutId: string) => {
		setIsLoadingButton(true);
		try {
			await duplicateWorkout(workoutId, student?.id || "", user?.id || "");
			refetch();
		} catch (error) {
			console.error("Erro ao criar avaliação:", error);
		} finally {
			setIsLoadingButton(false);
		}
	};
	return (
		<>
			<>
				<Appbar.Header mode="small">
					<Appbar.BackAction
						onPress={() => navigation.navigate("Assessments")}
					/>
					<Appbar.Content title="Avaliação" />
					<Button
						icon="plus"
						mode="contained"
						onPress={() =>
							navigation.navigate("CreateAssessments", {
								studentId: activeStudentId,
							})
						}
					>
						Nova Avaliação
					</Button>
				</Appbar.Header>
				<StudentCard />
			</>
			<FlatList
				contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
				data={assessmentsStudent}
				keyExtractor={(item) => String(item.id)}
				ListEmptyComponent={
					isLoading || isFetching ? (
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
						<EmptyState onRetry={() => refetch()} />
					)
				}
				onRefresh={refetch}
				refreshing={isLoading || isFetching}
				renderItem={({ item }) => (
					<>
						{isLoading ? (
							<Skeleton
								style={{ width: "90%", height: 50, borderRadius: 20 }}
							/>
						) : (
							<Card style={{ marginHorizontal: 20, marginVertical: 10 }}>
								<Card.Title
									right={(props) => (
										<IconButton
											{...props}
											icon="arrow-right"
											onPress={() => {
												navigation.navigate("CreateAssessments", {
													assessmentsId: item.id,
													studentId: activeStudentId,
												});
											}}
										/>
									)}
									subtitle={`ID ${item.id}`}
									subtitleStyle={{ fontSize: 12, color: "gray" }}
									title="Avaliação"
									titleStyle={{ fontSize: 18, fontWeight: "bold" }}
								/>
								<Card.Content
									style={{
										display: "flex",
										justifyContent: "space-between",
										flexDirection: "row",
										alignItems: "center",
									}}
								>
									<Chip icon="calendar">
										{format(item?.createdAt, "dd/MM/yyyy")}
									</Chip>

									<CustomModal
										onPress={() => handleDelete(item.id)}
										primaryButtonLabel="Deletar"
										title="Tem certeza que deseja deletar a avaliação?"
									/>
								</Card.Content>
							</Card>
						)}
					</>
				)}
				style={{ flex: 1, backgroundColor: theme.colors.background }}
			/>
		</>
	);
};

export default DetailsAssessments;
