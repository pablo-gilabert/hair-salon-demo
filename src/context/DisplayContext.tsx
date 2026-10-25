import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import { translate, type Language, type TranslationKey } from "../i18n/Translations";

export type Theme = "dark" | "light";

type DisplaySettings = {
    language: Language;
    theme: Theme;
    setLanguage: (value: Language) => void;
    toggleTheme: () => void;
    t: (key: TranslationKey) => string;
};

const DisplayContext = createContext<DisplaySettings | null>(null);

// Read persisted user preferences while safely falling back to Spanish and dark mode.
function readPreference<T extends string>(key: string, options: readonly T[], fallback: T): T {
    try {
        const stored = localStorage.getItem(key);
        return options.find((option) => option === stored) ?? fallback;
    } catch {
        return fallback;
    }
}

export function DisplayProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>(() =>
        readPreference("perfect-cut-language", ["es", "en"], "es"),
    );

    const [theme, setTheme] = useState<Theme>(() =>
        readPreference("perfect-cut-theme", ["dark", "light"], "dark"),
    );

    // Keep document accessibility attributes and theme variables in sync.
    useEffect(() => {
        document.documentElement.lang = language === "es" ? "es-AR" : "en";
        document.documentElement.dataset.theme = theme;
        document.querySelector('meta[name="theme-color"]')?.setAttribute(
            "content",
            theme === "dark" ? "#080e11" : "#f9f6f1",
        );
        try {
            localStorage.setItem("perfect-cut-language", language);
            localStorage.setItem("perfect-cut-theme", theme);
        } catch {
            // The demo also works when local storage is disabled.
        }
    }, [language, theme]);

    const value = useMemo<DisplaySettings>(() => ({
        language,
        theme,
        setLanguage,
        toggleTheme: () => setTheme((current) => current === "dark" ? "light" : "dark"),
        t: (key) => translate(language, key),
    }), [language, theme]);

    return <DisplayContext.Provider value={value}>{children}</DisplayContext.Provider>;
}

export function useDisplay(): DisplaySettings {
    const context = useContext(DisplayContext);

    if (!context) {
        throw new Error("useDisplay must be used inside DisplayProvider.");
    }

    return context;
}
