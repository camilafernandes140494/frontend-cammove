import { patchUser } from "@/api/users/users.api";
import type { PostUser } from "@/api/users/users.types";
import { getInitials } from "@/common/common";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import InfoField from "@/components/InfoField";
import Skeleton from "@/components/Skeleton";
import UserForm from "@/components/UserForm";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { FlatList, View } from "react-native";
import {
	Appbar,
	Avatar,
	Button,
	Divider,
	Surface,
	Text,
} from "react-native-paper";

const MyProfile = () => {
	const { user } = useUser();
	const { theme } = useTheme();
	const navigation = useNavigation();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (data: Partial<PostUser>) => {
			return await patchUser(user?.id! || "", data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["getRelationship"] });
		},
	});

	const [modalVisible, setModalVisible] = useState(false);

	return (
		<>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title="Detalhes do usuário(a)" />
			</Appbar.Header>
			<FlatList
				style={{ flex: 1, backgroundColor: theme.colors.background }}
				contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
				data={[{}]}
				keyExtractor={() => "header"}
				renderItem={() => (
					<>
						{mutation.isPending ? (
							<StudentProfileLoading />
						) : (
							<>
								<View
									style={{ display: "flex", alignItems: "center", gap: 16 }}
								>
									<View
										style={{
											width: "100%",
											backgroundColor: theme.colors.primaryContainer,
											padding: 20,
											paddingBottom: 100,
											alignItems: "center",
											position: "relative",
										}}
									>
										<View
											style={{
												position: "absolute",
												bottom: -45,
												zIndex: 1,
											}}
										>
											{user?.image ? (
												<Avatar.Image size={100} source={{ uri: user.image }} />
											) : (
												<Avatar.Text
													size={100}
													label={getInitials(user?.name || "")}
												/>
											)}
										</View>
									</View>

									<Text variant="headlineMedium" style={{ marginTop: 40 }}>
										{user?.name}
									</Text>
								</View>

								<UserForm userData={user}>
									<InfoField
										title="E-mail"
										description={user?.email || ""}
										style={{ marginVertical: 16 }}
									/>
									{user?.email && (
										<View style={{ marginBottom: 16 }}>
											<Button
												mode="outlined"
												onPress={() => setModalVisible(true)}
											>
												Alterar senha
											</Button>

											<ChangePasswordModal
												visible={modalVisible}
												onClose={() => setModalVisible(false)}
												userEmail={user?.email || ""}
											/>
										</View>
									)}
								</UserForm>
							</>
						)}
					</>
				)}
			/>
		</>
	);
};

export default MyProfile;

const StudentProfileLoading = () => {
	const { theme } = useTheme();

	return (
		<>
			<View style={{ display: "flex", alignItems: "center", gap: 16 }}>
				{/* Container superior com fundo */}
				<View
					style={{
						width: "100%",
						backgroundColor: theme.colors.primaryContainer,
						padding: 20,
						paddingBottom: 100,
						alignItems: "center",
						position: "relative",
					}}
				>
					{/* Skeleton do Avatar */}
					<View
						style={{
							position: "absolute",
							bottom: -45,
							zIndex: 1,
						}}
					>
						<Skeleton style={{ width: 80, height: 80, borderRadius: 40 }} />
					</View>
				</View>

				{/* Skeleton do nome */}
				<Skeleton
					style={{ width: 180, height: 24, borderRadius: 6, marginTop: 40 }}
				/>
			</View>

			{/* Container dos dados */}
			<Surface
				elevation={2}
				style={{ display: "flex", gap: 16, margin: 16, padding: 16 }}
			>
				<Skeleton style={{ width: "100%", height: 20, borderRadius: 4 }} />
				<Divider />
				<Skeleton style={{ width: "100%", height: 20, borderRadius: 4 }} />
				<Divider />
				<Skeleton style={{ width: "100%", height: 20, borderRadius: 4 }} />
				<Divider />
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						gap: 16,
					}}
				>
					<Skeleton style={{ width: 40, height: 20, borderRadius: 10 }} />
					<Skeleton style={{ width: 80, height: 20, borderRadius: 4 }} />
				</View>
			</Surface>
		</>
	);
};
