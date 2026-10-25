import { Link } from "react-router";

import { useDisplay } from "../../context/DisplayContext";
import { useSalon } from "../../context/SalonContext";
import { adminTranslate } from "../../i18n/AdminTranslations";
import styles from "./Footer.module.css";

// Footer reuses the same translation catalog as the navigation and page content.
export default function Footer() {
    const { t, language } = useDisplay();
    const { database } = useSalon();

    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.brand}>
                    <Link to="/" className={styles.logo} aria-label={t("nav.brand")}>
                        <span>THE</span> PERFECT CUT
                    </Link>
                    <p>{t("footer.brandText")}</p>
                    <p className={styles.location}>{t("footer.location")}</p>
                </div>

                <div className={styles.hours}>
                    <h2>{t("contact.hours")}</h2>
                    {([1, 2, 3, 4, 5, 6, 0] as const).map((day) => (
                        <p key={day}>
                            {adminTranslate(language, `weekday${day}`)}
                            <span>{database.hours[day].isOpen ? `${database.hours[day].start} – ${database.hours[day].end}` : t("hours.closed")}</span>
                        </p>
                    ))}
                </div>

                <div className={styles.links}>
                    <h2>{t("footer.explore")}</h2>
                    <Link to="/">{t("nav.home")}</Link>
                    <Link to="/precios">{t("footer.services")}</Link>
                    <Link to="/contacto">{t("nav.contact")}</Link>
                    <Link to="/contacto">{t("footer.book")} <span aria-hidden="true">↗</span></Link>
                    <Link to="/admin/login">{adminTranslate(language, "access")}</Link>
                </div>
            </div>

            <div className={styles.bottom}>
                <small>© {new Date().getFullYear()} The Perfect Cut — {t("footer.demo")}</small>
                <small>{t("footer.figma")}</small>
            </div>
        </footer>
    );
}
