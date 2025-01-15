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

    const theme = {
        dark: {
            primary: "#8A2BE2", // Roxo Médio (forte, criativo e com bastante presença)
            secondary: "#cc96cc", // Rosa Vivid (vivaz e marcante, complementando o roxo)
            background: "#1A1A2E", // Azul Escuro Profundo (sofisticado e ideal para leitura em fundo escuro)
            textButton: "#FFFFFF", // Branco (contraste claro e limpo)
            textPrimary: "#EAEAEA", // Cinza Muito Claro (legibilidade em fundos escuros)
            textSecondary: "#B5B5C3", // Cinza Médio (neutro e suave)
            success: "#7AC074", // Verde Menta (energia positiva e saúde)
            error: "#F28C8C", // Rosa Coral Suave (sinalização de erro clara, mas amigável)
        },
        light: {
            primary: "#9B59B6", // Roxo Claro (forte e criativo)
            secondary: "#D4A5D9", // Lilás (delicado e acolhedor)
            background: "#F0F0F0", // Cinza Claro (para fundo claro e confortável)
            textButton: "#FFFFFF", // Branco (para contraste com botões coloridos)
            textPrimary: "#2C2C34", // Grafite Suave (legibilidade em fundos claros)
            textSecondary: "#73737D", // Cinza Neutro (complementar ao grafite)
            success: "#A8E6CF", // Verde Pastel Claro (sensação de saúde e bem-estar)
            error: "#FF6F61", // Vermelho Coral Suave (alerta, mas sem ser agressivo)
        },
    };

    return (
        <ThemeContext.Provider value={{ theme: isDarkMode ? theme.dark : theme.light, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
