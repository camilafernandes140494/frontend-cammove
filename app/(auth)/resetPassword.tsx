import { postResetPassword } from "@/api/auth/auth.api";
import { FormField } from "@/components/FormField";
import { useSnackbar } from "@/context/SnackbarContext";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import * as z from "zod";

const ResetPassword = () => {
	const navigation = useNavigation();
	const { theme } = useTheme();
	const [emailSent, setEmailSent] = useState(false);

	const { showSnackbar } = useSnackbar();

	const schema = z.object({
		email: z
			.string()
			.email("Por favor, insira um email válido")
			.nonempty("O email é obrigatório"),
	});

	const { control, handleSubmit } = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: "",
		},
	});

	const mutation = useMutation({
		mutationFn: async (values: { email: string }) => {
			await postResetPassword(values);
		},
		onSuccess: () => {
			setEmailSent(true);
		},
		onError: () => {
			showSnackbar("Erro ao resetar senha", "error");
		},
	});
	const onSubmit = async (data: any) => {
		mutation.mutate(data);
	};

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					paddingBottom: 5,
				}}
			>
				<Text
					variant="displayMedium"
					style={{ color: theme.colors.background }}
				>
					CAMMOVE
				</Text>
				<Text variant="titleMedium" style={{ color: theme.colors.background }}>
					Recuperar senha
				</Text>
			</View>
			<View
				style={{
					flex: 2,
					marginTop: -50,
					backgroundColor: theme.colors.background,
					borderTopEndRadius: 40,
					borderTopStartRadius: 40,
					padding: 20,
					paddingTop: 50,
				}}
			>
				{emailSent ? (
					<>
						<View
							style={{
								display: "flex",
								flexDirection: "column",
								gap: 24,
								alignItems: "center",
							}}
						>
							<Ionicons
								name={"mail-unread-outline"}
								size={64}
								color={theme.colors.primary}
							/>
							<Text variant="titleLarge">Verifique seu e-mail</Text>
							<Text variant="titleSmall">
								Enviamos instruções para redefinir sua senha.
							</Text>
							<Button
								mode="contained"
								onPress={() => navigation.navigate("Login" as never)}
							>
								Ir para o login
							</Button>
						</View>
					</>
				) : (
					<View
						style={{
							display: "flex",
							flexDirection: "column",
							gap: 5,
						}}
					>
						<FormField
							control={control}
							mode="flat"
							name="email"
							label="E-mail"
							type="text"
							style={{
								backgroundColor: theme.background,
							}}
						/>

						<Button
							mode="contained"
							loading={mutation.isPending}
							disabled={mutation.isPending}
							onPress={handleSubmit(onSubmit)}
							style={{
								borderRadius: 10,
								marginVertical: 20,
							}}
							contentStyle={{ height: 50 }}
						>
							ENVIAR
						</Button>
					</View>
				)}
			</View>
		</View>
	);
};

export default ResetPassword;
