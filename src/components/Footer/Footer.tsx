import { Link } from "react-router";

import { useDisplay } from "../../context/DisplayContext";
import styles from "./Footer.module.css";

// Footer reuses the same translation catalog as the navigation and page content.
export default function Footer() {
    const { t } = useDisplay();

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
                    <p>{t("hours.week")} <span>09:00 – 20:00</span></p>
                    <p>{t("hours.sat")} <span>09:00 – 18:00</span></p>
                    <p>{t("hours.sun")} <span>{t("hours.closed")}</span></p>
                </div>

                <div className={styles.links}>
                    <h2>{t("footer.explore")}</h2>
                    <Link to="/">{t("nav.home")}</Link>
                    <Link to="/precios">{t("footer.services")}</Link>
                    <Link to="/contacto">{t("nav.contact")}</Link>
                    <Link to="/contacto">{t("footer.book")} <span aria-hidden="true">↗</span></Link>
                </div>
            </div>

            <div className={styles.bottom}>
                <small>© {new Date().getFullYear()} The Perfect Cut — {t("footer.demo")}</small>
                <small>{t("footer.figma")}</small>
            </div>
        </footer>
    );
}
