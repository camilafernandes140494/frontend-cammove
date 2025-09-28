import { postCreateUser, postLogin } from "@/api/auth/auth.api";
import type { PostCreateUser } from "@/api/auth/auth.types";
import { postUser } from "@/api/users/users.api";
import { FormField } from "@/components/FormField";
import TermsScreen from "@/components/TermsScreen";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { type NavigationProp, useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { Button, Snackbar, Text, TextInput } from "react-native-paper";
import * as z from "zod";

export type RootOnboardingStackParamList = {
	createUser: undefined;
	Onboarding: { email?: string };
};

const CreateUser = () => {
	const { theme } = useTheme();
	const navigation =
		useNavigation<NavigationProp<RootOnboardingStackParamList>>();
	const { setUser, login } = useUser();
	const [showPassword, setShowPassword] = useState(false);
	const [visible, setVisible] = useState(false);

	const schema = z.object({
		email: z
			.string()
			.email("Por favor, insira um email válido")
			.nonempty("O email é obrigatório"),
		password: z
			.string()
			.min(6, "A senha deve ter pelo menos 6 caracteres")
			.nonempty("A senha é obrigatória"),
		termsOfUse: z.string().nonempty("É necessário aceitar os termos de uso"),
	});

	const { control, handleSubmit, setValue } = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: "",
			password: "",
			termsOfUse: "",
		},
	});

	const mutation = useMutation({
		mutationFn: async (values: PostCreateUser) => {
			const createResult = await postCreateUser(values);
			const userCredential = await postLogin({
				email: values.email,
				password: values.password,
			});
			await login({ id: userCredential.user_id, token: userCredential.token });

			return { createResult, userCredential };
		},
		onSuccess: async ({ createResult, userCredential }, variables) => {
			setUser({
				id: userCredential.user_id,
				token: userCredential.token,
				email: variables.email,
				termsOfUse: variables.termsOfUse,
			});
			await postUser(createResult.uid!, {
				name: "",
				gender: null,
				birthDate: "",
				permission: null,
				image: "",
				status: "ACTIVE",
				phone: "",
				email: variables.email,
			});
			navigation.navigate("Onboarding", { email: variables.email });
		},
		onError: (error) => {
			console.error("Erro ao criar usuário:", error);

			setVisible(true);
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
					paddingBottom: 20,
				}}
			>
				<Text
					variant="displayMedium"
					style={{ color: theme.colors.background }}
				>
					CAMMOVE
				</Text>
				<Text variant="titleMedium" style={{ color: theme.colors.background }}>
					Cadastre-se
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
				<Snackbar
					visible={visible}
					onDismiss={() => setVisible(false)}
					action={{
						label: "Fechar",
						icon: "close",
						onPress: () => setVisible(false),
					}}
				>
					<Text>Erro ao cadastrar</Text>
				</Snackbar>
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
					<FormField
						control={control}
						mode="flat"
						name="password"
						label="Senha"
						type="text"
						secureTextEntry={!showPassword}
						style={{
							backgroundColor: theme.background,
						}}
						right={
							<TextInput.Icon
								icon={showPassword ? "eye-off" : "eye"}
								onPress={() => setShowPassword(!showPassword)}
							/>
						}
					/>
					<FormField
						control={control}
						name="termsOfUse"
						type="custom"
						customRender={({ value, onChange }) => (
							<TermsScreen onAcceptChange={onChange} />
						)}
					/>
					<Button
						mode="contained"
						onPress={handleSubmit(onSubmit)}
						loading={mutation.isPending}
						disabled={mutation.isPending}
						style={{
							borderRadius: 10,
							marginVertical: 20,
						}}
						contentStyle={{ height: 50 }}
					>
						Cadastre-se
					</Button>
				</View>
			</View>
		</View>
	);
};

export default CreateUser;
