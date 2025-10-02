import {
	getNotifications,
	sendNotification,
	sendNotificationsData,
	updateNotificationsData,
} from "@/api/notifications/notifications.api";
import { getReviewById, postReview } from "@/api/reviews/reviews.api";
import type { ReviewData } from "@/api/reviews/reviews.types";
import { FormField } from "@/components/FormField";
import SelectableCard from "@/components/SelectableCard";
import { useSnackbar } from "@/context/SnackbarContext";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import { Appbar, Button, Text } from "react-native-paper";
import * as z from "zod";
import { useMyTeacher } from "../../context/MyTeacherContext";

type ReviewsStudentProps = {
	navigation: any;
	route: {
		params?: {
			workoutId?: string;
		};
	};
};

const ReviewsStudent = ({ route, navigation }: ReviewsStudentProps) => {
	const { theme } = useTheme();
	const { user } = useUser();
	const { teacher, teacherData } = useMyTeacher();
	const { workoutId } = route.params || {};

	const [selectedEvaluation, setSelectedEvaluation] = useState<string | null>(
		null,
	);

	const { showSnackbar } = useSnackbar();

	const { data: review } = useQuery({
		queryKey: ["getReviewById", user?.id, teacher?.teacherId, workoutId],
		queryFn: () =>
			getReviewById(teacher?.teacherId || "", workoutId || "", user?.id || ""),
		enabled: !!user?.id,
	});

	const handleEvaluation = (evaluation: string) => {
		setSelectedEvaluation(evaluation);
		setValue("review", evaluation);
	};

	const evaluations = [
		{
			label: "Excelente",
			icon: "emoticon-happy",
			message: "Treino incrível! Superou minhas expectativas.",
		},
		{
			label: "Muito bom",
			icon: "fire",
			message: "Excelente treino! Me senti muito bem durante e depois.",
		},
		{
			label: "Bom",
			icon: "thumb-up",
			message: "O treino foi bom, mas poderia ter sido mais desafiador.",
		},
		{
			label: "Regular",
			icon: "alert",
			message: "Achei o treino mediano, pode melhorar em alguns pontos.",
		},
		{
			label: "Ruim",
			icon: "thumb-down",
			message: "Não gostei do treino. Precisa de melhorias.",
		},
	];

	const schema = z.object({
		review: z.string(),
		reviewFeedback: z.string().optional(),
	});

	const { control, handleSubmit, setValue, reset } = useForm<
		z.infer<typeof schema>
	>({
		resolver: zodResolver(schema),
		defaultValues: {
			review: "",
			reviewFeedback: "",
		},
	});

	useEffect(() => {
		if (review) {
			reset({
				review: review?.review || "",
				reviewFeedback: review?.reviewFeedback || "",
			});
			setSelectedEvaluation(review?.review || "");
		}
	}, [review, reset]);

	const mutation = useMutation({
		mutationFn: async (data: Partial<ReviewData>) => {
			const { review, reviewFeedback } = data;
			const reviewNote =
				review === "Excelente"
					? "5"
					: review === "Muito bom"
						? "4"
						: review === "Bom"
							? "3"
							: review === "Regular"
								? "2"
								: "1";

			const reviewDescriptionData =
				review === "Excelente"
					? evaluations[0]?.message
					: review === "Muito bom"
						? evaluations[1]?.message
						: review === "Bom"
							? evaluations[2]?.message
							: review === "Regular"
								? evaluations[3]?.message
								: evaluations[4]?.message;

			const reviewData = {
				teacherId: teacher?.teacherId || "",
				student: { studentId: user?.id || "", name: user?.name || "" },
				workoutId: workoutId,
				review: review,
				reviewDescription: reviewDescriptionData,
				reviewNote: Number(reviewNote),
				reviewFeedback: reviewFeedback,
			};
			await postReview(teacher?.teacherId || "", user?.id || "", reviewData);
		},
		onSuccess: async () => {
			await sendNotification({
				title: "🎉 Novo feedback!",
				message:
					" Você recebeu o feedback do treino do seu aluno(a). Hora de analisar e motivar ainda mais! 💪",
				token: [teacherData?.deviceToken || ""],
			});
			const response = await getNotifications(teacher?.teacherId || "");
			const getIdNotifications = Array.isArray(response) ? response : [];
			if (getIdNotifications.length === 0) {
				await sendNotificationsData(teacher?.teacherId || "", {
					assessments: false,
					workout: false,
					schedule: false,
					reviews: true,
				});
			} else {
				await updateNotificationsData(
					teacher?.teacherId || "",
					getIdNotifications[0].id || "",
					{
						assessments: getIdNotifications[0].assessments || false,
						workout: getIdNotifications[0].workout || false,
						schedule: getIdNotifications[0].schedule || false,
						reviews: true,
					},
				);
			}
			navigation.navigate("WorkoutsStudent" as never);
		},
		onError: () => {
			showSnackbar("Erro ao enviar feedback", "error");
		},
	});

	const onSubmit = async (data: Partial<ReviewData>) => {
		mutation.mutate(data);
	};

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
			<Appbar.Header>
				<Appbar.BackAction
					onPress={() => navigation.navigate("WorkoutsStudent")}
				/>
				<Appbar.Content title="Avaliações" />
			</Appbar.Header>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{
					flexDirection: "column",
					padding: 24,
					gap: 16,
				}}
			>
				<Text variant="titleLarge">O que você achou desse treino?</Text>
				<View>
					{evaluations.map((evaluation) => (
						<SelectableCard
							key={evaluation.label}
							icon={evaluation.icon}
							message={evaluation.message}
							label={evaluation.label}
							onPress={handleEvaluation}
							selected={selectedEvaluation === evaluation.label}
						/>
					))}
				</View>
				<FormField
					control={control}
					name="reviewFeedback"
					label="Quer deixar um feedback?  (opcional)"
					type="text"
					multiline
					numberOfLines={5}
				/>
				<Button
					mode="contained"
					onPress={handleSubmit(onSubmit)}
					disabled={mutation.isPending}
					loading={mutation.isPending}
				>
					Enviar
				</Button>
			</ScrollView>
		</View>
	);
};

export default ReviewsStudent;
