import { deleteFiles } from "@/api/files/files.api";
import { useSnackbar } from "@/context/SnackbarContext";
import { useMutation } from "@tanstack/react-query";
import { Video } from "expo-av";
import React, { useState } from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import CustomModal from "./CustomModal";
import Skeleton from "./Skeleton";

interface VideoPlayerProps {
	source: string;
	showDeleteButton?: boolean;
	onDelete?: () => Promise<void>;
}

export default function VideoPlayer({
	source,
	showDeleteButton = false,
	onDelete,
}: VideoPlayerProps) {
	const [loading, setLoading] = useState(true);
	const { showSnackbar } = useSnackbar();

	const mutation = useMutation({
		mutationFn: async () => {
			await deleteFiles("videos", source.split("/").pop() || "");
		},
		onSuccess: async () => {
			if (onDelete) {
				await onDelete();
			}
		},
		onError: () => {
			showSnackbar("Erro ao deletar video", "error");
		},
	});

	return (
		<View
			style={{
				width: "100%",
				alignItems: "center",
				padding: 12,
				borderRadius: 18,
				gap: 10,
			}}
		>
			<View
				style={{
					width: "100%",
					height: 250,
					borderRadius: 18,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{loading && (
					<Skeleton
						style={{
							width: "100%",
							height: "100%",
							borderRadius: 18,
						}}
					/>
				)}
				<Video
					source={{ uri: source }}
					style={{
						width: "100%",
						height: 250,
						borderRadius: 18,
						position: loading ? "absolute" : "relative",
					}}
					useNativeControls
					onLoadStart={() => setLoading(true)}
					onLoad={() => setLoading(false)}
				/>
			</View>

			{showDeleteButton && (
				<CustomModal
					onPress={mutation.mutate}
					primaryButtonLabel="Deletar vídeo"
					title="Tem certeza que deseja deletar o vídeo?"
					trigger={
						<Button icon={"delete"} mode="text">
							Deletar vídeo
						</Button>
					}
				/>
			)}
		</View>
	);
}
