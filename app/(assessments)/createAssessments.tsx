import FilterInput from "@/components/FilterInput";
import FormAssessments from "@/components/FormAssessments";
import SelectStudent from "@/components/SelectStudent";
import StudentCard from "@/components/StudentCard";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Appbar, Button, Text } from "react-native-paper";
import { useStudent } from "../../context/StudentContext";
export type RootStackParamList = {
	Workouts: undefined;
	CreateWorkout: { workoutId?: string; studentId?: string };
};

type CreateAssessmentsProps = {
	route: {
		params?: {
			assessmentsId?: string;
			studentId?: string;
		};
	};
};

const CreateAssessments = ({ route }: CreateAssessmentsProps) => {
	const navigation = useNavigation();
	const { user } = useUser();
	const { refetchStudent, student, resetStudent } = useStudent();
	const [params, setParams] = useState("");
	const { assessmentsId, studentId } = route.params || {};
	const [newStudent, setNewStudent] = useState(!studentId);
	const { theme } = useTheme();

	useEffect(() => {
		studentId && refetchStudent(studentId);
	}, [studentId]);

	return (
		<>
			<Appbar.Header>
				<Appbar.BackAction
					onPress={() => {
						navigation.navigate("Assessments" as never), resetStudent();
					}}
				/>
				<Appbar.Content title="Cadastrar avaliação" />
			</Appbar.Header>

			{student?.id !== user?.id && <StudentCard />}

			{newStudent ? (
				<>
					<View
						style={{
							flex: 1,
							backgroundColor: theme.colors.background,
						}}
					>
						<View style={{ marginHorizontal: 12, marginTop: 24 }}>
							<Text variant="titleMedium">Escolha um aluno(a)</Text>
							<FilterInput
								onChange={setParams}
								placeholder="Pesquisar aluno(a)"
							/>

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
							mode="contained"
							onPress={() => setNewStudent(false)}
							disabled={user?.id === student?.id}
						>
							Continuar
						</Button>
					</View>
				</>
			) : (
				<FormAssessments assessmentsId={assessmentsId} />
			)}
		</>
	);
};

export default CreateAssessments;
