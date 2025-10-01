import { registerForPushNotificationsAsync } from "@/api/notifications/notifications.api";
import { postDeviceToken } from "@/api/users/users.api";
import { useSnackbar } from "@/context/SnackbarContext";
import { useUser } from "@/context/UserContext";
import { useMutation } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import AuthNavigator from "./AuthNavigator";
import TabsStudent from "./TabsStudent";
import TabsTeacher from "./TabsTeacher";

function RootNavigator() {
	const { user } = useUser();
	const { showSnackbar } = useSnackbar();

	Notifications.setNotificationHandler({
		handleNotification: async () => ({
			shouldShowAlert: true,
			shouldShowSound: true,
			shouldSetBadge: false,
			shouldShowBanner: true,
			shouldShowList: true,
			shouldPlaySound: true,
		}),
	});

	useEffect(() => {
		if (!user?.id) return;

		registerForPushNotificationsAsync().then((token) => {
			if (token) {
				if (user?.deviceToken !== token) {
					mutation.mutate(token);
				}
			}
		});
	}, [user?.id, user?.deviceToken]);

	const mutation = useMutation({
		mutationFn: (token: string) =>
			postDeviceToken(user?.id || "", { deviceToken: token }),
		onError: (error) => {
			showSnackbar("Erro ao enviar token", "error");
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
				<AuthNavigator user={user} />
			)}
		</>
	);
}
export default RootNavigator;
