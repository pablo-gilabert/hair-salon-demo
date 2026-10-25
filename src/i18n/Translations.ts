import { English } from "./English";
import { Spanish } from "./Spanish";

// A shared key set ensures that every visible message is available in both languages.
export type TranslationKey = keyof typeof Spanish;
export type Language = "es" | "en";

const translations: Record<Language, Record<TranslationKey, string>> = {
    es: Spanish,
    en: English,
};

export function translate(language: Language, key: TranslationKey): string {
    return translations[language][key];
}
