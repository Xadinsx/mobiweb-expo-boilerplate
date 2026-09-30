import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { storage } from "../../lib";

import { en, pt } from "./resources";

export type Language = "en" | "pt";

export function getInitialLanguage(): Language {
  const stored = storage.getString("language");
  if (stored === "en" || stored === "pt") {
    return stored;
  }
  return getLocales()[0]?.languageCode === "pt" ? "pt" : "en";
}

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, pt: { translation: pt } },
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export function setLanguage(language: Language) {
  void i18n.changeLanguage(language);
  storage.setString("language", language);
}
