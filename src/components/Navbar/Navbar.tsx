import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";

import { useDisplay } from "../../context/DisplayContext";
import DisplayControls from "../DisplayControls/DisplayControls";
import styles from "./Navbar.module.css";

// Nav labels are localized while the underlying route paths stay unchanged.
const navigation = [
    { key: "nav.home", path: "/" },
    { key: "nav.pricing", path: "/precios" },
    { key: "nav.contact", path: "/contacto" },
] as const;

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const { t } = useDisplay();

    // Close the mobile menu on navigation or when the user presses Escape.
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!isMenuOpen) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsMenuOpen(false);
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isMenuOpen]);

    return (
        <header
            className={`${styles.header} ${location.pathname === "/contacto" ? styles.contactHeader : ""} ${isMenuOpen ? styles.menuExpanded : ""}`}
        >
            <div className={styles.inner}>
                <Link to="/" aria-label={t("nav.brand")} className={styles.logo}>
                    <span className={styles.logoWord}>THE</span>
                    <span>PERFECT CUT</span>
                </Link>

                <div className={styles.actions}>
                    <DisplayControls />
                    <button
                        type="button"
                        className={`${styles.menuButton} ${isMenuOpen ? styles.menuButtonActive : ""}`}
                        onClick={() => setIsMenuOpen((open) => !open)}
                        aria-expanded={isMenuOpen}
                        aria-controls="primary-navigation"
                        aria-label={isMenuOpen ? t("nav.menuClose") : t("nav.menuOpen")}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>

                <nav
                    id="primary-navigation"
                    aria-label={t("nav.aria")}
                    className={`${styles.navigation} ${isMenuOpen ? styles.open : ""}`}
                >
                    {navigation.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/"}
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }: { isActive: boolean }) => `${styles.navLink} ${isActive ? styles.active : ""}`}
                        >
                            {t(item.key)}
                        </NavLink>
                    ))}
                    <Link
                        to="/contacto"
                        className={styles.mobileBooking}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {t("nav.booking")} <span aria-hidden="true">↗</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
