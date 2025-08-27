import { deleteFiles, postFiles } from "@/api/files/files.api";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { Button } from "react-native-paper";

interface ImageUploadProps {
	onSelect: (urls: string[]) => void;
	labelButton?: string;
	deletePreviousImage?: string | null;
	storageFolder: string;
}

export default function ImageUpload({
	onSelect,
	deletePreviousImage,
	labelButton = "Escolher imagens",
	storageFolder,
}: ImageUploadProps) {
	const [images, setImages] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const pickImages = async () => {
		setError(null);

		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (!permissionResult.granted) {
			setError("Permissão para acessar imagens foi negada.");
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: false,
			allowsMultipleSelection: true,
			quality: 1,
		});

		if (!result.canceled && result.assets.length > 0) {
			const selectedAssets = result.assets;
			setImages(selectedAssets.map((a) => a.uri));
			await handleSaveMultiple(selectedAssets);
		}
	};

	const compressImage = async (uri: string) => {
		const result = await ImageManipulator.manipulateAsync(uri, [], {
			compress: 0.7,
			format: ImageManipulator.SaveFormat.JPEG,
		});
		return result.uri;
	};

	const getMimeType = (filename: string) => {
		const extension = filename.split(".").pop()?.toLowerCase();
		switch (extension) {
			case "jpg":
			case "jpeg":
				return "image/jpeg";
			case "png":
				return "image/png";
			case "webp":
				return "image/webp";
			default:
				return "application/octet-stream";
		}
	};

	const handleSaveMultiple = async (assets: ImagePicker.ImagePickerAsset[]) => {
		setIsLoading(true);
		const uploadedUrls: string[] = [];

		try {
			if (deletePreviousImage) {
				const deleteImage = deletePreviousImage.split("/");
				await deleteFiles(deleteImage[3], deleteImage[4]);
			}

			for (const asset of assets) {
				const compressedUri = await compressImage(asset.uri);

				const file = {
					uri: compressedUri,
					name: asset.fileName || `photo_${Date.now()}.jpg`,
					type: getMimeType(asset.fileName || ""),
				} as any;

				const formData = new FormData();
				formData.append("file", file);

				const uploadResult = await postFiles(storageFolder, formData);
				const { url } = uploadResult;
				uploadedUrls.push(url);
			}

			onSelect(uploadedUrls);
		} catch (error) {
			console.error("Erro ao fazer upload:", error);
			setError("Erro ao enviar imagens.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<View>
			<Button
				mode="contained"
				onPress={pickImages}
				style={{ marginBottom: images.length ? 1 : 10 }}
				icon="image-multiple-outline"
			>
				{labelButton}
			</Button>

			{images.length > 0 && (
				<ScrollView
					horizontal
					style={{ marginTop: 20 }}
					contentContainerStyle={{ alignItems: "center" }}
				>
					{images.map((uri, index) => (
						<Image
							key={index}
							source={{ uri }}
							style={{
								width: 100,
								height: 100,
								borderRadius: 8,
								marginRight: 10,
							}}
						/>
					))}
					{isLoading && <ActivityIndicator animating={true} size="large" />}
				</ScrollView>
			)}

			{error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}
		</View>
	);
}
