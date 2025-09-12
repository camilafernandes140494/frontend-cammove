import { getActiveTermsOfUse } from "@/api/termsOfUse/termsOfUse.api";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import {
	Button,
	Dialog,
	Divider,
	Portal,
	Switch,
	Text,
} from "react-native-paper";

interface TermsScreenProps {
	onAcceptChange?: (version?: string) => void;
}

const TermsScreen = ({ onAcceptChange }: TermsScreenProps) => {
	const [accepted, setAccepted] = useState(false);
	const [visible, setVisible] = useState(false);

	const {
		data: termsOfUse,
		isLoading,
		isFetching,
	} = useQuery({
		queryKey: ["getActiveTermsOfUse"],
		queryFn: () => getActiveTermsOfUse(),
		enabled: true, // Sempre ativo
	});

	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);

	const handleAccept = () => {
		setAccepted(true);
		onAcceptChange?.(termsOfUse?.version);
		hideModal();
	};

	const handleToggle = (value: boolean) => {
		setAccepted(value);
		onAcceptChange?.(value ? termsOfUse?.version : undefined);
	};

	return (
		<>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					marginHorizontal: 12,
				}}
			>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<Text variant="labelLarge">Li e aceito os</Text>
					<Button
						onPress={showModal}
						mode="text"
						compact
						contentStyle={{ padding: 0 }}
					>
						Termos de Uso
					</Button>
				</View>

				<View style={{ transform: [{ scale: 0.8 }] }}>
					<Switch value={accepted} onValueChange={handleToggle} />
				</View>
			</View>

			{/* Modal dos termos */}
			<Portal>
				<Dialog onDismiss={hideModal} visible={visible}>
					<Dialog.Title>{termsOfUse?.content.title}</Dialog.Title>
					<Dialog.ScrollArea>
						<ScrollView style={{ maxHeight: 400 }}>
							{isLoading || isFetching ? (
								<>
									<ActivityIndicator animating={true} style={{ margin: 16 }} />
									<Text
										variant="labelSmall"
										style={{ margin: 16, textAlign: "center" }}
									>
										Carregando os termos de uso...
									</Text>
								</>
							) : (
								<>
									<Text style={{ marginVertical: 16 }}>
										Bem-vindo(a) ao{" "}
										<Text variant="titleMedium" style={{ fontWeight: "bold" }}>
											CamMove
										</Text>
										!
									</Text>
									{termsOfUse?.content.intro?.map(
										(paragraph: string, idx: number) => (
											<Text key={`intro-${idx}`} style={{ marginBottom: 8 }}>
												{paragraph}
											</Text>
										),
									)}
									{termsOfUse?.content.sections?.map(
										(section: any, idx: number) => (
											<View key={`section-${idx}`} style={{ marginBottom: 16 }}>
												<Text variant="titleMedium" style={{ marginBottom: 6 }}>
													{section.title}
												</Text>
												{section.content.map((line: string, i: number) => (
													<Text
														key={`content-${i}`}
														style={{ marginBottom: 4 }}
													>
														- {line}
													</Text>
												))}
												<Divider style={{ marginVertical: 10 }} />
											</View>
										),
									)}
								</>
							)}
						</ScrollView>
					</Dialog.ScrollArea>
					<Dialog.Actions>
						<Button onPress={hideModal}>Fechar</Button>
						<Button onPress={handleAccept}>Aceitar</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</>
	);
};

export default TermsScreen;
