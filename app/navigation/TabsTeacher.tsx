import { updateNotificationsData } from "@/api/notifications/notifications.api";
import {
	NotificationsProvider,
	useNotifications,
} from "@/context/NotificationsContext";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useMutation } from "@tanstack/react-query";
import { View } from "react-native";
import AssessmentsNavigator from "./AssessmentsNavigator";
import ExercisesNavigator from "./ExercisesNavigator";
import HomeNavigator from "./HomeNavigator";
import ScheduleNavigator from "./ScheduleNavigator";
import { TabBadge } from "./TabsStudent";
import WorkoutsNavigator from "./WorkoutsNavigator";

const Tab = createBottomTabNavigator();

function TabsContent() {
	const { isDarkMode, theme } = useTheme();
	const { data, refetch } = useNotifications();
	const { user } = useUser();

	const mutation = useMutation({
		mutationFn: async (type: string) => {
			if (!data?.[0]?.id) {
				return;
			}
			return await updateNotificationsData(
				user?.id || "",
				data?.[0]?.id || "",
				{
					assessments: type === "assessments" ? false : data?.[0]?.assessments,
					workout: type === "workout" ? false : data?.[0]?.workout,
					schedule: type === "schedule" ? false : data?.[0]?.schedule,
					reviews: type === "reviews" ? false : data?.[0]?.reviews,
				},
			);
		},
		onSuccess: () => {
			refetch();
		},
	});

	return (
		<Tab.Navigator
			screenOptions={{
				tabBarStyle: {
					backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF", // Fundo da tab bar
					borderTopColor: isDarkMode ? "#333" : "#ddd", // Cor da borda superior
				},
				tabBarActiveTintColor: isDarkMode
					? theme.colors.onPrimaryContainer
					: "#6200EE", // Cor do ícone ativo
				tabBarInactiveTintColor: isDarkMode ? "#AAAAAA" : "#666666", // Cor do ícone inativo
			}}
		>
			<Tab.Screen
				name="HomeScreen"
				component={HomeNavigator}
				options={{
					headerShown: false,
					tabBarLabel: "Início",
					tabBarIcon: ({ color, size }) => (
						<View>
							<Ionicons name="home" size={size} color={color} />
							<TabBadge visible={data?.[0]?.reviews} />
						</View>
					),
				}}
				listeners={{
					focus: () => {
						if (!data?.[0]?.reviews) {
							return;
						}
						mutation.mutate("reviews");
					},
				}}
			/>
			<Tab.Screen
				name="AssessmentsScreen"
				component={AssessmentsNavigator}
				options={{
					headerShown: false,
					tabBarLabel: "Avaliação",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="bar-chart-outline" size={size} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="WorkoutsScreen"
				component={WorkoutsNavigator}
				options={{
					headerShown: false,
					tabBarLabel: "Treinos",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="fitness" size={size} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="ExercisesScreen"
				component={ExercisesNavigator}
				options={{
					headerShown: false,
					tabBarLabel: "Exercícios",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="barbell" size={size} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="ScheduleScreen"
				component={ScheduleNavigator}
				options={{
					headerShown: false,
					tabBarLabel: "Agenda",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="calendar-outline" size={size} color={color} />
					),
				}}
			/>
		</Tab.Navigator>
	);
}

function TabsTeacher() {
	const { user } = useUser();

	return (
		<NotificationsProvider userId={user?.id || ""}>
			<TabsContent />
		</NotificationsProvider>
	);
}

export default TabsTeacher;
