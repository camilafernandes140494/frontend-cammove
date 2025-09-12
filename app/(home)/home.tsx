import { getRelationship } from "@/api/relationships/relationships.api";
import { getReviewsByTeacher } from "@/api/reviews/reviews.api";
import { getScheduleDates } from "@/api/schedules/schedules.api";
import type { SchedulesStudentDateData } from "@/api/schedules/schedules.types";
import { getInitials } from "@/common/common";
import CustomModal from "@/components/CustomModal";
import Skeleton from "@/components/Skeleton";
import TermsCard from "@/components/TermsCard";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { type NavigationProp, useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useState } from "react";
import {
	RefreshControl,
	ScrollView,
	TouchableOpacity,
	View,
} from "react-native";
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

export type RootHomeStackParamList = {
	home: undefined;
	UserList: undefined;
	StudentProfile: { studentProfileId?: string };
	RegisterUserByTeacher: undefined;
	Reviews: undefined;
	MyProfile: undefined;
};

const Home = () => {
	const { user, logout } = useUser();
	const { theme, toggleTheme, isDarkMode } = useTheme();
	const [visibleConfig, setVisibleConfig] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedDate, setSelectedDate] =
		useState<SchedulesStudentDateData[]>();

	const navigation = useNavigation<NavigationProp<RootHomeStackParamList>>();
	type IoniconName = keyof typeof Ionicons.glyphMap;

	const { data: students, refetch: studentsRefetch } = useQuery({
		queryKey: ["getRelationship", user?.id],
		queryFn: () => getRelationship(user?.id!),
		enabled: !!user?.id,
	});

	const {
		data: scheduleDates,
		isLoading,
		isFetching,
		refetch,
	} = useQuery({
		queryKey: ["getScheduleDates", user?.id],
		queryFn: () => getScheduleDates(user?.id!),
		enabled: !!user?.id,
	});

	const markedDates = Array.isArray(scheduleDates)
		? scheduleDates.reduce(
				(acc, date) => {
					acc[date.date] = {
						marked: true,
						dotColor: theme.colors.card.purple.border.default,
						selected: true,
						selectedColor: theme.colors.card.purple.border.default,
					};
					return acc;
				},
				{} as Record<string, any>,
			)
		: {};

	const {
		data: reviewsByTeacher,
		refetch: reviewsByTeacherRefetch,
		isLoading: reviewsByTeacherIsLoading,
		isFetching: reviewsByTeacherIsFetching,
	} = useQuery({
		queryKey: ["reviewsByTeacherWithLimit", user?.id],
		queryFn: () => getReviewsByTeacher(user?.id || "", { limit: "7" }),
		enabled: !!user?.id,
	});

	const firstSevenReviews = reviewsByTeacher?.slice(0, 7) || [];

	const averageNote =
		firstSevenReviews.length > 0
			? firstSevenReviews.reduce(
					(sum, review) => sum + Number(review.reviewNote),
					0,
				) / firstSevenReviews.length
			: 0;

	const maxNoteFromApi = 5; // Atualize aqui se o reviewNote agora vai até 5
	const starsToDisplay = 5;

	const normalizedNote = (averageNote / maxNoteFromApi) * starsToDisplay;

	function getStarType(index: number) {
		if (index <= normalizedNote) {
			return "star";
		} else {
			return "star-outline";
		}
	}

	const handleDayPress = (day: { dateString: string }) => {
		const selectedDates = scheduleDates?.filter(
			(schedule) => schedule.date === day.dateString,
		);

		if (selectedDates && selectedDates.length > 0) {
			setSelectedDate(selectedDates); // agora é uma lista
			setModalVisible(true);
		}
	};

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
			<Appbar.Header mode="small">
				<Appbar.Content title="CamMove" />
				<Appbar.Action icon="bell-outline" onPress={() => {}} />
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
					// alignItems: 'center',
					padding: 24,
					gap: 24,
				}}
				refreshControl={
					<RefreshControl
						refreshing={isLoading || isFetching}
						onRefresh={() => {
							refetch(), reviewsByTeacherRefetch(), studentsRefetch();
						}}
					/>
				}
			>
				{!user?.termsOfUse && <TermsCard />}

				<View
					style={{
						display: "flex",
						flexDirection: "row",
						flexWrap: "wrap",
						justifyContent: "space-between",
					}}
				>
					{[
						{
							label: "Total de alunos",
							value: students?.students.length,
							icon: "people-outline",
							backgroundColor: theme.colors.primary,
							color: theme.colors.onPrimary,
						},
						{
							label: "Alunos ativos",
							value: students?.students.filter(
								(student) => student.studentStatus === "ACTIVE",
							).length,
							icon: "person-outline",
							backgroundColor: theme.colors.card.feedback.background,
							color: theme.colors.card.feedback.text.primary,
						},
						{
							label: "Alunos inativos",
							value: students?.students.filter(
								(student) => student.studentStatus === "INACTIVE",
							).length,
							icon: "warning-outline",
							backgroundColor: theme.colors.error,
							color: theme.colors.onError,
						},
					].map((item, index) => (
						<TouchableOpacity
							key={index}
							style={{
								backgroundColor: item.backgroundColor,
								borderRadius: 16,
								width: "32%", // Agora são 3 colunas
								marginBottom: 10,
								padding: 12,
								alignItems: "center", // Centraliza os textos e ícones
							}}
							onPress={() => navigation.navigate("UserList")}
						>
							<Ionicons
								name={item.icon as IoniconName}
								size={24}
								color={item.color}
							/>
							<Text
								variant="headlineSmall"
								style={{ color: item.color, textAlign: "center" }}
							>
								{item.value}
							</Text>
							<Text
								variant="bodyLarge"
								style={{ color: item.color, textAlign: "center" }}
							>
								{item.label}
							</Text>
						</TouchableOpacity>
					))}
				</View>
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
						markedDates={markedDates}
						monthFormat={"MMMM yyyy"}
						onDayPress={handleDayPress}
					/>
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
							Agendamentos
						</Text>
					</View>
				</View>
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
								{selectedDate?.map((item, index) => (
									<View key={index}>
										<View
											style={{
												display: "flex",
												flexDirection: "row",
												justifyContent: "space-between",
												alignItems: "flex-start",
												marginBottom: 16,
											}}
										>
											<View>
												<Text variant="titleLarge">{item?.name}</Text>
												<Text variant="bodySmall">{item?.description}</Text>
											</View>
											{index === 0 && (
												<IconButton
													icon="close"
													size={20}
													onPress={() => setModalVisible(false)}
												/>
											)}
										</View>

										<View
											style={{
												display: "flex",
												flexDirection: "row",
												alignItems: "center",
												gap: 12,
												marginBottom: 10,
											}}
										>
											<Ionicons
												name={"time"}
												size={18}
												color={theme.colors.primary}
											/>
											<Text
												variant="bodyMedium"
												numberOfLines={1}
												ellipsizeMode="tail"
												style={{ fontSize: 14, flexShrink: 1 }}
											>
												{item?.time && item.time.length > 0
													? item.time
															.filter((t) => t !== "Personalizado")
															.join(", ")
													: "-"}
											</Text>
										</View>

										<View
											style={{
												display: "flex",
												flexDirection: "row",
												gap: 12,
												alignItems: "center",
												marginBottom: 10,
											}}
										>
											<Ionicons
												name={"calendar"}
												size={18}
												color={theme.colors.primary}
											/>
											<Text
												variant="bodyMedium"
												numberOfLines={1}
												ellipsizeMode="tail"
												style={{ fontSize: 14, flexShrink: 1 }}
											>
												{item?.date
													? format(
															parse(item.date, "yyyy-MM-dd", new Date()),
															"EEEE, dd 'de' MMMM 'de' yyyy",
															{ locale: ptBR },
														)
													: ""}
											</Text>
										</View>
										<View
											style={{
												display: "flex",
												flexDirection: "row",
												alignItems: "center",
												gap: 12,
											}}
										>
											<Ionicons
												name={"people"}
												size={18}
												color={theme.colors.primary}
											/>

											<Text
												variant="bodyMedium"
												numberOfLines={1}
												ellipsizeMode="tail"
												style={{ fontSize: 14, flexShrink: 1 }}
											>
												{item?.students && item.students.length > 0
													? item.students.map((s) => s.studentName).join(", ")
													: "-"}
											</Text>
										</View>
										{index + 1 < selectedDate.length && (
											<Divider
												style={{
													width: "100%",
													marginVertical: 16,
													backgroundColor: theme.colors.outlineVariant,
													height: 2,
												}}
											/>
										)}
									</View>
								))}
							</ScrollView>
						</View>
					</Modal>
				</Portal>
				<Card>
					<Card.Content>
						<Text variant="titleMedium">Gerenciar Alunos</Text>
					</Card.Content>
					<Card.Cover
						style={{ height: 300, backgroundColor: "transparent", padding: 16 }}
						source={require("@/assets/images/student.png")}
					/>
					<Card.Actions>
						<Button onPress={() => navigation.navigate("UserList")}>Ver</Button>
						<Button
							onPress={() => navigation.navigate("RegisterUserByTeacher")}
						>
							Adicionar
						</Button>
					</Card.Actions>
				</Card>

				{reviewsByTeacherIsLoading || reviewsByTeacherIsFetching ? (
					<Skeleton style={{ height: 200, borderRadius: 16 }} />
				) : (
					<View
						style={{
							backgroundColor: theme.colors.card.feedback.background,
							borderRadius: 16,
						}}
					>
						<Card.Title
							title="Feedbacks dos treinos"
							subtitle="Resultado dos últimos 7 dias"
							titleStyle={{ color: theme.colors.card.feedback.text.primary }}
							subtitleStyle={{
								color: theme.colors.card.feedback.text.secondary,
							}}
							right={() => (
								<Button
									textColor={theme.colors.card.feedback.button}
									onPress={() => navigation.navigate("Reviews")}
								>
									Ver mais
								</Button>
							)}
						/>
						<Divider
							bold={true}
							style={{
								marginVertical: 8,
								marginHorizontal: 16,
								backgroundColor: theme.colors.card.feedback.button,
							}}
						/>
						<View style={{ display: "flex", alignItems: "center", margin: 16 }}>
							<Text
								variant="displayMedium"
								style={{ color: theme.colors.card.feedback.text.primary }}
							>
								{normalizedNote.toFixed(1)}
							</Text>

							<View style={{ flexDirection: "row", justifyContent: "center" }}>
								{[1, 2, 3, 4, 5].map((star, index) => (
									<IconButton
										key={star}
										icon={getStarType(star)}
										iconColor={theme.colors.card.feedback.text.primary}
										size={24}
									/>
								))}
							</View>
							<Text
								variant="bodySmall"
								style={{ color: theme.colors.card.feedback.text.primary }}
							>
								Nível de satisfação
							</Text>
						</View>
					</View>
				)}
			</ScrollView>
		</View>
	);
};

export default Home;
