import { postCreateUser } from "@/api/auth/auth.api";
import { postEmail } from "@/api/email/email.api";
import { postRelationship } from "@/api/relationships/relationships.api";
import { postUser } from "@/api/users/users.api";
import type { GENDER, PERMISSION } from "@/api/users/users.types";
import { FormField } from "@/components/FormField";
import { useSnackbar } from "@/context/SnackbarContext";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { FlatList } from "react-native";
import { Appbar, Button, Surface, Text, TextInput } from "react-native-paper";
import * as z from "zod";

const schema = z.object({
	name: z.string().nonempty("Obrigatório"),
	email: z.string().email("E-mail inválido."),
	gender: z.string(),
	password: z.string(),
	permission: z.string().nonempty("Obrigatório"),
	birthDate: z.string().nonempty("Obrigatório"),
	image: z.string(),
	phone: z.string(),
});

type UserFormValues = z.infer<typeof schema>;

const RegisterUserByTeacher = () => {
	const { user } = useUser();
	const { theme } = useTheme();
	const navigation = useNavigation();
	const queryClient = useQueryClient();
	const { showSnackbar } = useSnackbar();

	const { control, handleSubmit, reset } = useForm<UserFormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: "",
			email: "",
			gender: "PREFER_NOT_TO_SAY",
			permission: "STUDENT",
			password: "123456",
			birthDate: "",
			image: "",
			phone: "",
		},
	});

	// 🔸 Mutation para criação de usuário
	const mutation = useMutation({
		mutationFn: async (values: UserFormValues) => {
			// 1️⃣ Cria o usuário no Auth
			const userCredential = await postCreateUser({
				email: values.email,
				password: values.password,
			});

			if (!userCredential?.uid) {
				throw new Error("Erro ao obter UID do usuário.");
			}

			// 2️⃣ Cria usuário no banco
			const userCreated = await postUser(userCredential.uid, {
				name: values.name,
				birthDate: values.birthDate,
				gender: values.gender as GENDER,
				permission: values.permission as PERMISSION,
				image: values.image,
				email: values.email,
				phone: values.phone,
			});

			// 3️⃣ Cria relacionamento + envia e-mail
			await Promise.all([
				postRelationship(user?.id!, userCreated.id),
				postEmail({
					body: `
						Olá ${values.name}, <br><br>
						Seja bem-vindo(a) à CamMove! 🎉<br><br>
						Seu cadastro foi realizado com sucesso e agora você faz parte da nossa comunidade dedicada ao seu bem-estar e evolução. <br><br>
						Fique à vontade para explorar todos os recursos disponíveis e, caso tenha alguma dúvida ou precise de ajuda, estamos à disposição.<br><br>
						Vamos juntos alcançar seus objetivos! 💪<br><br>
						Atenciosamente,<br>
						Equipe CamMove 🚀
					`,
					subject: "Bem-vindo(a) à CamMove – Cadastro Realizado com Sucesso!",
					to: [values.email],
				}),
			]);

			return userCreated;
		},
		onSuccess: () => {
			// Invalida cache relacionado à lista de relacionamentos
			queryClient.invalidateQueries({ queryKey: ["getRelationship"] });
			showSnackbar("Aluno cadastrado com sucesso! 🎉", "success");
			reset();
			navigation.goBack();
		},
		onError: () => {
			showSnackbar("Erro ao cadastrar usuário", "error");
		},
	});

	return (
		<FlatList
			style={{ flex: 1, backgroundColor: theme.colors.background }}
			contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
			ListHeaderComponent={
				<Appbar.Header>
					<Appbar.BackAction onPress={() => navigation.goBack()} />
					<Appbar.Content title="Cadastrar aluno" />
				</Appbar.Header>
			}
			data={[{}]}
			keyExtractor={() => "header"}
			renderItem={() => (
				<Surface
					elevation={2}
					style={{ display: "flex", gap: 16, margin: 16, padding: 16 }}
				>
					<FormField
						control={control}
						mode="flat"
						left={<TextInput.Icon icon="account-outline" />}
						name="name"
						label="Nome"
						type="text"
					/>
					<FormField
						control={control}
						mode="flat"
						left={<TextInput.Icon icon="email-outline" />}
						name="email"
						label="E-mail"
						type="text"
					/>
					<FormField
						control={control}
						mode="flat"
						left={<TextInput.Icon icon="calendar" />}
						name="birthDate"
						type="birthDate"
						label="Data de nascimento"
						maxLength={10}
						keyboardType="numeric"
					/>
					<FormField
						control={control}
						mode="flat"
						left={<TextInput.Icon icon="phone" />}
						name="phone"
						label="Qual é o seu celular?"
						type="text"
					/>
					<Text variant="titleMedium">
						Escolha o gênero com o qual seu aluno se identifica
					</Text>
					<FormField
						control={control}
						name="gender"
						label="Gênero"
						type="chip"
						options={[
							{ label: "Masculino", value: "MALE" },
							{ label: "Feminino", value: "FEMALE" },
							{ label: "Outro", value: "OTHER" },
							{
								label: "Prefiro não me identificar",
								value: "PREFER_NOT_TO_SAY",
							},
						]}
					/>

					<Button
						mode="contained"
						onPress={handleSubmit((values) => mutation.mutate(values))}
						loading={mutation.isPending}
						disabled={mutation.isPending}
					>
						Enviar
					</Button>
				</Surface>
			)}
		/>
	);
};

export default RegisterUserByTeacher;
