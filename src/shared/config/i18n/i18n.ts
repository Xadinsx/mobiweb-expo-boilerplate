import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { storage } from "../../lib";
import { vendor } from "../vendor";

import { isLanguage, languages } from "./languages";
import { resolveInitialLanguage } from "./resolve-language";

const unknown = vendor.languages.supported.filter((code) => !isLanguage(code));
if (unknown.length > 0) {
  throw new Error(
    `The vendor lists languages with no translation: ${unknown.join(", ")}. ` +
      "Add a translation file and a line in languages.ts.",
  );
}

void i18n.use(initReactI18next).init({
  resources: Object.fromEntries(
    vendor.languages.supported
      .filter(isLanguage)
      .map((code) => [code, { translation: languages[code].resource }]),
  ),
  lng: resolveInitialLanguage(
    vendor.languages,
    storage.getString("language"),
    getLocales()[0]?.languageCode,
  ),
  fallbackLng: vendor.languages.default,
  interpolation: { escapeValue: false },
});

/** Switches the language, when the vendor supports it and lets users choose. */
export function setLanguage(code: string) {
  if (
    !vendor.languages.userChoice ||
    !vendor.languages.supported.includes(code)
  ) {
    return;
  }
  void i18n.changeLanguage(code);
  storage.setString("language", code);
}
