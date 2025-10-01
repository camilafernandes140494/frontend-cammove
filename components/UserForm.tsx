import { postEmail } from "@/api/email/email.api";
import { patchUser } from "@/api/users/users.api";
import type { PostUser } from "@/api/users/users.types";
import { useSnackbar } from "@/context/SnackbarContext";
import { type UserType, useUser } from "@/context/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import * as z from "zod";
import { FormField } from "./FormField";
import ImageUpload from "./ImageUpload ";
import UserList from "./UserList";

interface UserFormProps {
	userData?: Partial<UserType> | null;
	children?: React.ReactNode;
}

const UserForm = ({ userData, children }: UserFormProps) => {
	const [showListTeacher, setShowListTeacher] = useState(false);
	const navigation = useNavigation();
	const { showSnackbar } = useSnackbar();

	const { user, setUser } = useUser();

	const schema = z.object({
		name: z.string().nonempty("Obrigatório"),
		birthDate: z.string().nonempty("Obrigatório"),
		gender: z.string().nonempty("Obrigatório"),
		phone: z.string().nonempty("Obrigatório"),
		image: z.string().optional(),
	});

	const { control, handleSubmit, setValue } = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: userData?.name || "",
			birthDate: userData?.birthDate || "",
			gender: userData?.gender || "PREFER_NOT_TO_SAY",
			phone: userData?.phone || "",
			image: userData?.image || "",
		},
	});

	const mutation = useMutation({
		mutationFn: async (values: Partial<PostUser>) => {
			await patchUser(user?.id!, {
				...values,
				termsOfUse: user?.termsOfUse,
			} as Partial<PostUser>);
			if (!user?.onboarding_completed) {
				await postEmail({
					body: `Olá ${values.name}, <br><br>
                            
                                    Seja bem-vindo(a) à CamMove! 🎉<br><br>
                            
                                    Seu cadastro foi realizado com sucesso e agora você faz parte da nossa comunidade dedicada ao seu bem-estar e evolução. <br><br>
                            
                                    Fique à vontade para explorar todos os recursos disponíveis e, caso tenha alguma dúvida ou precise de ajuda, estamos à disposição.<br><br>
                            
                                    Vamos juntos alcançar seus objetivos! 💪<br><br>
                            
                                    Atenciosamente,<br>
                                    Equipe CamMove 🚀`,

					subject: "Bem-vindo(a) à CamMove – Cadastro Realizado com Sucesso!",
					to: [user?.email || ""],
				});
			}
			return values;
		},
		onSuccess: (data) => {
			setUser({
				...(data ?? {}),
				onboarding_completed: user?.permission === "STUDENT" ? false : true,
			});

			if (user?.permission === "STUDENT") {
				setShowListTeacher(true);
			}
			showSnackbar("Dados atualizados", "success");
		},
		onError: () => {
			showSnackbar("Erro ao atualizar usuário", "error");
		},
	});

	const onSubmit = async (data: any) => {
		mutation.mutate(data);
	};

	return (
		<View
			style={{
				marginTop: 24,
			}}
		>
			{!showListTeacher && (
				<Card
					mode="contained"
					style={{
						display: "flex",
						flexDirection: "column",
						gap: 24,
						padding: 24,
					}}
				>
					<ImageUpload
						onSelect={(url) => {
							setValue("image", url[0]);
						}}
						labelButton="Escolher foto de perfil"
						storageFolder="users"
						deletePreviousImage={userData?.image}
					/>

					<FormField
						control={control}
						mode="flat"
						left={<TextInput.Icon icon="account-outline" />}
						name="name"
						label="Qual é o seu nome?"
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
						Escolha o gênero com o qual se identifica
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
					{children}
					<Button
						mode="contained"
						loading={mutation.isPending}
						disabled={mutation.isPending}
						onPress={handleSubmit(onSubmit)}
					>
						Salvar
					</Button>
				</Card>
			)}

			{showListTeacher && user?.permission === "STUDENT" && (
				<Card
					mode="contained"
					contentStyle={{
						borderRadius: 10,
						padding: 24,
					}}
				>
					<UserList
						params={{ permission: "TEACHER" }}
						navigation={navigation}
					/>
				</Card>
			)}
		</View>
	);
};

export default UserForm;
