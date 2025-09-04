export type SendNotificationBody = {
	token: string[];
	title: string;
	message: string;
};

export type NotificationsDataTypes = {
	assessments: boolean;
	workout: boolean;
	schedule: boolean;
};
