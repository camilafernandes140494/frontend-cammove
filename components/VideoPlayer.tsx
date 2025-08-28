import { deleteFiles } from "@/api/files/files.api";
import { useMutation } from "@tanstack/react-query";
import { Video } from "expo-av";
import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import CustomModal from "./CustomModal";

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
			console.log("erro");
		},
	});

	return (
		<View
			style={{
				width: "100%",
				// backgroundColor: "black",
				alignItems: "center",
				padding: 12,
				borderRadius: 18,
				gap: 10,
			}}
		>
			<Video
				source={{ uri: source }}
				style={{ width: "100%", height: 250 }}
				useNativeControls // habilita play/pause, barra de progresso
				// shouldPlay // começa tocando
			/>
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
