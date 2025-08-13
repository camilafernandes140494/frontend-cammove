import { registerForPushNotificationsAsync } from "@/api/notifications/notifications.api";
import { postDeviceToken } from "@/api/users/users.api";
import { useUser } from "@/context/UserContext";
import { useMutation } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import AuthNavigator from "./AuthNavigator";
import TabsStudent from "./TabsStudent";
import TabsTeacher from "./TabsTeacher";

function RootNavigator() {
	const { user, setUser } = useUser();

	Notifications.setNotificationHandler({
		handleNotification: async () => ({
			shouldShowAlert: true,
			shouldShowSound: true,
			shouldSetBadge: false,
			shouldShowBanner: true, // adiciona aqui
			shouldShowList: true, // e aqui
			shouldPlaySound: true,
		}),
	});

	useEffect(() => {
		if (!user?.id) return;

		registerForPushNotificationsAsync().then((token) => {
			if (token) {
				console.log("Token recebido:", token);

				if (user?.deviceToken !== token) {
					mutation.mutate(token);
				}
			}
		});
	}, [user?.id, user?.deviceToken]);

	const mutation = useMutation({
		mutationFn: (token: string) =>
			postDeviceToken(user?.id || "", { deviceToken: token }),
		onSuccess: (_, variables) => {
			setUser({ ...user, deviceToken: variables });
		},
		onError: (error) => {
			console.error("Erro ao enviar token:", error);
		},
	});

	return (
		<>
			{user?.onboarding_completed ? (
				user?.permission === "TEACHER" ? (
					<TabsTeacher />
				) : (
					<TabsStudent />
				)
			) : (
				<AuthNavigator />
			)}
		</>
	);
}
export default RootNavigator;
