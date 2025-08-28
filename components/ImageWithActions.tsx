import { useTheme } from "@/context/ThemeContext";
import type React from "react";
import { useState } from "react";
import {
	Dimensions,
	Image,
	Modal,
	Pressable,
	StyleSheet,
	View,
} from "react-native";
import { Button, Dialog, IconButton, Portal, Text } from "react-native-paper";

interface Props {
	uri: string;
	onDelete?: () => void;
	showDeleteButton?: boolean;
}

export const ImageWithActions: React.FC<Props> = ({
	uri,
	onDelete,
	showDeleteButton = false,
}) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [confirmVisible, setConfirmVisible] = useState(false);
	const { theme } = useTheme();

	return (
		<View style={styles.container}>
			{/* Imagem + Botão de deletar */}

			<Pressable onPress={() => setModalVisible(true)}>
				<Image source={{ uri }} style={styles.image} />
			</Pressable>
			{showDeleteButton && (
				<IconButton
					mode="outlined"
					theme={{ colors: { outline: theme.colors.error } }}
					iconColor={theme.colors.error}
					icon="delete"
					size={20}
					onPress={() => setConfirmVisible(true)}
					style={styles.deleteButton}
				/>
			)}

			{/* Modal com imagem em zoom */}
			<Modal visible={modalVisible} transparent>
				<Pressable
					style={styles.modalBackground}
					onPress={() => setModalVisible(false)}
				>
					<Image
						source={{ uri }}
						style={styles.zoomedImage}
						resizeMode="contain"
					/>
				</Pressable>
			</Modal>

			{/* Modal de confirmação */}
			{showDeleteButton && (
				<Portal>
					<Dialog
						visible={confirmVisible}
						onDismiss={() => setConfirmVisible(false)}
					>
						<Dialog.Title>Confirmar exclusão</Dialog.Title>
						<Dialog.Content>
							<Text>Tem certeza que deseja remover esta imagem?</Text>
						</Dialog.Content>
						<Dialog.Actions>
							<Button onPress={() => setConfirmVisible(false)}>Cancelar</Button>
							<Button
								onPress={() => {
									onDelete?.();
									setConfirmVisible(false);
								}}
							>
								Remover
							</Button>
						</Dialog.Actions>
					</Dialog>
				</Portal>
			)}
		</View>
	);
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
	container: {
		position: "relative",
		marginRight: 10,
	},
	image: {
		width: 100,
		height: 100,
		borderRadius: 8,
	},
	deleteButton: {
		position: "absolute",
		top: 0,
		right: 0,
	},
	modalBackground: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.9)",
		justifyContent: "center",
		alignItems: "center",
	},
	zoomedImage: {
		width: width * 0.95, // ocupa 95% da tela em largura
		height: height * 0.95,
	},
});
