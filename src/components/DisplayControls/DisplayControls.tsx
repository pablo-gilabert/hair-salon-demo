import { useEffect, useRef, useState } from "react";
import { useDisplay } from "../../context/DisplayContext";
import styles from "./DisplayControls.module.css";

// Shared language selector and theme switch appear consistently on every route.
export default function DisplayControls() {
    const { language, theme, setLanguage, toggleTheme, t } = useDisplay();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Dismiss the language popup when focus moves away or Escape is pressed.
    useEffect(() => {
        if (!menuOpen) return;

        const handleOutsideClick = (event: MouseEvent) => {
            if (!menuRef.current?.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setMenuOpen(false);
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [menuOpen]);

    const flag = language === "es" ? "/flags/Spain.svg" : "/flags/UnitedKingdom.svg";

    return (
        <div className={styles.controls}>
            <div ref={menuRef} className={styles.languageWrapper}>
                <button
                    type="button"
                    className={styles.languageButton}
                    onClick={() => setMenuOpen((previous) => !previous)}
                    aria-expanded={menuOpen}
                    aria-label={t("controls.language")}
                    aria-haspopup="listbox"
                >
                    <img className={styles.flag} src={flag} alt="" />
                    <span>{language === "es" ? "ESP" : "EN"}</span>
                    <span className={styles.chevron} aria-hidden="true">⌄</span>
                </button>
                {menuOpen && (
                    <div className={styles.languageMenu} role="listbox" aria-label={t("controls.language")}>
                        {(["es", "en"] as const).map((option) => (
                            <button
                                type="button"
                                role="option"
                                aria-selected={language === option}
                                className={styles.languageOption}
                                onClick={() => {
                                    setLanguage(option);
                                    setMenuOpen(false);
                                }}
                                key={option}
                            >
                                <img
                                    className={styles.flag}
                                    src={option === "es" ? "/flags/Spain.svg" : "/flags/UnitedKingdom.svg"}
                                    alt=""
                                />
                                {option === "es" ? "ESP" : "EN"}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <button
                type="button"
                className={styles.themeButton}
                onClick={toggleTheme}
                aria-label={t("controls.theme")}
                title={theme === "dark" ? t("controls.light") : t("controls.dark")}
                aria-pressed={theme === "light"}
            >
                <svg className={styles.themeIcon} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {theme === "dark" ? (
                        <path d="M20.8 14a9 9 0 0 1-10.8-10.8A9 9 0 1 0 20.8 14Z" />
                    ) : (
                        <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></>
                    )}
                </svg>
                <span className={styles.switchTrack}><span className={styles.switchThumb} /></span>
            </button>
        </div>
    );
}
