import { getExercises } from "@/api/exercise/exercise.api";
import type { ExerciseWorkout } from "@/api/workout/workout.types";
import { convertTimestampsToString } from "@/common/common";
import { useTheme } from "@/context/ThemeContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import {
	Button,
	Card,
	Chip,
	IconButton,
	Modal,
	Portal,
	Text,
} from "react-native-paper";
import * as z from "zod";
import { FormField } from "./FormField";
import Skeleton from "./Skeleton";

interface ExerciseModalProps {
	onSave: (exercise: ExerciseWorkout) => void;
	exercise?: ExerciseWorkout;
	triggerWithIcon?: boolean;
}

const ExerciseModal = ({
	onSave,
	exercise,
	triggerWithIcon = false,
}: ExerciseModalProps) => {
	const [visibleModal, setVisibleModal] = useState(false);
	const { theme } = useTheme();

	const showModal = () => setVisibleModal(true);
	const hideModal = () => setVisibleModal(false);

	const modalSchema = z.object({
		exerciseId: z
			.object({
				name: z.string(),
				description: z.string(),
				category: z.string(),
				muscleGroup: z.array(z.string()).optional(),
				images: z.array(z.string()).optional(),
				video: z.string().optional(),
				createdAt: z
					.union([
						z.string(),
						z.array(z.string()),
						z.object({
							_seconds: z.number(),
							_nanoseconds: z.number(),
						}),
					])
					.optional(),
				updatedAt: z.string().optional(),
				deletedAt: z.string().optional(),
				id: z.string().optional(),
			})
			.nullable()
			.refine((value) => value !== null, { message: "Selecione um exercício" }),
		repetitions: z.string().min(1, "Informe a quantidade de repetições"),
		sets: z.string().optional(),
		restTime: z.string().min(1, "Informe o tempo de descanso"),
		observations: z.string().optional(),
	});

	const { control, handleSubmit, watch, reset } = useForm<
		z.infer<typeof modalSchema>
	>({
		resolver: zodResolver(modalSchema),
		defaultValues: {
			exerciseId: exercise?.exerciseId || {},
			repetitions: String(exercise?.repetitions ?? ""),
			sets: String(exercise?.sets ?? ""),
			restTime: String(exercise?.restTime ?? "30 segundos"),
			observations: exercise?.observations || "",
		},
	});

	const selectedExerciseId = watch("exerciseId");

	const addExercise = (exercise: any) => {
		const exerciseConverted = {
			...exercise,
			createdAt: convertTimestampsToString(exercise.createdAt),
		};

		reset();
		onSave(exerciseConverted);
		hideModal();
	};

	const { data: exercises, isLoading } = useQuery({
		queryKey: ["getExercises"],
		queryFn: () => getExercises({}),
		enabled: true,
	});

	return (
		<>
			<Portal>
				<Modal
					contentContainerStyle={{
						backgroundColor: theme.colors.surface,
						padding: 20,
						marginHorizontal: 16,
					}}
					onDismiss={hideModal}
					visible={visibleModal}
				>
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : "height"}
					>
						<ScrollView keyboardShouldPersistTaps="handled">
							<Text style={{ marginBottom: 16 }} variant="titleLarge">
								Exercício
							</Text>
							{isLoading ? (
								<Skeleton
									style={{ width: "90%", height: 50, borderRadius: 20 }}
								/>
							) : (
								<FormField
									control={control}
									getLabel={(option) => option.name}
									label="Selecione um exercício"
									name="exerciseId"
									options={exercises}
									type="select"
								/>
							)}

							{!!selectedExerciseId.id && (
								<Card style={{ margin: 20 }}>
									<Card.Title
										subtitle={selectedExerciseId?.description}
										title={selectedExerciseId?.name}
									/>
									<Card.Content>
										<Text variant="bodyMedium">
											{selectedExerciseId.category}
										</Text>
										<View
											style={{
												flexDirection: "row",
												flexWrap: "wrap",
												gap: 10,
												marginTop: 20,
											}}
										>
											{selectedExerciseId?.muscleGroup?.map(
												(muscleGroup, index) => (
													<Chip key={index}>{muscleGroup}</Chip>
												),
											)}
										</View>
									</Card.Content>
								</Card>
							)}

							<FormField
								control={control}
								label="Quantidade de repetições"
								name="repetitions"
								type="text"
							/>
							<FormField
								control={control}
								label="Número de séries"
								name="sets"
								type="text"
							/>
							<FormField
								control={control}
								label="Tempo de descanso"
								name="restTime"
								type="text"
							/>
							<FormField
								control={control}
								label="Observações (opcional)"
								name="observations"
								type="text"
							/>
							<Button
								mode="outlined"
								onPress={hideModal}
								style={{ marginBottom: 16 }}
								theme={{ colors: { outline: theme.colors.primary } }}
							>
								Cancelar
							</Button>
							<Button mode="contained" onPress={handleSubmit(addExercise)}>
								Salvar
							</Button>
						</ScrollView>
					</KeyboardAvoidingView>
				</Modal>
			</Portal>

			{triggerWithIcon ? (
				<IconButton
					icon={exercise ? "pencil-outline" : "plus"}
					mode="outlined"
					onPress={showModal}
					size={20}
				/>
			) : (
				<Button
					icon={exercise ? undefined : "plus"}
					mode="text"
					onPress={showModal}
					style={{ marginVertical: 16 }}
				>
					{exercise ? "Editar" : "Adicionar Exercício"}
				</Button>
			)}
		</>
	);
};

export default ExerciseModal;
