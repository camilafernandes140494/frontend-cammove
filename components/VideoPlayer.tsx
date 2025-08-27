import { Video } from "expo-av";
import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";

interface VideoPlayerProps {
	source: string; // URL ou caminho local
	showDeleteButton?: boolean;
}

export default function VideoPlayer({
	source,
	showDeleteButton = false,
}: VideoPlayerProps) {
	return (
		<View style={{ width: "100%", height: 250, backgroundColor: "black" }}>
			<Video
				source={{ uri: source }}
				style={{ width: "100%", height: 250 }}
				useNativeControls // habilita play/pause, barra de progresso
				// shouldPlay // começa tocando
			/>
			{showDeleteButton && <Button icon={"delete"}>Deletar video</Button>}
		</View>
	);
}
