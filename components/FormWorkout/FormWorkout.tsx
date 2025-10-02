/** biome-ignore-all lint/suspicious/noConsole: <explanation> 1213*/

import {
	getNotifications,
	sendNotification,
	sendNotificationsData,
	updateNotificationsData,
} from "@/api/notifications/notifications.api";
import {
	getWorkoutByStudentIdAndWorkoutId,
	patchWorkout,
	postWorkout,
} from "@/api/workout/workout.api";
import type { ExerciseWorkout } from "@/api/workout/workout.types";
import { useStudent } from "@/context/StudentContext";
import { useUser } from "@/context/UserContext";
import { useWorkoutForm } from "@/context/WorkoutFormContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FlatList, View } from "react-native";
import { Button, Icon, ProgressBar, Text } from "react-native-paper";
import * as z from "zod";
import StudentCard from "../StudentCard";
import StepChooseType from "./steps/StepChooseType";
import StepExerciseIA from "./steps/StepExerciseIA";
import StepManualExercise from "./steps/StepManualExercise";
import StepReviewAndSubmit from "./steps/StepReviewAndSubmit";
import StepTrainingData from "./steps/StepTrainingData";

interface FormWorkoutProps {
	workoutId?: string;
}
const FormWorkout = ({ workoutId }: FormWorkoutProps) => {
	const [visible, setVisible] = useState(false);
	const { student } = useStudent();
	const { user } = useUser();
	const navigation = useNavigation();
	const isFocused = useIsFocused();

	const { data } = useQuery({
		queryKey: ["getNotifications", student?.id],
		queryFn: () => getNotifications(student?.id || ""),
		enabled: !!student?.id,
	});

	const { step, nextStep, prevStep, goToStep, isGeneratedByIA } =
		useWorkoutForm();

	useEffect(() => {
		!!workoutId && goToStep(4);
	}, [workoutId]);

	const { data: workoutByStudent } = useQuery({
		queryKey: ["getWorkoutByStudentIdAndWorkoutId", workoutId, student?.id],
		queryFn: () =>
			getWorkoutByStudentIdAndWorkoutId(workoutId || "", student?.id || ""),
		enabled:
			isFocused && !!workoutId && !!student?.id && student.id !== user?.id,
	});

	const [exercisesList, setExercisesList] = useState<ExerciseWorkout[]>([]);

	useEffect(() => {
		if (workoutByStudent?.exercises) {
			setExercisesList(workoutByStudent?.exercises);
		}
	}, [workoutByStudent]);

	const schema = z.object({
		type: z
			.object({
				label: z.string(),
				value: z.string(),
			})
			.optional()
			.refine((value) => value !== undefined, {
				message: "Adicione um objetivo ao treino",
			}),
		customType: z.string(),
		nameWorkout: z.string(),
		level: z.string().optional(),
		muscleGroup: z.array(z.string()).optional(),
		amountExercises: z.number().optional().default(4),
	});

	const { control, handleSubmit, watch, reset } = useForm<
		z.infer<typeof schema>
	>({
		resolver: zodResolver(schema),
		defaultValues: {
			type: workoutByStudent?.type
				? {
						label: workoutByStudent?.type || "",
						value: workoutByStudent?.type || "",
					}
				: {},
			customType: workoutByStudent?.type || "",
			nameWorkout: workoutByStudent?.nameWorkout || "",
			level: workoutByStudent?.level || "iniciante",
			muscleGroup: workoutByStudent?.muscleGroup || [],
			amountExercises: 4,
		},
	});

	useEffect(() => {
		if (workoutByStudent) {
			reset({
				type: workoutByStudent?.type
					? { label: workoutByStudent.type, value: workoutByStudent.type }
					: undefined,
				customType: workoutByStudent?.type || "",
				nameWorkout: workoutByStudent?.nameWorkout || "",
				level: workoutByStudent?.level || "iniciante",
				muscleGroup: workoutByStudent?.muscleGroup || [],
				amountExercises: 4,
			});
		}
	}, [workoutByStudent, reset]);

	const selectedType = watch("type");

	const mutation = useMutation({
		mutationFn: async (data: { workoutId?: string; workoutData: any }) => {
			const { workoutId, workoutData } = data;
			if (workoutId) {
				return await patchWorkout(
					workoutId,
					user?.id || "",
					student?.id || "",
					workoutData,
				);
			}
			return await postWorkout(user?.id || "", student?.id || "", workoutData);
		},
		onSuccess: async () => {
			await sendNotification({
				title: "💪 Treino liberado!",
				message:
					"Está na hora de se mexer! Confira seu novo treino e arrase! 🚀",
				token: [student?.deviceToken || ""],
			});
			const responseNotifications = await getNotifications(student?.id || "");
			const getIdNotifications = Array.isArray(responseNotifications)
				? responseNotifications
				: [];

			if (getIdNotifications.length === 0) {
				await sendNotificationsData(student?.id || "", {
					assessments: data?.[0]?.assessments || false,
					workout: true,
					schedule: data?.[0].schedule || false,
					reviews: data?.[0].reviews || false,
				});
			} else {
				await updateNotificationsData(
					student?.id || "",
					getIdNotifications[0].id || "",
					{
						assessments: data?.[0]?.assessments || false,
						workout: true,
						schedule: data?.[0].schedule || false,
						reviews: data?.[0].reviews || false,
					},
				);
			}

			navigation.navigate("Workouts" as never);
		},
		onError: () => {
			setVisible(true);
		},
	});

	const onSubmit = async (data: any) => {
		const typeData = data.type ? data.type.label : data.customType;

		const workoutData = {
			type: typeData as string,
			exercises: exercisesList,
			studentId: student?.id || "",
			studentName: student?.name || "",
			nameWorkout: data.nameWorkout || "Treino ",
			level: data.level || "iniciante",
			muscleGroup: data.muscleGroup || [],
		};

		mutation.mutate({ workoutId, workoutData });
	};

	const removeExercise = (name: string) => {
		setExercisesList((prevList) =>
			prevList.filter((exercise) => exercise.exerciseId.name !== name),
		);
	};

	const updateExerciseList = (
		exercise: ExerciseWorkout,
		matchBy: "id" | "name" = "id",
	) => {
		setExercisesList((prevList) => {
			const index = prevList.findIndex(
				(ex) => ex.exerciseId[matchBy] === exercise.exerciseId[matchBy],
			);

			if (index !== -1) {
				const updatedList = [...prevList];
				updatedList[index] = exercise;
				return updatedList;
			}

			return [...prevList, exercise];
		});
	};

	const nameWorkout = watch("nameWorkout");
	const type = watch("type");
	const customType = watch("customType");

	const isStepValid = () => {
		if (step === 1) {
			if (type?.value === "Personalizado") {
				return nameWorkout?.trim() !== "" && customType?.trim() !== "";
			}

			return (
				nameWorkout?.trim() !== "" &&
				type?.value !== undefined &&
				type?.value.trim() !== ""
			);
		}

		return true;
	};

	const stepItems = [
		{ label: "Informe os dados do treino", icon: "clipboard-text" },
		{ label: "Escolha como montar o treino", icon: "tune" },
		{ label: "Selecionar os exercícios", icon: "dumbbell" },
		{ label: "Validar exercícios", icon: "dumbbell" },
		{ label: "Revisar e enviar", icon: "check-circle-outline" },
	];

	const handleNext = () => {
		if (isGeneratedByIA) {
			// Fluxo IA
			if (step === 2) return goToStep(4);
		} else {
			// Fluxo Manual
			if (step === 3) return goToStep(5);
		}
		if (step === 5) {
			handleSubmit(onSubmit)();
			return;
		}
		nextStep();
	};

	const handlePrev = () => {
		if (isGeneratedByIA) {
			if (step === 4) {
				setExercisesList([]);
				return goToStep(2);
			}
		} else if (step === 5) {
			return goToStep(3);
		} else if (step === 3) {
			setExercisesList([]);
		}

		prevStep();
	};

	return (
		<>
			<StudentCard />

			<FlatList
				contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
				data={[{}]}
				keyboardShouldPersistTaps="handled"
				keyExtractor={() => "FormWorkout"}
				renderItem={() => (
					<>
						<View style={{ padding: 20 }}>
							<ProgressBar progress={step / 5} />
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									gap: 8,
									marginVertical: 8,
								}}
							>
								<Icon size={20} source={stepItems[step - 1].icon ?? ""} />
								<Text variant="titleMedium">
									{stepItems[step - 1].label ?? ""}
								</Text>
							</View>
							<View style={{ marginVertical: 20 }}>
								{step === 1 && (
									<StepTrainingData
										control={control}
										selectedType={selectedType.value}
									/>
								)}

								{step === 2 && <StepChooseType />}

								{step === 3 && (
									<StepManualExercise
										exercisesList={exercisesList}
										removeExercise={removeExercise}
										setExercisesList={setExercisesList}
										updateExerciseList={updateExerciseList}
									/>
								)}
								{step === 4 && (
									<StepExerciseIA
										control={control}
										exercisesList={exercisesList}
										removeExercise={removeExercise}
										setExercisesList={setExercisesList}
										updateExerciseList={(exerciseData) =>
											updateExerciseList(exerciseData, "name")
										}
									/>
								)}
								{step === 5 && (
									<StepReviewAndSubmit
										control={control}
										exercisesList={exercisesList}
										removeExercise={removeExercise}
										setExercisesList={setExercisesList}
										updateExerciseList={(exerciseData) =>
											updateExerciseList(
												exerciseData,
												isGeneratedByIA ? "name" : "id",
											)
										}
									/>
								)}
								<Button
									disabled={step === 1}
									mode="outlined"
									onPress={handlePrev}
									style={{ marginTop: 16 }}
								>
									Voltar
								</Button>
								<Button
									disabled={!isStepValid() || mutation?.isPending}
									loading={mutation?.isPending}
									mode="contained"
									onPress={handleNext}
									style={{ marginTop: 16 }}
								>
									{step === 5 ? "Enviar" : "Próximo"}
								</Button>
							</View>
						</View>
					</>
				)}
				style={{ flex: 1 }}
			/>
		</>
	);
};
export default FormWorkout;
