import { postLogin } from "@/api/auth/auth.api";
import { getUserById } from "@/api/users/users.api";
import { FormField } from "@/components/FormField";
import { useSnackbar } from "@/context/SnackbarContext";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import * as z from "zod";

const Login = () => {
	const navigation = useNavigation();
	const { setUser, login } = useUser();
	const { theme } = useTheme();

	const [showPassword, setShowPassword] = useState(false);

	const { showSnackbar } = useSnackbar();

	const schema = z.object({
		email: z
			.string()
			.email("Por favor, insira um email válido")
			.nonempty("O email é obrigatório"),
		password: z
			.string()
			.min(6, "A senha deve ter pelo menos 6 caracteres")
			.nonempty("A senha é obrigatória"),
	});

	const { control, handleSubmit } = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const mutation = useMutation({
		mutationFn: async (values: { email: string; password: string }) => {
			const userCredential = await postLogin(values);

			const userData = {
				id: userCredential.user_id,
				token: userCredential.token,
			};

			setUser(userData);
			await login(userData);

			return userCredential;
		},
		onSuccess: async (userCredential) => {
			// recebe o retorno da mutationFn
			const user = await getUserById(userCredential.user_id);
			const userData = {
				onboarding_completed: true,
				...user,
				id: userCredential.user_id,
				token: userCredential.token,
			};

			setUser(userData);
		},
		onError: () => {
			showSnackbar("Erro ao logar", "error");
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

					<Button
						style={{
							alignSelf: "flex-end",
							marginBottom: 20,
						}}
						mode="text"
						onPress={() => navigation.navigate("ResetPassword" as never)}
					>
						Esqueceu a senha?
					</Button>
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
						ENTRAR
					</Button>

					<Text style={{ textAlign: "center" }}>
						Não tem uma conta?{" "}
						<Text
							style={{ fontWeight: "bold" }}
							onPress={() => navigation.navigate("CreateUser" as never)}
						>
							Cadastre-se
						</Text>
					</Text>
				</View>
			</View>
		</View>
	);
};

export default Login;
