import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import api from "../axios";
import type {
	NotificationsDataTypes,
	SendNotificationBody,
} from "./notification.types";

export async function registerForPushNotificationsAsync() {
	if (!Device.isDevice) {
		alert("Push notifications só funcionam em dispositivos físicos.");
		return null; // ou undefined, só para deixar claro que não teve token
	}

	const { status: existingStatus } = await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;

	if (existingStatus !== "granted") {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}

	if (finalStatus !== "granted") {
		alert(
			"Você negou a permissão para notificações. Para receber alertas, habilite nas configurações do dispositivo.",
		);
		return null;
	}

	const tokenData = await Notifications.getExpoPushTokenAsync();
	return tokenData.data;
}

export const sendNotification = async (params: SendNotificationBody) => {
	try {
		const response = await api.post("/notifications/send", params);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const sendNotificationsData = async (
	id: string,
	params: NotificationsDataTypes,
) => {
	try {
		const response = await api.post(`/notifications/${id}`, params);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getNotifications = async (id: string) => {
	try {
		const response = await api.get<NotificationsDataTypes>(
			`/notifications/${id}`,
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};
