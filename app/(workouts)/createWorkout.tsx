import { getReviewById } from "@/api/reviews/reviews.api";
import CardReview from "@/components/CardReview";
import CustomModal from "@/components/CustomModal";
import FilterInput from "@/components/FilterInput";
import FormWorkout from "@/components/FormWorkout/FormWorkout";
import SelectStudent from "@/components/SelectStudent";
import Skeleton from "@/components/Skeleton";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { WorkoutFormProvider } from "@/context/WorkoutFormContext";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { View } from "react-native";
import { Appbar, Button, Text } from "react-native-paper";
import { useStudent } from "../../context/StudentContext";

type CreateWorkoutProps = {
	route: {
		params?: {
			workoutId?: string;
			studentId?: string;
		};
	};
};

const CreateWorkout = ({ route }: CreateWorkoutProps) => {
	const navigation = useNavigation();
	const { user } = useUser();
	const { refetchStudent, isLoading, student } = useStudent();
	const [params, setParams] = useState("");
	const { workoutId, studentId } = route.params || {};
	const [newStudent, setNewStudent] = useState(!studentId);
	const { theme } = useTheme();

	const { data: review } = useQuery({
		queryKey: ["getReviewById", user?.id, workoutId],
		queryFn: () =>
			getReviewById(user?.id || "", workoutId || "", studentId || ""),
		enabled: !!user?.id && !!workoutId && !!studentId,
	});

	const renderStudentSelection = () => (
		<>
			<View
				style={{
					flex: 1,
					backgroundColor: theme.colors.background,
				}}
			>
				<View style={{ marginHorizontal: 12, marginTop: 24 }}>
					<Text variant="titleMedium">Escolha um aluno(a)</Text>
					<FilterInput onChange={setParams} placeholder="Pesquisar aluno(a)" />

					<SelectStudent
						filterName={params}
						onSelect={(student) => refetchStudent(student.studentId)}
						teacherId={user?.id || ""}
					/>
				</View>
			</View>
			<View
				style={{
					padding: 16,
					backgroundColor: theme.colors.background,
				}}
			>
				<Button
					disabled={student?.permission !== "STUDENT"}
					mode="contained"
					style={{ marginTop: 16 }}
					onPress={() => setNewStudent(false)}
				>
					Continuar
				</Button>
			</View>
		</>
	);

	const renderWorkoutForm = () => {
		if (isLoading) {
			return (
				<View style={{ alignItems: "center", gap: 16, marginTop: 16 }}>
					<Skeleton style={{ width: "90%", height: 50, borderRadius: 20 }} />
					<Skeleton style={{ width: "90%", height: 50, borderRadius: 20 }} />
					<Skeleton style={{ width: "90%", height: 150, borderRadius: 20 }} />
					<Skeleton style={{ width: "90%", height: 50, borderRadius: 20 }} />
				</View>
			);
		}

		return (
			<WorkoutFormProvider>
				<FormWorkout workoutId={workoutId} />
			</WorkoutFormProvider>
		);
	};

	return (
		<>
			<Appbar.Header mode="small">
				<Appbar.BackAction
					onPress={() => navigation.navigate("Workouts" as never)}
				/>
				<Appbar.Content title="Cadastrar treino" />
				{review?.review && (
					<CustomModal
						cancelButtonLabel="Fechar"
						onPress={() => {}}
						showPrimaryButton={false}
						title="Avaliação do treino"
						trigger={
							<Button icon="star" mode="elevated">
								Ver avaliação
							</Button>
						}
					>
						<CardReview
							navigation={navigation}
							reviewData={review}
							showButtonWorkout={false}
						/>
					</CustomModal>
				)}
			</Appbar.Header>

			<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
				{newStudent ? renderStudentSelection() : renderWorkoutForm()}
			</View>
		</>
	);
};

export default CreateWorkout;
