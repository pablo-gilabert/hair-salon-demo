import { Link, useLocation } from "react-router";
import { useEffect } from "react";
import { formatPrice, serviceCategories } from "../data/services";
import styles from "./Pricing.module.css";

export default function Pricing() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.slice(1);
      requestAnimationFrame(() => document.getElementById(sectionId)?.scrollIntoView({ block: "start" }));
    }
  }, [location.hash]);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroImage}><img src="/images/salon-products.webp" alt="Productos profesionales de peluquería junto a un espejo" /></div>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Nuestros servicios</p>
          <h1>Belleza a tu <em>medida.</em></h1>
          <p>Elegí tu próximo cambio. Conocé nuestras propuestas de corte, color y cuidado capilar.</p>
          <a href="#lista-precios" className={styles.heroLink}>Explorar precios <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section className={styles.intro} id="lista-precios">
        <div className={styles.introContent}>
          <p className={styles.eyebrow}>Lista de precios</p>
          <h2>La mejor versión<br /> <em>de vos.</em></h2>
          <p>Servicios personalizados para que encuentres exactamente lo que necesitás.</p>
          <span className={styles.smallNote}>Precios ilustrativos en pesos argentinos. No corresponden a un salón real.</span>
        </div>
        <div className={styles.introAside}><span>01 / 03</span><p>Cortes · Coloración · Tratamientos</p></div>
      </section>

      <div className={styles.categories}>
        {serviceCategories.map((category, index) => (
          <section className={`${styles.category} ${index % 2 ? styles.reverse : ""}`} id={category.id} key={category.id}>
            <div className={styles.categoryContent}>
              <div className={styles.categoryHeader}>
                <div><p className={styles.eyebrow}>0{index + 1} / 03 — Servicios</p><h2>{category.label}</h2></div>
                <p>{category.intro}</p>
              </div>
              <div className={styles.priceList}>
                {category.services.map((service) => (
                  <div className={styles.priceRow} key={service.name}>
                    <div><h3>{service.name}</h3><p>{service.description}</p></div>
                    <span>{formatPrice(service.price)}</span>
                  </div>
                ))}
              </div>
              <Link className={styles.bookLink} to={`/contacto?servicio=${encodeURIComponent(index === 0 ? "Corte" : index === 1 ? "Coloración" : "Tratamientos")}`}>Consultar por este servicio <span aria-hidden="true">↗</span></Link>
            </div>
            <div className={styles.categoryVisual}>
              <img src={category.image} alt={category.imageAlt} loading="lazy" />
              <span className={styles.visualLabel}>The Perfect Cut · 0{index + 1}</span>
            </div>
          </section>
        ))}
      </div>

      <section className={styles.pricingCta}>
        <div className={styles.pricingCtaImage}><img src="/images/salon-chair.webp" alt="Interior de salón de peluquería con sillones y espejos" loading="lazy" /></div>
        <div className={styles.pricingCtaContent}><p className={styles.eyebrow}>¿Tenés dudas?</p><h2>Un buen cambio empieza por <em>una charla.</em></h2><p>Contanos qué te gustaría hacer y te ayudamos a elegir tu próximo look.</p><Link to="/contacto">Contactanos <span aria-hidden="true">↗</span></Link></div>
      </section>
    </>
  );
}
