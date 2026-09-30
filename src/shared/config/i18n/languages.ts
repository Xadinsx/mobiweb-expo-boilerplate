import { en, pt } from "./resources";

// The languages the boilerplate ships. To add one: a translation file, and one line here.
// A vendor lists the codes it ships in its vendor.json.
export const languages = {
  en: { resource: en, name: "English" },
  pt: { resource: pt, name: "Português" },
};

export type Language = keyof typeof languages;

export function isLanguage(code: string | undefined): code is Language {
  return code !== undefined && code in languages;
}

/** The buttons a language switcher shows for a vendor's supported languages. */
export function languageOptions(
  supported: string[],
): { code: Language; name: string }[] {
  return supported
    .filter(isLanguage)
    .map((code) => ({ code, name: languages[code].name }));
}
