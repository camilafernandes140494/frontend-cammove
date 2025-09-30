import AsyncStorage from "@react-native-async-storage/async-storage";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
	MD3DarkTheme as DarkTheme,
	MD3LightTheme as DefaultTheme,
	PaperProvider,
} from "react-native-paper";

// Criação do contexto
const ThemeContext = createContext<any>(null);

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
	children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
	const [isDarkMode, setIsDarkMode] = useState(false);

	// Alterna entre o tema claro e escuro
	const toggleTheme = async () => {
		const newTheme = !isDarkMode;
		setIsDarkMode(newTheme);
		await AsyncStorage.setItem("theme", newTheme ? "dark" : "light");
	};

	// Carregar o tema armazenado no AsyncStorage ao montar o componente
	useEffect(() => {
		const loadTheme = async () => {
			const storedTheme = await AsyncStorage.getItem("theme");
			setIsDarkMode(storedTheme === "dark");
		};
		loadTheme();
	}, []);

	const backgroundCard = {
		card: {
			feedback: {
				background: "#E6F4EA", // verde bem clarinho
				chipBackground: "#D0ECD9",
				text: { primary: "#207544", secondary: "#6C757D" }, // verde suave + cinza
				button: "#34A853", // verde Google, mais moderno
			},
			negativeFeedback: {
				background: "#FDEAEA", // vermelho/rosa bem clarinho
				chipBackground: "#F8D7DA", // um tom mais forte para o chip
				text: { primary: "#C62828", secondary: "#6C757D" }, // vermelho suave
				button: "#E53935", // vermelho um pouco mais forte para ação
			},
			warningFeedback: {
				background: "#FFF8E1", // amarelo bem clarinho, suave nos olhos
				chipBackground: "#FFE082", // amarelo médio (tipo amber 300)
				text: { primary: "#8D6E00", secondary: "#6C757D" }, // amarelo escuro/dourado para destaque
				button: "#FFC107", // botão com amarelo vivo (amber 500)
			},
			infoFeedback: {
				background: "#E3F2FD", // azul bem clarinho, ótimo como fundo
				chipBackground: "#BBDEFB", // azul médio para chips ou destaques
				text: { primary: "#1565C0", secondary: "#6C757D" }, // azul forte + cinza neutro
				button: "#1E88E5", // azul moderno e vivo para ações (Material Blue 600)
			},
			neutralFeedback: {
				background: "#FFF8E1", // amarelo pastel
				chipBackground: "#FFECB3",
				text: { primary: "#A67C00", secondary: "#6C757D" }, // dourado queimado
				button: "#FBC02D", // amarelo vibrante, mas sem exagero
			},
			blue: {
				background: {
					default: "#ADD8E6", // Azul Claro Suave
				},
				text: {
					primary: "#003366", // Azul Escuro para títulos ou textos principais
					secondary: "#6B7280", // Cinza Médio para descrições ou textos menos destacados
				},
				button: {
					background: "#00509E", // Azul Mais Intenso para o fundo do botão
					text: "#FFFFFF", // Branco para o texto do botão
				},
				border: {
					default: "#B0C4DE", // Azul claro neutro para bordas, se necessário
				},
			},
			beige: {
				background: {
					default: "#F2E7D5", // Bege Suave
				},
				text: {
					primary: "#5C4033", // Marrom Escuro para títulos ou textos principais
					secondary: "#7A5C45", // Marrom Médio para descrições ou textos menos destacados
				},
				button: {
					background: "#8B5E3C", // Marrom mais vibrante para o fundo do botão
					text: "#FFFFFF", // Branco para o texto do botão
				},
				border: {
					default: "#B8A58C", // Bege mais neutro para bordas, se necessário
				},
			},
			purple: {
				background: {
					default: "#D9B6F2", // Roxo Pastel Suave (novo tom de fundo)
				},
				text: {
					primary: "#4A0D67", // Roxo Escuro para textos principais
					secondary: "#6E287C", // Roxo Médio para descrições ou textos menos destacados
				},
				button: {
					background: "#A350DC", // Roxo Vibrante para o botão
					text: "#FFFFFF", // Branco para o texto do botão
				},
				border: {
					default: "#B68EEA", // Roxo Claro Suave para bordas
				},
			},
		},
	};

	// Definir temas customizados (opcional)
	const LightTheme = {
		...DefaultTheme,
		colors: {
			...DefaultTheme.colors,
			...backgroundCard,
			primary: "rgb(120, 69, 172)",
			onPrimary: "rgb(255, 255, 255)",
			primaryContainer: "rgb(240, 219, 255)",
			onPrimaryContainer: "rgb(44, 0, 81)",
			secondary: "rgb(102, 90, 111)",
			onSecondary: "rgb(255, 255, 255)",
			secondaryContainer: "rgb(237, 221, 246)",
			onSecondaryContainer: "rgb(33, 24, 42)",
			tertiary: "rgb(128, 81, 88)",
			onTertiary: "rgb(255, 255, 255)",
			tertiaryContainer: "rgb(255, 217, 221)",
			onTertiaryContainer: "rgb(50, 16, 23)",
			error: "rgb(186, 26, 26)",
			onError: "rgb(255, 255, 255)",
			errorContainer: "rgb(255, 218, 214)",
			onErrorContainer: "rgb(65, 0, 2)",
			background: "rgb(255, 251, 255)",
			onBackground: "rgb(29, 27, 30)",
			surface: "rgb(255, 251, 255)",
			onSurface: "rgb(29, 27, 30)",
			surfaceVariant: "rgb(233, 223, 235)",
			onSurfaceVariant: "rgb(74, 69, 78)",
			outline: "rgb(124, 117, 126)",
			outlineVariant: "rgb(204, 196, 206)",
			shadow: "rgb(0, 0, 0)",
			scrim: "rgb(0, 0, 0)",
			inverseSurface: "rgb(50, 47, 51)",
			inverseOnSurface: "rgb(245, 239, 244)",
			inversePrimary: "rgb(220, 184, 255)",
			elevation: {
				level0: "transparent",
				level1: "rgb(248, 242, 251)",
				level2: "rgb(244, 236, 248)",
				level3: "rgb(240, 231, 246)",
				level4: "rgb(239, 229, 245)",
				level5: "rgb(236, 226, 243)",
			},
			surfaceDisabled: "rgba(29, 27, 30, 0.12)",
			onSurfaceDisabled: "rgba(29, 27, 30, 0.38)",
			backdrop: "rgba(51, 47, 55, 0.4)",
		},
	};

	const CustomDarkTheme = {
		...DarkTheme,
		colors: {
			...DarkTheme.colors,
			...backgroundCard,
			primary: "rgb(220, 184, 255)",
			onPrimary: "rgb(71, 12, 122)",
			primaryContainer: "rgb(95, 43, 146)",
			onPrimaryContainer: "rgb(240, 219, 255)",
			secondary: "rgb(208, 193, 218)",
			onSecondary: "rgb(54, 44, 63)",
			secondaryContainer: "rgb(77, 67, 87)",
			onSecondaryContainer: "rgb(237, 221, 246)",
			tertiary: "rgb(243, 183, 190)",
			onTertiary: "rgb(75, 37, 43)",
			tertiaryContainer: "rgb(101, 58, 65)",
			onTertiaryContainer: "rgb(255, 217, 221)",
			error: "rgb(255, 180, 171)",
			onError: "rgb(105, 0, 5)",
			errorContainer: "rgb(147, 0, 10)",
			onErrorContainer: "rgb(255, 180, 171)",
			background: "rgb(55, 53, 60)", // Tom mais claro e suave
			onBackground: "rgb(245, 240, 245)", // Um tom muito mais claro para contraste suave
			surface: "rgb(60, 58, 65)", // Superfície também mais suave
			onSurface: "rgb(245, 240, 245)", // Contraste mais suave no texto
			surfaceVariant: "rgb(74, 69, 78)",
			onSurfaceVariant: "rgb(204, 196, 206)",
			outline: "rgb(150, 142, 152)",
			outlineVariant: "rgb(74, 69, 78)",
			shadow: "rgb(0, 0, 0)",
			scrim: "rgb(0, 0, 0)",
			inverseSurface: "rgb(240, 234, 238)", // Cor de fundo invertida mais suave
			inverseOnSurface: "rgb(50, 47, 51)",
			inversePrimary: "rgb(120, 69, 172)",
			elevation: {
				level0: "transparent",
				level1: "rgb(39, 35, 41)",
				level2: "rgb(44, 40, 48)",
				level3: "rgb(50, 44, 55)",
				level4: "rgb(52, 46, 57)",
				level5: "rgb(56, 49, 62)",
			},
			surfaceDisabled: "rgba(231, 225, 229, 0.12)",
			onSurfaceDisabled: "rgba(231, 225, 229, 0.38)",
			backdrop: "rgba(51, 47, 55, 0.4)",
		},
	};

	// Selecionar o tema atual com base no estado
	const theme = isDarkMode ? CustomDarkTheme : LightTheme;

	return (
		<ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
			<PaperProvider theme={theme}>{children}</PaperProvider>
		</ThemeContext.Provider>
	);
};
