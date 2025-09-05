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
import { MyTeacherProvider } from "../../context/MyTeacherContext";
import AssessmentsStudentNavigator from "./AssessmentsStudentNavigator";
import HomeStudentNavigator from "./HomeStudentNavigator";
import SchedulesNavigatorStudent from "./ScheduleNavigatorStudent";
import WorkoutsNavigatorStudent from "./WorkoutsNavigatorStudent";

const Tab = createBottomTabNavigator();

function TabsContent() {
	const { isDarkMode, theme } = useTheme();
	const { data, refetch } = useNotifications();
	const { user } = useUser();
	console.log(data);

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
				component={HomeStudentNavigator}
				options={{
					headerShown: false,
					tabBarLabel: "Início",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home" size={size} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="AssessmentsScreen"
				component={AssessmentsStudentNavigator}
				options={{
					headerShown: false,
					tabBarLabel: "Avaliação",
					tabBarIcon: ({ color, size }) => (
						<View>
							<Ionicons name="bar-chart-outline" size={size} color={color} />
							<TabBadge visible={data?.[0]?.assessments} />
						</View>
					),
				}}
				listeners={{
					focus: () => {
						if (!data?.[0]?.assessments) {
							return;
						}
						mutation.mutate("assessments");
					},
				}}
			/>

			<Tab.Screen
				name="WorkoutsScreen"
				component={WorkoutsNavigatorStudent}
				options={{
					headerShown: false,
					tabBarLabel: "Treinos",
					tabBarIcon: ({ color, size }) => (
						<View>
							<Ionicons name="fitness" size={size} color={color} />
							<TabBadge visible={data?.[0]?.workout} />
						</View>
					),
				}}
				listeners={{
					focus: () => {
						if (!data?.[0]?.workout) {
							return;
						}
						mutation.mutate("workout");
					},
				}}
			/>
			<Tab.Screen
				name="ScheduleScreen"
				key={JSON.stringify(data)}
				component={SchedulesNavigatorStudent}
				options={{
					headerShown: false,
					tabBarLabel: "Agenda",
					tabBarIcon: ({ color, size }) => (
						<View>
							<Ionicons name="calendar-outline" size={size} color={color} />
							<TabBadge visible={data?.[0]?.schedule} />
						</View>
					),
				}}
				listeners={{
					focus: () => {
						if (!data?.[0]?.schedule) {
							return;
						}
						mutation.mutate("schedule");
					},
				}}
			/>
		</Tab.Navigator>
	);
}
function TabsStudent() {
	const { isDarkMode, theme } = useTheme();
	const { user } = useUser();

	return (
		<MyTeacherProvider>
			<NotificationsProvider userId={user?.id || ""}>
				<TabsContent />
			</NotificationsProvider>
		</MyTeacherProvider>
	);
}

export default TabsStudent;

const TabBadge = ({
	visible = false,
	size = 12,
	color = "red",
	style = {},
}: {
	visible?: boolean;
	size?: number;
	color?: string;
	style?: object;
}) => {
	if (!visible) return null;
	return (
		<View
			style={{
				position: "absolute",
				top: -4,
				right: -10,
				width: size,
				height: size,
				borderRadius: size / 2,
				backgroundColor: color,
				justifyContent: "center",
				alignItems: "center",
				...style,
			}}
		/>
	);
};
