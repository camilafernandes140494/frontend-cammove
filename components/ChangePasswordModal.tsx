import { postResetPassword } from "@/api/auth/auth.api";
import { useTheme } from "@/context/ThemeContext";
import { useMutation } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import { View } from "react-native";
import {
	Button,
	Dialog,
	Icon,
	Portal,
	Snackbar,
	Text,
} from "react-native-paper";

interface ChangePasswordModalProps {
	visible: boolean;
	onClose: () => void;
	userEmail: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
	visible,
	onClose,
	userEmail,
}) => {
	const { theme } = useTheme();
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const [snackbarMsg, setSnackbarMsg] = useState("");

	const mutation = useMutation({
		mutationFn: async () => {
			await postResetPassword({ email: userEmail });
		},
		onSuccess: () => {
			setSnackbarMsg("E-mail de redefinição enviado com sucesso!");
			setSnackbarVisible(true);
			onClose();
		},
		onError: () => {
			setSnackbarMsg("Erro ao enviar e-mail de redefinição.");
			setSnackbarVisible(true);
		},
	});

	return (
		<Portal>
			<Dialog
				visible={visible}
				onDismiss={onClose}
				style={{
					backgroundColor: theme.colors.background,
					borderRadius: 20,
				}}
			>
				<Dialog.Title style={{ color: theme.colors.onBackground }}>
					Alterar senha
				</Dialog.Title>
				<Dialog.Content>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							gap: 16,
							marginVertical: 20,
						}}
					>
						<Icon
							color={theme.colors.primary}
							size={48}
							source={"lock-reset"}
						/>
						<Icon
							color={theme.colors.primary}
							size={32} // seta menor que os ícones
							source={"arrow-right"} // ícone de seta, pode ser "chevron-right" ou "arrow-right"
						/>
						<Icon color={theme.colors.primary} size={48} source={"email"} />
					</View>
					<Text style={{ color: theme.colors.onBackground }}>
						Deseja alterar sua senha? Enviaremos um e-mail para{" "}
						<Text style={{ fontWeight: "bold" }}>{userEmail}</Text> com
						instruções para redefinição.
					</Text>
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={onClose} textColor={theme.colors.onBackground}>
						Cancelar
					</Button>
					<Button
						mode="contained"
						onPress={() => mutation.mutate()}
						loading={mutation.isPending}
						disabled={mutation.isPending}
					>
						Enviar e-mail
					</Button>
				</Dialog.Actions>
			</Dialog>

			<Snackbar
				visible={snackbarVisible}
				onDismiss={() => setSnackbarVisible(false)}
				duration={3000}
				action={{
					label: "Fechar",
					onPress: () => setSnackbarVisible(false),
				}}
			>
				{snackbarMsg}
			</Snackbar>
		</Portal>
	);
};
