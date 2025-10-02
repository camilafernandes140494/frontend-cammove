// src/components/EmptyState.tsx

import { useTheme } from "@/context/ThemeContext";
import type React from "react";
import { Button, Card, Icon, Text } from "react-native-paper";

type EmptyStateProps = {
	message?: string;
	onRetry: () => void;
};

const EmptyState = ({
	message = "Nenhum dado encontrado.",
	onRetry,
}: EmptyStateProps) => {
	const { theme } = useTheme();

	return (
		<Card
			style={{
				margin: 24,
				alignItems: "center",
			}}
			mode="outlined"
		>
			<Card.Content
				style={{
					margin: 16,
					padding: 16,
					alignItems: "center",
					gap: 12,
				}}
			>
				<Icon
					source={"file-search-outline"}
					size={48}
					color={theme.colors.primary}
				/>
				<Text variant="titleMedium">{message}</Text>
				<Button icon={"refresh"} onPress={onRetry}>
					Tentar novamente
				</Button>
			</Card.Content>
		</Card>
	);
};

export default EmptyState;
