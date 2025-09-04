import type { NotificationsDataTypes } from "@/api/notifications/notification.types";
import { getNotifications } from "@/api/notifications/notifications.api";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, type ReactNode, useContext } from "react";

type NotificationsContextType = {
	data: NotificationsDataTypes;
	loading: boolean;
	refetch: () => void;
};
const NotificationsContext = createContext<
	NotificationsContextType | undefined
>(undefined);

export const NotificationsProvider = ({
	children,
	userId,
}: {
	children: ReactNode;
	userId: string;
}) => {
	const {
		data: notificationsData,
		isLoading: isLoadingStudent,
		isFetching: isFetchingStudent,
		refetch,
	} = useQuery({
		queryKey: ["getNotifications", userId],
		queryFn: () => getNotifications(userId),
		enabled: !!userId,
	});

	const isLoading = isLoadingStudent || isFetchingStudent;

	return (
		<NotificationsContext.Provider
			value={
				{
					data: notificationsData || {
						assessments: false,
						workout: false,
						schedule: false,
					},
					loading: isLoading,
					refetch: refetch,
				} as NotificationsContextType
			}
		>
			{children}
		</NotificationsContext.Provider>
	);
};

export const useNotifications = () => {
	const context = useContext(NotificationsContext);
	if (!context) {
		throw new Error(
			"useNotifications must be used within a NotificationsProvider",
		);
	}
	return context;
};
