import { useEffect } from "react";
import { Link, useLocation } from "react-router";

import { useDisplay } from "../../context/DisplayContext";
import { FormatPrice, ServiceCategories } from "../../data/services";
import styles from "./Pricing.module.css";

// The services page is generated from one bilingual catalog with illustrative ARS prices.
export default function Pricing() {
    const location = useLocation();
    const { language, t } = useDisplay();

    // Scroll to the service category selected from the landing page.
    useEffect(() => {
        if (!location.hash) return;

        const sectionId = location.hash.slice(1);
        const animationFrame = requestAnimationFrame(() => {
            document.getElementById(sectionId)?.scrollIntoView({ block: "start" });
        });

        return () => cancelAnimationFrame(animationFrame);
    }, [location.hash]);

    return (
        <>
            {/* Hero: overview and direct link to the price list. */}
            <section className={styles.hero}>
                <div className={styles.heroImage}>
                    <img src="/images/salon-products.webp" alt={t("pricing.heroAlt")} />
                </div>
                <div className={styles.heroContent}>
                    <p className={styles.eyebrow}>{t("home.servicesTag")}</p>
                    <h1>{t("pricing.heroTitle")} <em>{t("pricing.heroEm")}</em></h1>
                    <p>{t("pricing.heroDesc")}</p>
                    <a href="#lista-precios" className={styles.heroLink}>
                        {t("pricing.explore")} <span aria-hidden="true">↓</span>
                    </a>
                </div>
            </section>

            {/* Intro: price disclaimer makes the portfolio-demo status explicit. */}
            <section className={styles.intro} id="lista-precios">
                <div className={styles.introContent}>
                    <p className={styles.eyebrow}>{t("pricing.listTag")}</p>
                    <h2>{t("pricing.listTitle")}<br /> <em>{t("pricing.listEm")}</em></h2>
                    <p>{t("pricing.intro")}</p>
                    <span className={styles.smallNote}>{t("pricing.note")}</span>
                </div>
                <div className={styles.introAside}>
                    <span>01 / 03</span>
                    <p>{t("pricing.types")}</p>
                </div>
            </section>

            {/* Categories: localized descriptions and stable internal booking identifiers. */}
            <div className={styles.categories}>
                {ServiceCategories.map((category, index) => (
                    <section
                        key={category.id}
                        id={category.id}
                        className={`${styles.category} ${index % 2 ? styles.reverse : ""}`}
                    >
                        <div className={styles.categoryContent}>
                            <div className={styles.categoryHeader}>
                                <div>
                                    <p className={styles.eyebrow}>0{index + 1} / 03 — {t("pricing.section")}</p>
                                    <h2>{category.label[language]}</h2>
                                </div>
                                <p>{category.intro[language]}</p>
                            </div>
                            <div className={styles.priceList}>
                                {category.services.map((service) => (
                                    <div className={styles.priceRow} key={service.id}>
                                        <div>
                                            <h3>{service.name[language]}</h3>
                                            <p>{service.description[language]}</p>
                                        </div>
                                        <span>{FormatPrice(service.price, language)}</span>
                                    </div>
                                ))}
                            </div>
                            <Link
                                className={styles.bookLink}
                                to={`/contacto?servicio=${category.bookingValue}`}
                            >
                                {t("pricing.book")} <span aria-hidden="true">↗</span>
                            </Link>
                        </div>
                        <div className={styles.categoryVisual}>
                            <img src={category.image} alt={category.imageAlt[language]} loading="lazy" />
                            <span className={styles.visualLabel}>The Perfect Cut · 0{index + 1}</span>
                        </div>
                    </section>
                ))}
            </div>

            {/* Closing CTA: gives prospective customers another path to the inquiry demo. */}
            <section className={styles.pricingCta}>
                <div className={styles.pricingCtaImage}>
                    <img src="/images/salon-chair.webp" alt={t("contact.heroAlt")} loading="lazy" />
                </div>
                <div className={styles.pricingCtaContent}>
                    <p className={styles.eyebrow}>{t("pricing.ctaTag")}</p>
                    <h2>{t("pricing.ctaTitle")} <em>{t("pricing.ctaEm")}</em></h2>
                    <p>{t("pricing.ctaDesc")}</p>
                    <Link to="/contacto">
                        {t("pricing.ctaLink")} <span aria-hidden="true">↗</span>
                    </Link>
                </div>
            </section>
        </>
    );
}
