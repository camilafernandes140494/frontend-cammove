import { patchUser } from "@/api/users/users.api";
import type { PERMISSION, PostUser } from "@/api/users/users.types";
import CardProfile from "@/components/CardProfile";
import Skeleton from "@/components/Skeleton";
import UserForm from "@/components/UserForm";
import { useSnackbar } from "@/context/SnackbarContext";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import React, { useRef, useState } from "react";
import { Animated, ScrollView, View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import type { AvatarImageSource } from "react-native-paper/lib/typescript/components/Avatar/AvatarImage";

const Onboarding = () => {
	const { theme } = useTheme();
	const [profile, setProfile] = useState(0);
	const { user, setUser } = useUser();
	const { showSnackbar } = useSnackbar();
	type CarouselItem = {
		title: string;
		description: string;
		image: AvatarImageSource;
		color: string;
		status: PERMISSION;
	};

	const carouselItems: CarouselItem[] = [
		{
			title: "Sou um Aluno",
			description:
				"Como aluno, você pode acessar seus treinos personalizados, acompanhar seu progresso e comunicar-se diretamente com seu personal trainer para garantir que você esteja no caminho certo para alcançar seus objetivos!",
			image: require("@/assets/images/student.png"),
			color: "blue",
			status: "STUDENT",
		},
		{
			title: "Sou um Personal Trainer",
			description:
				"Se você é um personal trainer, esta é a opção certa para você! Aqui, você pode criar treinos personalizados, gerenciar seus alunos e acompanhar o progresso deles com facilidade.",
			image: require("@/assets/images/personal-trainer.png"),
			color: "beige",
			status: "TEACHER",
		},
	];

	const updateUserProfile = async (values: Partial<PostUser>) => {
		try {
			await patchUser(user?.id!, values);
			setUser(values);
		} catch (error) {
			showSnackbar("Erro ao editar usuário", "error");
		}
	};

	const fadeAnim = useRef(new Animated.Value(1)).current;

	const handleChangeProfile = (next: number) => {
		// fade out
		Animated.timing(fadeAnim, {
			toValue: 0,
			duration: 150,
			useNativeDriver: true,
		}).start(() => {
			setProfile(next);

			// fade in
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 150,
				useNativeDriver: true,
			}).start();
		});
	};

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
			<ScrollView
				contentContainerStyle={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					padding: 20,
					gap: 20,
					backgroundColor: theme.colors.background,
				}}
			>
				{!user?.id ? (
					<Skeleton style={{ width: "90%", height: 100, borderRadius: 20 }} />
				) : (
					<View style={{ marginTop: 50 }}>
						{!user?.permission ? (
							<>
								<Text
									variant="headlineLarge"
									style={{ textAlign: "center", marginVertical: 20 }}
								>
									Escolha seu perfil para começar
								</Text>
								<Card
									mode="contained"
									contentStyle={{
										borderRadius: 10,
										backgroundColor:
											theme.colors.card[carouselItems[profile].color].background
												.default,
									}}
								>
									<Card.Content
										style={{
											padding: 20,
											display: "flex",
											flexDirection: "row",
											alignItems: "center",
										}}
									>
										<Animated.View style={{ opacity: fadeAnim }}>
											<CardProfile
												title={carouselItems[profile].title}
												description={carouselItems[profile].description}
												image={carouselItems[profile].image}
												color={carouselItems[profile].color}
												status={carouselItems[profile].status}
												onStatus={(status) =>
													updateUserProfile({
														permission: status as PERMISSION,
													})
												}
											/>
										</Animated.View>
									</Card.Content>
									<Card.Actions>
										<IconButton
											icon="chevron-left"
											size={20}
											onPress={() => handleChangeProfile(profile - 1)}
											disabled={profile === 0}
											theme={{
												colors: {
													outline:
														theme.colors.card[carouselItems[profile].color].text
															.primary,
												},
											}}
											iconColor={
												theme.colors.card[carouselItems[profile].color].text
													.primary
											}
										/>
										<IconButton
											icon="chevron-right"
											size={20}
											mode="outlined"
											theme={{
												colors: {
													outline:
														theme.colors.card[carouselItems[profile].color].text
															.primary,
												},
											}}
											iconColor={
												theme.colors.card[carouselItems[profile].color].text
													.primary
											}
											onPress={() => handleChangeProfile(profile + 1)}
											disabled={profile === carouselItems.length - 1}
										/>
									</Card.Actions>
								</Card>
							</>
						) : (
							<>
								<Text variant="headlineMedium" style={{ textAlign: "center" }}>
									Me conte um pouco sobre você
								</Text>
								<View style={{ width: "100%" }}>
									<UserForm />
								</View>
							</>
						)}
					</View>
				)}
			</ScrollView>
		</View>
	);
};

export default Onboarding;
