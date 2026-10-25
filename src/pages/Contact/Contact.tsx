import { Link } from "react-router";

import BookingForm from "../../components/BookingForm/BookingForm";
import { useDisplay } from "../../context/DisplayContext";
import { useSalon } from "../../context/SalonContext";
import { adminTranslate } from "../../i18n/AdminTranslations";
import styles from "./Contact.module.css";

// Contact page combines a local-only inquiry form and explicitly fictional business details.
export default function Contact() {
    const { t, language } = useDisplay();
    const { database } = useSalon();

    return (
        <>
            {/* Hero: introduction and anchor to the inquiry form. */}
            <section className={styles.hero}>
                <img
                    src="/images/salon-chair.webp"
                    alt={t("contact.heroAlt")}
                    className={styles.heroImage}
                />
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <p className={styles.eyebrow}>{t("contact.heroTag")}</p>
                    <h1>{t("contact.heroTitle")} <em>{t("contact.heroEm")}</em></h1>
                    <p>{t("contact.heroDesc")}</p>
                    <a href="#escribinos" className={styles.heroLink}>
                        {t("contact.write")} <span aria-hidden="true">↓</span>
                    </a>
                </div>
            </section>

            {/* Booking form: appointments persist locally but never leave this browser. */}
            <section className={styles.contactMain} id="escribinos">
                <div className={styles.picturePane}>
                    <img src="/images/hair-golden.webp" alt={t("contact.photoAlt")} loading="lazy" />
                    <div className={styles.pictureQuote}>
                        <p className={styles.eyebrow}>The Perfect Cut</p>
                        <h2>{t("contact.photoTitle")} <em>{t("contact.photoEm")}</em></h2>
                        <p>{t("contact.photoDesc")}</p>
                    </div>
                </div>
                <BookingForm />
            </section>

            {/* Business details: all addresses and schedules are sample content. */}
            <section className={styles.information}>
                <div className={styles.informationTitle}>
                    <p className={styles.eyebrow}>{t("contact.infoTag")}</p>
                    <h2>{t("contact.infoTitle")} <em>{t("contact.infoEm")}</em></h2>
                    <p>{t("contact.infoDesc")}</p>
                </div>
                <div className={styles.infoGrid}>
                    <article>
                        <div className={styles.icon} aria-hidden="true">⌖</div>
                        <h3>{t("contact.location")}</h3>
                        <p>Guernica, Buenos Aires<br />Argentina</p>
                        <small>{t("contact.exampleAddress")}</small>
                    </article>
                    <article>
                        <div className={styles.icon} aria-hidden="true">◷</div>
                        <h3>{t("contact.hours")}</h3>
                        <p>
                            {([1, 2, 3, 4, 5, 6, 0] as const).map((day) => (
                                <span key={day}>
                                    {adminTranslate(language, `weekday${day}`)}: {database.hours[day].isOpen ? `${database.hours[day].start} – ${database.hours[day].end}` : t("hours.closed")}<br />
                                </span>
                            ))}
                        </p>
                        <small>{t("contact.exampleHours")}</small>
                    </article>
                    <article>
                        <div className={styles.icon} aria-hidden="true">✉</div>
                        <h3>{t("contact.inquiries")}</h3>
                        <p>{t("contact.inquiriesDesc")}</p>
                        <small>{t("contact.noMessages")}</small>
                    </article>
                </div>
            </section>

            {/* Closing CTA: link visitors back to the price catalog. */}
            <section className={styles.cta}>
                <div>
                    <p className={styles.eyebrow}>{t("contact.ctaTag")}</p>
                    <h2>{t("contact.ctaTitle")} <em>{t("contact.ctaEm")}</em></h2>
                </div>
                <Link to="/precios">
                    {t("contact.ctaLink")} <span aria-hidden="true">↗</span>
                </Link>
            </section>
        </>
    );
}
