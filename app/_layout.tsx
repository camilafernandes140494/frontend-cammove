import i18n from "@/locales/i18n";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import "react-native-reanimated";
import { ThemeProvider } from "../context/ThemeContext";
import { TranslationProvider } from "../context/TranslationContext";
import { UserProvider } from "../context/UserContext";
import RootNavigator from "./navigation/RootNavigator";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	const queryClient = new QueryClient();

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync(); // Esconde o splash screen após o carregamento das fontes
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<I18nextProvider i18n={i18n}>
			<QueryClientProvider client={queryClient}>
				<UserProvider>
					<ThemeProvider>
						<TranslationProvider>
							<StatusBar style="auto" />
							<NavigationContainer>
								<RootNavigator />
							</NavigationContainer>
						</TranslationProvider>
					</ThemeProvider>
				</UserProvider>
			</QueryClientProvider>
		</I18nextProvider>
	);
}
