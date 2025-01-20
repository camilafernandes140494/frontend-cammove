// ThemeContext.js
import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext<any>(null);

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => setIsDarkMode(prevMode => !prevMode);

    const colorsCommon = {
        white: "#FFFFFF", // Cor branca comum
        black: "#000000", // Cor preta comum
    };

    const theme = {
        dark: {
            ...colorsCommon,
            primary: "#6A4C9C", // Roxo Suave
            secondary: "#B8A9C9", // Lilás Suave
            background: "#aaaaaa", // Azul Escuro Profundo
            textButton: "#FFFFFF",
            textPrimary: "#E5E5E5", // Cinza Claro
            textSecondary: "#B5B5C3", // Cinza Médio
            success: "#7AC074", // Verde Menta
            error: "#F28C8C", // Rosa Coral Suave
        },
        light: {
            ...colorsCommon,
            primary: "#D6A4D4", // Lavanda Claro
            secondary: "#D4A5D9", // Lilás Delicado
            background: "#F0F0F0", // Cinza Claro
            textButton: "#FFFFFF",
            textPrimary: "#3C3C3C", // Cinza Médio
            textSecondary: "#73737D", // Cinza Neutro
            success: "#A8E6CF", // Verde Pastel Claro
            error: "#FF6F61", // Vermelho Coral Suave
        },
    };
    return (
        <ThemeContext.Provider value={{ theme: isDarkMode ? theme.dark : theme.light, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
