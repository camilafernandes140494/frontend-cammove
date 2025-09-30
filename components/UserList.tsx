import { postRelationship } from "@/api/relationships/relationships.api";
import { getUsers } from "@/api/users/users.api";
import type { Users } from "@/api/users/users.types";
import { getInitials } from "@/common/common";
import { useSnackbar } from "@/context/SnackbarContext";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { Avatar, Button, List, Text } from "react-native-paper";
import * as z from "zod";

interface UserListProps {
	params?: Record<string, string>;
	navigation: any;
}

const UserList = ({ params, navigation }: UserListProps) => {
	const { user, setUser } = useUser();
	const { theme } = useTheme();
	const { showSnackbar } = useSnackbar();

	const { data: users, isLoading } = useQuery({
		queryKey: ["getUsers"],
		queryFn: () => getUsers(params),
	});

	const schema = z.object({
		teacherId: z.object({
			birthDate: z.string(),
			createdAt: z.string(),
			deletedAt: z.string(),
			email: z.string(),
			gender: z.string(),
			id: z.string().min(1, { message: "ID é obrigatório" }),
			name: z.string(),
		}),
	});

	const { handleSubmit, getValues, setValue } = useForm<z.infer<typeof schema>>(
		{
			resolver: zodResolver(schema),
			defaultValues: {
				teacherId: {},
			},
		},
	);

	const mutation = useMutation({
		mutationFn: async () => {
			await postRelationship(getValues().teacherId.id!, user?.id!);
		},
		onSuccess: () => {
			setUser({ ...user, onboarding_completed: true });
		},
		onError: () => {
			showSnackbar("Erro ao selecionar o professor", "error");
		},
	});

	const onSubmit = async () => {
		mutation.mutate();
	};
	const [expanded, setExpanded] = useState(false);

	const [selectedOption, setSelectedOption] = useState<Users>();

	useEffect(() => {
		setValue("teacherId", {
			birthDate: selectedOption?.birthDate || "",
			createdAt: selectedOption?.createdAt || "",
			deletedAt: selectedOption?.deletedAt || "",
			email: selectedOption?.email || "",
			gender: selectedOption?.gender || "",
			id: selectedOption?.id || "",
			name: selectedOption?.name || "",
		});
	}, [selectedOption]);

	return (
		<View style={{ padding: 20, gap: 20, alignItems: "center" }}>
			<Text style={{ marginBottom: 20 }} variant="titleMedium">
				Selecione o professor responsável
			</Text>
			<Avatar.Image
				size={200}
				source={require("@/assets/images/personal-trainer.png")}
			/>

			<List.Section
				style={{
					width: "100%",
					borderWidth: 1,
					borderRadius: 10,
					borderColor: theme.colors.primary || "#ccc",
					overflow: "hidden",
				}}
			>
				<List.Accordion
					expanded={expanded}
					onPress={() => setExpanded(!expanded)}
					title={selectedOption?.name || "Escolha um professor"}
					titleStyle={{ fontSize: 16, color: theme.colors.primary }}
				>
					{users?.map((opt) => (
						<List.Item
							key={opt.id}
							left={() =>
								opt.image ? (
									<Avatar.Image
										size={30}
										source={{ uri: opt.image }}
										style={{
											marginLeft: 16,
										}}
									/>
								) : (
									<Avatar.Text
										label={getInitials(opt?.name || "")}
										size={30}
										style={{
											marginLeft: 16,
										}}
									/>
								)
							}
							onPress={() => {
								setSelectedOption(opt);
								setExpanded(false);
							}}
							title={opt.name}
						/>
					))}
				</List.Accordion>
			</List.Section>

			<Button
				contentStyle={{ height: 50 }}
				disabled={mutation.isPending}
				loading={mutation.isPending}
				mode="contained"
				onPress={handleSubmit(onSubmit)}
				style={{ borderRadius: 24 }}
			>
				Salvar
			</Button>
		</View>
	);
};

export default UserList;
