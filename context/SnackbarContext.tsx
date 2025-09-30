import React, {
	createContext,
	type ReactNode,
	useContext,
	useState,
} from "react";
import { View } from "react-native";
import { IconButton, Snackbar, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "./ThemeContext";

type SnackbarType = "success" | "error" | "warning" | "info";

type SnackbarContextProps = {
	showSnackbar: (message: string, type?: SnackbarType) => void;
};

const SnackbarContext = createContext<SnackbarContextProps>({
	showSnackbar: () => {},
});

export const useSnackbar = () => useContext(SnackbarContext);

type SnackbarProviderProps = {
	children: ReactNode;
};

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
	const [visible, setVisible] = useState(false);
	const [message, setMessage] = useState("");
	const [type, setType] = useState<SnackbarType>("info");

	const { theme } = useTheme();

	const getSnackbarColor = () => {
		switch (type) {
			case "success":
				return theme.colors.card.feedback.background;
			case "error":
				return theme.colors.card.negativeFeedback.background;
			case "warning":
				return theme.colors.card.warningFeedback.background;
			default:
				return theme.colors.card.infoFeedback.background;
		}
	};

	const getIconName = () => {
		switch (type) {
			case "success":
				return "check-circle";
			case "error":
				return "alert-circle";
			case "warning":
				return "alert";
			default:
				return "information";
		}
	};

	const getIconAndTextColor = () => {
		switch (type) {
			case "success":
				return theme.colors.card.feedback.text.primary;
			case "error":
				return theme.colors.card.negativeFeedback.text.primary;
			case "warning":
				return theme.colors.card.warningFeedback.text.primary;
			default:
				return theme.colors.card.infoFeedback.text.primary;
		}
	};

	const showSnackbar = (text: string, snackbarType: SnackbarType = "info") => {
		setMessage(text);
		setType(snackbarType);
		setVisible(true);
	};

	return (
		<SnackbarContext.Provider value={{ showSnackbar }}>
			{children}
			<Snackbar
				visible={visible}
				onDismiss={() => setVisible(false)}
				duration={3000}
				style={{ backgroundColor: getSnackbarColor() }}
			>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						flex: 1,
					}}
				>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							alignContent: "center",
						}}
					>
						<Icon
							name={getIconName()}
							size={20}
							color={getIconAndTextColor()}
							style={{ marginRight: 8 }}
						/>
						<Text style={{ color: getIconAndTextColor() }}>{message}</Text>
					</View>
					<IconButton
						icon="close"
						mode="outlined"
						size={18}
						iconColor={getIconAndTextColor()}
						theme={{ colors: { outline: getIconAndTextColor() } }}
						onPress={() => setVisible(false)}
						style={{ margin: 0, padding: 0 }}
					/>
				</View>
			</Snackbar>
		</SnackbarContext.Provider>
	);
};
