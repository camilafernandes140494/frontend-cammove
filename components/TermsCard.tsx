import { patchUser } from "@/api/users/users.api";
import type { PostUser } from "@/api/users/users.types";
import { useSnackbar } from "@/context/SnackbarContext";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Avatar, Button, Card, Text } from "react-native-paper";
import TermsScreen from "./TermsScreen";

const TermsCard = () => {
	const { theme } = useTheme();
	const [termsOfUse, setTermsOfUse] = useState<string | undefined>(undefined);
	const { user, setUser } = useUser();
	const { showSnackbar } = useSnackbar();

	const mutation = useMutation({
		mutationFn: async () => {
			await patchUser(user?.id!, {
				termsOfUse: termsOfUse,
			} as Partial<PostUser>);
		},
		onSuccess: () => {
			setUser({
				termsOfUse: termsOfUse,
			});
		},
		onError: (error) => {
			showSnackbar("Erro ao aceitar os termos de uso", "error");
		},
	});

	return (
		<Card>
			<Card.Title
				title="Aceite os Termos de Uso"
				titleStyle={{ fontWeight: "bold" }}
				left={(props) => (
					<Avatar.Icon
						{...props}
						icon="file-document-outline"
						color={theme.colors.errorContainer}
						style={{ backgroundColor: theme.colors.onErrorContainer }}
					/>
				)}
			/>
			<Card.Content>
				<Text variant="bodyMedium" style={{ marginHorizontal: 12 }}>
					Para continuar usando o CamMove, você precisa aceitar os Termos de
					Uso.
				</Text>
				<TermsScreen onAcceptChange={setTermsOfUse} />
			</Card.Content>
			<Card.Actions style={{ justifyContent: "flex-end", paddingRight: 16 }}>
				<Button
					mode="contained"
					onPress={() => mutation.mutate()}
					loading={mutation.isPending}
					disabled={!termsOfUse || mutation.isPending}
					style={{ borderRadius: 8 }}
					contentStyle={{ paddingHorizontal: 16 }}
				>
					Aceitar Termos
				</Button>
			</Card.Actions>
		</Card>
	);
};

export default TermsCard;
