import { postResetPassword } from "@/api/auth/auth.api";
import { useSnackbar } from "@/context/SnackbarContext";
import { useTheme } from "@/context/ThemeContext";
import { useMutation } from "@tanstack/react-query";
import type React from "react";
import { View } from "react-native";
import { Button, Dialog, Icon, Portal, Text } from "react-native-paper";

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

	const { showSnackbar } = useSnackbar();

	const mutation = useMutation({
		mutationFn: async () => {
			await postResetPassword({ email: userEmail });
		},
		onSuccess: () => {
			showSnackbar("E-mail de redefinição enviado com sucesso!", "success");
			onClose();
		},
		onError: () => {
			showSnackbar("Erro ao enviar e-mail de redefinição.", "error");
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
		</Portal>
	);
};
