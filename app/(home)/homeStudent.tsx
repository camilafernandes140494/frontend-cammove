import { getScheduleDatesByStudent } from "@/api/schedules/schedules.api";
import type { SchedulesStudentDateData } from "@/api/schedules/schedules.types";
import { getUserById } from "@/api/users/users.api";
import { getTrainingDays } from "@/api/workoutsDay/workoutsDay.api";
import { getInitials } from "@/common/common";
import CustomModal from "@/components/CustomModal";
import TermsCard from "@/components/TermsCard";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { type NavigationProp, useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { format, parse, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useEffect, useMemo, useState } from "react";
import { Image, Linking, RefreshControl, ScrollView, View } from "react-native";
import { Calendar } from "react-native-calendars";
import {
	Appbar,
	Avatar,
	Button,
	Card,
	Dialog,
	Divider,
	IconButton,
	Modal,
	Portal,
	Text,
} from "react-native-paper";
import { useMyTeacher } from "../../context/MyTeacherContext";

export type RootHomeStackParamList = {
	home: undefined;
	StudentProfile: { studentProfileId?: string };
	RegisterUserByTeacher: undefined;
	MyProfile: undefined;
};

const HomeStudent = () => {
	const { user, logout, setUser } = useUser();
	const { theme, toggleTheme, isDarkMode } = useTheme();
	const [visibleConfig, setVisibleConfig] = useState(false);
	const { teacher } = useMyTeacher();
	const [selectedDate, setSelectedDate] =
		useState<SchedulesStudentDateData[]>();
	const [selectedDateTraining, setSelectedDateTraining] =
		useState<{ date: string; nameWorkout: string; type: string }[]>();
	const [modalVisible, setModalVisible] = useState(false);
	const navigation = useNavigation<NavigationProp<RootHomeStackParamList>>();

	const { data: teacherData, isLoading: isLoadingTeacherData } = useQuery({
		queryKey: ["teacherData", teacher?.teacherId],
		queryFn: () => getUserById(teacher?.teacherId || ""),
		enabled: !!teacher?.teacherId,
	});

	const {
		data: scheduleDates,
		refetch: scheduleDatesRefetch,
		isLoading: scheduleDatesIsLoading,
		isFetching: scheduleDatesIsFetching,
	} = useQuery({
		queryKey: ["getScheduleDatesByStudent", teacher?.teacherId, user?.id],
		queryFn: () => getScheduleDatesByStudent(teacher?.teacherId!, user?.id!),
		enabled: !!teacher?.teacherId && !!user?.id,
	});

	const {
		data: trainingDates,
		refetch: trainingDatesRefetch,
		isLoading: trainingDatesIsLoading,
		isFetching: trainingDatesIsFetching,
	} = useQuery({
		queryKey: ["getTrainingDays", user?.id],
		queryFn: () => getTrainingDays(user?.id!),
		enabled: !!user?.id,
	});

	const markedDates: Record<string, any> = {};

	const allDates = new Set([
		...(Array.isArray(trainingDates) ? trainingDates.map((d) => d.date) : []),
		...(Array.isArray(scheduleDates) ? scheduleDates.map((d) => d.date) : []),
	]);

	allDates.forEach((date) => {
		const hasTraining = trainingDates?.some((d) => d.date === date);
		const hasSchedule = scheduleDates?.some((d) => d.date === date);

		if (hasTraining && hasSchedule) {
			markedDates[date] = {
				marked: true,
				dotColor: "#F9A825",
				selected: true,
				selectedColor: "#F9A825",
			};
		} else if (hasTraining) {
			markedDates[date] = {
				marked: true,
				dotColor: theme.colors.card.feedback.button,
				selected: true,
				selectedColor: theme.colors.card.feedback.button,
			};
		} else if (hasSchedule) {
			markedDates[date] = {
				marked: true,
				dotColor: theme.colors.card.purple.border.default,
				selected: true,
				selectedColor: theme.colors.card.purple.border.default,
			};
		}
	});

	const handleDayPress = (day: { dateString: string }) => {
		const selectedDates = Array.isArray(scheduleDates)
			? scheduleDates.filter((schedule) => schedule.date === day.dateString)
			: [];

		if (selectedDates && selectedDates.length > 0) {
			setSelectedDate(selectedDates); // agora é uma lista
			setModalVisible(true);
		} else {
			setSelectedDate([]);
		}
		const selectedDatesTraining = trainingDates?.filter(
			(training) => training.date === day.dateString,
		);

		if (selectedDatesTraining && selectedDatesTraining.length > 0) {
			setSelectedDateTraining(selectedDatesTraining); // agora é uma lista
			setModalVisible(true);
		} else {
			setSelectedDateTraining([]);
		}
	};

	const { count, message, icon } = useMemo(() => {
		if (!trainingDates)
			return { count: 0, message: "", icon: "emoticon-neutral-outline" };

		const today = new Date();
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(today.getDate() - 31);

		// cria um set de dias únicos nos últimos 30 dias
		const uniqueWorkoutDays = new Set(
			trainingDates
				.map((dateStr) => parseISO(dateStr.date))
				.filter((date) => date >= thirtyDaysAgo && date <= today)
				.map((date) => date.toDateString()), // converte para string para garantir unicidade
		);

		const count = uniqueWorkoutDays.size;

		let message = "";
		let icon = "emoticon-happy-outline";

		if (count >= 15) {
			message = "Incrível! Você está se superando! 💥";
			icon = "fire";
		} else if (count >= 10) {
			message = "Muito bem! Continue nesse ritmo! 🙌";
			icon = "emoticon-excited-outline";
		} else if (count >= 4) {
			message = "Ótimo progresso! Continue firme nos treinos! 🚀";
			icon = "emoticon-happy-outline";
		} else if (count >= 1) {
			message = "Você começou, e isso é o mais importante! 💪";
			icon = "star-outline";
		} else {
			message = "Hora de voltar à rotina! Você consegue! 🚀";
			icon = "run-fast";
		}

		return { count, message, icon };
	}, [trainingDates]);

	useEffect(() => {
		if (user?.onboarding_completed && !user?.permission) {
			setUser({ onboarding_completed: false });
		}
	}, [user]);

	console.log(user, "user in home student");
	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
			<Appbar.Header mode="small">
				<Appbar.Content
					title={
						<View
							style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
						>
							<Image
								source={require("@/assets/images/logo_1024.png")} // seu logo
								style={{ width: 24, height: 24, resizeMode: "contain" }}
							/>
							<Text style={{ fontSize: 18, fontWeight: "bold" }}>CamMove</Text>
						</View>
					}
				/>
				<Appbar.Action
					icon="menu"
					onPress={() => setVisibleConfig(!visibleConfig)}
				/>
				<Portal>
					<Dialog
						visible={visibleConfig}
						onDismiss={() => setVisibleConfig(false)}
					>
						<Dialog.Title style={{ textAlign: "center" }}>
							Configurações
						</Dialog.Title>
						<Dialog.Content style={{ alignItems: "flex-start", gap: 16 }}>
							<Button
								mode="text"
								icon={isDarkMode ? "moon-waning-crescent" : "weather-sunny"}
								onPress={toggleTheme}
							>
								{isDarkMode ? "Usar tema claro" : "Usar tema escuro"}
							</Button>
							<Divider
								style={{
									width: "100%",
									backgroundColor: theme.colors.outlineVariant,
									height: 1,
								}}
							/>
							<Button
								mode="text"
								icon="cog-outline"
								onPress={() => {
									setVisibleConfig(false), navigation.navigate("MyProfile");
								}}
							>
								Editar perfil
							</Button>

							<Divider
								style={{
									width: "100%",
									backgroundColor: theme.colors.outlineVariant,
									height: 1,
								}}
							/>

							<CustomModal
								onPress={logout}
								title="Tem certeza de que deseja sair? Você precisará fazer login novamente para acessar sua conta."
								primaryButtonLabel="Sair"
								trigger={
									<Button mode="text" icon="logout">
										Sair
									</Button>
								}
							/>
						</Dialog.Content>
					</Dialog>
				</Portal>
			</Appbar.Header>
			<View
				style={{
					display: "flex",
					backgroundColor: theme.colors.secondaryContainer,
					flexDirection: "row",
					alignItems: "center",
					padding: 16,
					gap: 16,
				}}
			>
				{user?.image ? (
					<Avatar.Image size={80} source={{ uri: user.image }} />
				) : (
					<Avatar.Text label={getInitials(user?.name || "")} />
				)}
				<View style={{ paddingHorizontal: 16, maxWidth: "85%" }}>
					<Text variant="headlineMedium" style={{ flexWrap: "wrap" }}>
						Olá, {user?.name}
					</Text>
				</View>
			</View>

			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{
					display: "flex",
					flexDirection: "column",
					padding: 24,
					gap: 12,
				}}
				refreshControl={
					<RefreshControl
						refreshing={
							trainingDatesIsLoading ||
							trainingDatesIsFetching ||
							scheduleDatesIsLoading ||
							scheduleDatesIsFetching
						}
						onRefresh={() => {
							trainingDatesRefetch();
							scheduleDatesRefetch();
						}}
					/>
				}
			>
				<Card>
					<Card.Title
						title={teacherData?.name}
						titleStyle={{ fontWeight: "bold", fontSize: 18 }}
						subtitle="Treinador responsável"
						left={(props) => (
							<Avatar.Image
								{...props}
								size={48}
								source={
									teacherData?.gender
										? require("@/assets/images/teacher-girl.png")
										: require("@/assets/images/teacher-man.png")
								}
							/>
						)}
						right={(props) => (
							<IconButton
								{...props}
								icon="whatsapp"
								iconColor="#25D366"
								onPress={() => {
									const phone = teacherData?.phone?.replace(/\D/g, "");

									if (phone) {
										Linking.openURL(`https://wa.me/${phone}`);
									}
								}}
							/>
						)}
					/>
				</Card>
				{!user?.termsOfUse && <TermsCard />}
				{user?.status !== "ACTIVE" && (
					<Card style={{ backgroundColor: theme.colors.onErrorContainer }}>
						<Card.Title
							title="Aluno Inativo"
							subtitle="Entre em contato com o professor."
							titleStyle={{
								color: theme.colors.errorContainer,
								fontWeight: "bold",
							}}
							subtitleStyle={{ color: theme.colors.errorContainer }}
							left={(props) => (
								<Avatar.Icon
									{...props}
									icon="alert-circle"
									color={theme.colors.errorContainer}
									style={{ backgroundColor: theme.colors.onErrorContainer }}
								/>
							)}
						/>
					</Card>
				)}

				<View
					style={{
						backgroundColor: "#fff",
						borderRadius: 12,
						padding: 10,
						elevation: 3,
						shadowColor: "#000",
						shadowOpacity: 0.1,
						shadowRadius: 4,
						shadowOffset: { width: 0, height: 2 },
					}}
				>
					<Calendar
						markingType="custom"
						markedDates={markedDates}
						monthFormat={"MMMM yyyy"}
						onDayPress={handleDayPress}
					/>
					<Portal>
						<Modal
							visible={modalVisible}
							onDismiss={() => setModalVisible(false)}
							contentContainerStyle={{ paddingHorizontal: 0 }} // opcional
						>
							<View
								style={{
									backgroundColor: theme.colors.background,
									padding: 20,
									borderRadius: 10,
									margin: 30,
								}}
							>
								<ScrollView>
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
											alignItems: "center",
										}}
									>
										<Text variant="titleLarge">Detalhes do dia</Text>
										<IconButton
											icon="close"
											onPress={() => setModalVisible(false)}
										/>
									</View>

									{(selectedDateTraining?.length || 0) > 0 && (
										<>
											<View
												style={{
													display: "flex",
													flexDirection: "row",
													gap: 8,
													alignItems: "center",
												}}
											>
												<Ionicons
													name="fitness"
													size={16}
													color={theme.colors.primary}
												/>
												<Text
													variant="titleMedium"
													style={{
														marginVertical: 12,
														// color: theme.colors.primary,
													}}
												>
													Treinos realizados
												</Text>
											</View>

											{selectedDateTraining?.map((item, index) => (
												<Card
													key={index}
													style={{
														marginBottom: 10,
														backgroundColor: "#E3F2FD",
													}}
												>
													<Card.Content>
														<Text
															variant="titleSmall"
															style={{
																color: theme.colors.shadow,
															}}
														>
															{item.nameWorkout}
														</Text>
														<Text
															variant="bodySmall"
															style={{
																color: theme.colors.shadow,
															}}
														>
															{item.type}
														</Text>
													</Card.Content>
												</Card>
											))}
										</>
									)}

									{(selectedDate?.length || 0) > 0 && (
										<>
											<View
												style={{
													display: "flex",
													flexDirection: "row",
													gap: 8,
													alignItems: "center",
												}}
											>
												<Ionicons
													name="calendar"
													size={16}
													color={theme.colors.primary}
												/>
												<Text
													variant="titleMedium"
													style={{
														marginVertical: 12,
													}}
												>
													Agendamentos
												</Text>
											</View>
											{selectedDate?.map((item, i) => (
												<Card
													key={i}
													style={{
														marginBottom: 10,
														backgroundColor: "#F3E5F5",
													}}
												>
													<Card.Content>
														<Text
															variant="titleSmall"
															style={{
																color: theme.colors.shadow,
															}}
														>
															{item.name}
														</Text>
														<Text
															variant="bodySmall"
															style={{
																color: theme.colors.shadow,
															}}
														>
															{item.description}
														</Text>
														<View
															style={{
																flexDirection: "row",
																alignItems: "center",
																marginTop: 6,
															}}
														>
															<Ionicons
																name="time"
																size={16}
																color={theme.colors.card.purple.text.secondary}
															/>
															<Text
																style={{
																	marginLeft: 6,
																	color: theme.colors.shadow,
																}}
															>
																{item.time?.join(", ") || "-"}
															</Text>
														</View>
														<View
															style={{
																flexDirection: "row",
																alignItems: "center",
																marginTop: 6,
															}}
														>
															<Ionicons
																name="calendar"
																size={16}
																color={theme.colors.card.purple.text.secondary}
															/>
															<Text
																style={{
																	marginLeft: 6,
																	color: theme.colors.shadow,
																}}
															>
																{format(
																	parse(item.date, "yyyy-MM-dd", new Date()),
																	"EEEE, dd 'de' MMMM",
																	{ locale: ptBR },
																)}
															</Text>
														</View>
													</Card.Content>
												</Card>
											))}
										</>
									)}
								</ScrollView>
							</View>
						</Modal>
					</Portal>

					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginBottom: 8,
						}}
					>
						<View
							style={{
								width: 12,
								height: 12,
								backgroundColor: theme.colors.card.purple.border.default,
								borderRadius: 6,
								marginRight: 6,
							}}
						/>
						<Text style={{ color: theme.colors.card.purple.text.primary }}>
							Agendamento
						</Text>
					</View>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginBottom: 8,
						}}
					>
						<View
							style={{
								width: 12,
								height: 12,
								backgroundColor: theme.colors.card.feedback.button,
								borderRadius: 6,
								marginRight: 6,
							}}
						/>
						<Text style={{ color: theme.colors.card.feedback.text.primary }}>
							Treino realizado
						</Text>
					</View>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginBottom: 8,
						}}
					>
						<View
							style={{
								width: 12,
								height: 12,
								backgroundColor: "#F9A825",
								borderRadius: 6,
								marginRight: 6,
							}}
						/>
						<Text style={{ color: "#C17900" }}>
							Agendamento + Treino realizado
						</Text>
					</View>
				</View>

				<Card style={{ marginVertical: 16, padding: 8 }}>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Avatar.Icon size={40} icon={icon} style={{ marginRight: 12 }} />
						<View style={{ flex: 1 }}>
							<Text variant="titleMedium" style={{ marginBottom: 4 }}>
								Você treinou {count} {count === 1 ? "vez" : "vezes"} no último
								mês
							</Text>
							<Text variant="bodyMedium">{message}</Text>
						</View>
					</View>
				</Card>
			</ScrollView>
		</View>
	);
};

export default HomeStudent;
