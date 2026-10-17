import { useState } from "react";
import { Link } from "react-router";
import { serviceCategories } from "../data/services";
import styles from "./Home.module.css";

const slides = [
  {
    image: "/images/salon-hero.webp",
    alt: "Interior elegante del salón con espejos circulares y sillones de peluquería",
    tag: "Peluquería & barbería",
    title: <>Tu estilo,<br /> nuestra esencia.</>,
    text: "Más que un corte, una experiencia. Estilo, cuidado y confianza en cada visita.",
  },
  {
    image: "/images/salon-products.webp",
    alt: "Productos de cuidado capilar junto a un espejo en el salón",
    tag: "Bienestar & estilo",
    title: <>Cada detalle<br /> cuenta.</>,
    text: "Creamos una experiencia personal y un look que refleje lo mejor de vos.",
  },
];

const features = [
  { glyph: "✧", title: "Atención personal", text: "Cada persona es única. Escuchamos lo que buscás para encontrar tu mejor versión." },
  { glyph: "◈", title: "Cuidado profesional", text: "Técnicas actuales, dedicación y productos elegidos para cuidar tu cabello." },
  { glyph: "✳", title: "Pasión por el detalle", text: "Disfrutamos de nuestro trabajo y cuidamos cada paso, desde la consulta hasta el resultado." },
];

export default function Home() {
  const [slideIndex, setSlideIndex] = useState(0);
  const currentSlide = slides[slideIndex];
  const changeSlide = (direction: number) => setSlideIndex((previous) => (previous + direction + slides.length) % slides.length);

  return (
    <>
      <section className={styles.hero} aria-label="Bienvenida a The Perfect Cut">
        <div className={styles.heroPhoto} key={slideIndex}>
          <img src={currentSlide.image} alt={currentSlide.alt} fetchPriority="high" />
        </div>
        <div className={styles.heroPanel}>
          <div className={styles.heroCopy}>
            <p className={styles.heroKicker}>{currentSlide.tag}</p>
            <h1>{currentSlide.title}</h1>
            <p className={styles.heroDescription}>{currentSlide.text}</p>
            <div className={styles.heroDivider} />
            <Link to="/contacto" className={styles.heroCta}>Reservá tu turno <span aria-hidden="true">↗</span></Link>
            <div className={styles.heroBottom}>
              <span>Guernica <b>•</b> Buenos Aires</span>
              <div className={styles.slideControls} aria-label="Cambiar imagen de portada">
                <button type="button" aria-label="Imagen anterior" onClick={() => changeSlide(-1)}>‹</button>
                <button type="button" aria-label="Imagen siguiente" onClick={() => changeSlide(1)}>›</button>
                <span className={styles.counter}>0{slideIndex + 1} / 0{slides.length}</span>
              </div>
            </div>
          </div>
        </div>
        <a href="#sobre-nosotros" className={styles.scrollHint}>Explorá <span aria-hidden="true">↓</span></a>
      </section>

      <section id="sobre-nosotros" className={styles.about}>
        <div className={styles.aboutCopy}>
          <span aria-hidden="true" className={styles.backgroundLetter}>P</span>
          <p className={styles.kicker}>Sobre nosotros</p>
          <h2>Contamos historias increíbles <em>con tu cabello.</em></h2>
          <p>Creemos que cada persona tiene un estilo único. Nuestro equipo de profesionales está comprometido con realzar tu belleza y hacer que te sientas siempre vos.</p>
          <Link to="/contacto" className={styles.outlinedLink}>Conocé nuestro salón <span aria-hidden="true">↗</span></Link>
        </div>
        <div className={styles.aboutImage}><img src="/images/hair-about.webp" alt="Cabello rubio con ondas suaves durante una sesión de peluquería" loading="lazy" /></div>
      </section>

      <section className={styles.features} aria-label="Por qué elegirnos">
        <div className={styles.featuresGrid}>
          {features.map((feature) => (
            <article key={feature.title} className={styles.feature}>
              <span aria-hidden="true" className={styles.featureGlyph}>{feature.glyph}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.services}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.kicker}>Nuestros servicios</p>
            <h2>Belleza y cuidado <em>para vos.</em></h2>
          </div>
          <Link to="/precios" className={styles.textLink}>Todos los precios <span aria-hidden="true">↗</span></Link>
        </div>
        <div className={styles.serviceGrid}>
          {serviceCategories.map((category, index) => (
            <article className={styles.serviceCard} key={category.id}>
              <Link to={`/precios#${category.id}`} aria-label={`Ver ${category.label}`} className={styles.cardImage}>
                <img src={category.image} alt={category.imageAlt} loading="lazy" />
                <span className={styles.cardIndex}>0{index + 1}</span>
              </Link>
              <div className={styles.cardBottom}>
                <h3>{category.label}</h3>
                <p>{category.intro}</p>
                <Link to={`/precios#${category.id}`} aria-label={`Descubrir ${category.label}`} className={styles.cardArrow}>↗</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.quoteBanner}>
        <div className={styles.quoteImage}><img src="/images/styling-tools.webp" alt="Tijeras y herramientas de peluquería sobre una mesa" loading="lazy" /></div>
        <div className={styles.quoteBody}>
          <p className={styles.kicker}>Una experiencia única</p>
          <h2>Tu próximo cambio <em>empieza acá.</em></h2>
          <Link to="/contacto" className={styles.filledLink}>Consultá por tu turno <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className={styles.hours}>
        <div className={styles.hoursTitle}>
          <p className={styles.kicker}>Te esperamos</p>
          <h2>Nuestros horarios</h2>
          <Link to="/contacto" className={styles.darkLink}>Consultanos <span aria-hidden="true">↗</span></Link>
        </div>
        <dl className={styles.schedule}>
          <div><dt>Lunes a viernes</dt><dd>09:00 – 20:00</dd></div>
          <div><dt>Sábados</dt><dd>09:00 – 18:00</dd></div>
          <div><dt>Domingos</dt><dd>Cerrado</dd></div>
        </dl>
      </section>

      <section className={styles.gallery}>
        <div className={styles.galleryTitle}>
          <p className={styles.kicker}>Inspiración</p>
          <h2>El arte de <em>sentirte bien.</em></h2>
          <p>Pequeños detalles, grandes transformaciones.</p>
        </div>
        <div className={styles.galleryGrid}>
          <div className={styles.gallerySmall}><img src="/images/hair-golden.webp" alt="Ondas suaves y coloración cálida" loading="lazy" /></div>
          <div className={styles.galleryLarge}><img src="/images/salon-wash.webp" alt="Sector de lavado de un salón moderno" loading="lazy" /></div>
          <div className={styles.gallerySmall}><img src="/images/salon-chair.webp" alt="Sillón de peluquería y espejos" loading="lazy" /></div>
        </div>
      </section>
    </>
  );
}
