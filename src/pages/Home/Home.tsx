import { useState } from "react";
import { Link } from "react-router";

import { useDisplay } from "../../context/DisplayContext";
import { useSalon } from "../../context/SalonContext";
import { adminTranslate } from "../../i18n/AdminTranslations";
import styles from "./Home.module.css";

// The landing page preserves the original editorial design and image slideshow.
export default function Home() {
    const [slideIndex, setSlideIndex] = useState(0);
    const { language, t } = useDisplay();
    const { database } = useSalon();

    // Store each slide's image and translation keys instead of embedding localized JSX.
    const slides = [
        {
            image: "/images/salon-hero.webp",
            alt: t("home.slideOneAlt"),
            tag: t("home.slideOneTag"),
            title: t("home.slideOneTitle"),
            emphasis: t("home.slideOneEm"),
            description: t("home.slideOneDesc"),
        },
        {
            image: "/images/salon-products.webp",
            alt: t("home.slideTwoAlt"),
            tag: t("home.slideTwoTag"),
            title: t("home.slideTwoTitle"),
            emphasis: t("home.slideTwoEm"),
            description: t("home.slideTwoDesc"),
        },
    ];

    const features = [
        { glyph: "✧", title: t("home.featureOneTitle"), description: t("home.featureOneDesc") },
        { glyph: "◈", title: t("home.featureTwoTitle"), description: t("home.featureTwoDesc") },
        { glyph: "✳", title: t("home.featureThreeTitle"), description: t("home.featureThreeDesc") },
    ];

    const currentSlide = slides[slideIndex]!;

    const changeSlide = (direction: number) => {
        setSlideIndex((previous) => (previous + direction + slides.length) % slides.length);
    };

    return (
        <>
            {/* Hero: image carousel, brand positioning and primary booking action. */}
            <section className={styles.hero} aria-label={t("home.heroAria")}>
                <div className={styles.heroPhoto} key={slideIndex}>
                    <img src={currentSlide.image} alt={currentSlide.alt} fetchPriority="high" />
                </div>
                <div className={styles.heroPanel}>
                    <div className={styles.heroCopy}>
                        <p className={styles.heroKicker}>{currentSlide.tag}</p>
                        <h1>{currentSlide.title}<br /> <em>{currentSlide.emphasis}</em></h1>
                        <p className={styles.heroDescription}>{currentSlide.description}</p>
                        <div className={styles.heroDivider} />
                        <Link to="/contacto" className={styles.heroCta}>
                            {t("nav.booking")} <span aria-hidden="true">↗</span>
                        </Link>
                        <div className={styles.heroBottom}>
                            <span>Guernica <b>•</b> Buenos Aires</span>
                            <div className={styles.slideControls} aria-label={t("home.slides")}>
                                <button type="button" aria-label={t("home.previous")} onClick={() => changeSlide(-1)}>‹</button>
                                <button type="button" aria-label={t("home.next")} onClick={() => changeSlide(1)}>›</button>
                                <span className={styles.counter}>0{slideIndex + 1} / 0{slides.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <a href="#sobre-nosotros" className={styles.scrollHint}>
                    {t("home.explore")} <span aria-hidden="true">↓</span>
                </a>
            </section>

            {/* About: salon philosophy paired with original photography. */}
            <section id="sobre-nosotros" className={styles.about}>
                <div className={styles.aboutCopy}>
                    <span aria-hidden="true" className={styles.backgroundLetter}>P</span>
                    <p className={styles.kicker}>{t("home.aboutTag")}</p>
                    <h2>{t("home.aboutTitle")} <em>{t("home.aboutEm")}</em></h2>
                    <p>{t("home.aboutDesc")}</p>
                    <Link to="/contacto" className={styles.outlinedLink}>
                        {t("home.aboutLink")} <span aria-hidden="true">↗</span>
                    </Link>
                </div>
                <div className={styles.aboutImage}>
                    <img src="/images/hair-about.webp" alt={t("home.aboutAlt")} loading="lazy" />
                </div>
            </section>

            {/* Feature cards: three concise service principles. */}
            <section className={styles.features} aria-label={t("home.featuresAria")}>
                <div className={styles.featuresGrid}>
                    {features.map((feature) => (
                        <article className={styles.feature} key={feature.title}>
                            <span className={styles.featureGlyph} aria-hidden="true">{feature.glyph}</span>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* Services: shared catalog links directly to the corresponding pricing sections. */}
            <section className={styles.services}>
                <div className={styles.sectionHead}>
                    <div>
                        <p className={styles.kicker}>{t("home.servicesTag")}</p>
                        <h2>{t("home.servicesTitle")} <em>{t("home.servicesEm")}</em></h2>
                    </div>
                    <Link to="/precios" className={styles.textLink}>
                        {t("home.allPrices")} <span aria-hidden="true">↗</span>
                    </Link>
                </div>
                <div className={styles.serviceGrid}>
                    {database.categories.map((category, index) => (
                        <article className={styles.serviceCard} key={category.id}>
                            <Link
                                to={`/precios#${category.id}`}
                                aria-label={`${t("home.viewService")} ${category.label[language]}`}
                                className={styles.cardImage}
                            >
                                <img src={category.image} alt={category.imageAlt[language]} loading="lazy" />
                                <span className={styles.cardIndex}>0{index + 1}</span>
                            </Link>
                            <div className={styles.cardBottom}>
                                <h3>{category.label[language]}</h3>
                                <p>{category.intro[language]}</p>
                                <Link
                                    to={`/precios#${category.id}`}
                                    aria-label={`${t("home.discoverService")} ${category.label[language]}`}
                                    className={styles.cardArrow}
                                >↗</Link>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Mid-page call to action with photographic visual treatment. */}
            <section className={styles.quoteBanner}>
                <div className={styles.quoteImage}>
                    <img src="/images/styling-tools.webp" alt={t("home.quoteAlt")} loading="lazy" />
                </div>
                <div className={styles.quoteBody}>
                    <p className={styles.kicker}>{t("home.quoteTag")}</p>
                    <h2>{t("home.quoteTitle")} <em>{t("home.quoteEm")}</em></h2>
                    <Link to="/contacto" className={styles.filledLink}>
                        {t("home.quoteLink")} <span aria-hidden="true">↗</span>
                    </Link>
                </div>
            </section>

            {/* Opening hours: illustrative schedule shared with the footer. */}
            <section className={styles.hours}>
                <div className={styles.hoursTitle}>
                    <p className={styles.kicker}>{t("home.hoursTag")}</p>
                    <h2>{t("home.hoursTitle")}</h2>
                    <Link to="/contacto" className={styles.darkLink}>
                        {t("home.ask")} <span aria-hidden="true">↗</span>
                    </Link>
                </div>
                <dl className={styles.schedule}>
                    {([1, 2, 3, 4, 5, 6, 0] as const).map((day) => (
                        <div key={day}>
                            <dt>{adminTranslate(language, `weekday${day}`)}</dt>
                            <dd>{database.hours[day].isOpen ? `${database.hours[day].start} – ${database.hours[day].end}` : t("hours.closed")}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            {/* Gallery: three curated photos from the original demo. */}
            <section className={styles.gallery}>
                <div className={styles.galleryTitle}>
                    <p className={styles.kicker}>{t("home.galleryTag")}</p>
                    <h2>{t("home.galleryTitle")} <em>{t("home.galleryEm")}</em></h2>
                    <p>{t("home.galleryDesc")}</p>
                </div>
                <div className={styles.galleryGrid}>
                    <div className={styles.gallerySmall}>
                        <img src="/images/hair-golden.webp" alt={t("home.galleryAltOne")} loading="lazy" />
                    </div>
                    <div className={styles.galleryLarge}>
                        <img src="/images/salon-wash.webp" alt={t("home.galleryAltTwo")} loading="lazy" />
                    </div>
                    <div className={styles.gallerySmall}>
                        <img src="/images/salon-chair.webp" alt={t("home.galleryAltThree")} loading="lazy" />
                    </div>
                </div>
            </section>
        </>
    );
}
