import { postVideos } from "@/api/files/files.api";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
	ActivityIndicator,
	InteractionManager,
	Text,
	View,
} from "react-native";
import { Button } from "react-native-paper";

interface VideoUploadProps {
	onSelect: (url: string) => void;
	labelButton?: string;
}

export default function VideoUpload({
	onSelect,
	labelButton = "Escolher vídeo",
}: VideoUploadProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const getVideoMimeType = (filename: string) => {
		const extension = filename.split(".").pop()?.toLowerCase();
		switch (extension) {
			case "mp4":
				return "video/mp4";
			case "mov":
				return "video/quicktime";
			case "avi":
				return "video/x-msvideo";
			default:
				return "application/octet-stream";
		}
	};

	const pickVideo = async () => {
		setError(null);

		// pede permissão
		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (!permissionResult.granted) {
			setError("Permissão para acessar a galeria foi negada.");
			return;
		}

		// seleciona vídeo
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Videos,
			allowsEditing: false,
			quality: 1,
			videoMaxDuration: 30, // limita a 60 segundos
		});

		if (!result.canceled && result.assets.length > 0) {
			InteractionManager.runAfterInteractions(() => {
				setIsLoading(true);
			});
			try {
				const video = result.assets[0];

				// cria caminho local acessível (importante no iOS)
				const localUri =
					FileSystem.cacheDirectory +
					(video.fileName || `video_${Date.now()}.mp4`);
				await FileSystem.copyAsync({ from: video.uri, to: localUri });

				// monta FormData
				const formData = new FormData();
				formData.append("file", {
					uri: localUri,
					name:
						`video_${video.fileName}_${Date.now()}` ||
						`video_${Date.now()}.mp4`,
					type: getVideoMimeType(video.fileName || ""),
				} as any);
				formData.append("title", video.fileName || "Vídeo de teste");
				formData.append("description", "Descrição do vídeo");

				// envia para o backend
				const uploadResult = await postVideos("videos", formData);
				onSelect(uploadResult.url); // assume que postVideos retorna { videoUrl }
			} catch (err) {
				console.error("Erro ao enviar vídeo:", err);
				setError("Erro ao enviar vídeo.");
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<View>
			<Button
				mode="contained"
				onPress={pickVideo}
				disabled={isLoading}
				icon="play-circle-outline"
			>
				{labelButton}
			</Button>
			{isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}
			{error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}
		</View>
	);
}
