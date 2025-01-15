// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

// Importar os arquivos de tradução
import en from "@/locales/en-US.json";
import pt from "@/locales/pt-BR.json";

i18n
  .use(HttpBackend) // Para carregar traduções de arquivos
  .use(LanguageDetector) // Para detectar a linguagem do dispositivo
  .use(initReactI18next) // Para integrar com React
  .init({
    fallbackLng: "pt", // Linguagem padrão
    lng: "pt", // Linguagem inicial
    resources: {
      en: { translation: en },
      pt: { translation: pt },
    },
    interpolation: {
      escapeValue: false, // React já faz escaping
    },

    detection: {
      // Configuração do detector
      order: ["path", "querystring", "localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
