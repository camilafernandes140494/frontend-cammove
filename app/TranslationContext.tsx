// src/context/TranslationContext.tsx
import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';

const TranslationContext = createContext<any>(null);

// Defina o tipo 'children' como React.ReactNode
interface TranslationProviderProps {
    children: React.ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
    const { t, i18n } = useTranslation();

    return (
        <TranslationContext.Provider value={{ t, i18n }}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslationContext = () => {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslationContext must be used within a TranslationProvider');
    }
    return context;
};

export default TranslationProvider;
