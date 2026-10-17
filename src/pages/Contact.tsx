import { Link } from "react-router";
import BookingForm from "../components/BookingForm/BookingForm";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <>
      <section className={styles.hero}>
        <img src="/images/salon-chair.webp" alt="Sillón de peluquería en un salón moderno" className={styles.heroImage} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Nos encantaría conocerte</p>
          <h1>Hablemos de <em>tu próximo look.</em></h1>
          <p>¿Tenés una idea en mente o necesitás asesoramiento? Estamos para escucharte.</p>
          <a href="#escribinos" className={styles.heroLink}>Escribinos <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section className={styles.contactMain} id="escribinos">
        <div className={styles.picturePane}>
          <img src="/images/hair-golden.webp" alt="Cabello con ondas durante una sesión de peluquería" loading="lazy" />
          <div className={styles.pictureQuote}><p className={styles.eyebrow}>The Perfect Cut</p><h2>Nos encantaría <em>saber de vos.</em></h2><p>Cada gran cambio comienza con una conversación.</p></div>
        </div>
        <BookingForm />
      </section>

      <section className={styles.information}>
        <div className={styles.informationTitle}><p className={styles.eyebrow}>Dónde encontrarnos</p><h2>Un lugar para <em>sentirte vos.</em></h2><p>Esta web presenta un salón ficticio creado como demostración de desarrollo web.</p></div>
        <div className={styles.infoGrid}>
          <article><div className={styles.icon} aria-hidden="true">⌖</div><h3>Ubicación</h3><p>Guernica, Buenos Aires<br />Argentina</p><small>Dirección de ejemplo</small></article>
          <article><div className={styles.icon} aria-hidden="true">◷</div><h3>Horarios</h3><p>Lunes a viernes: 09:00 – 20:00<br />Sábados: 09:00 – 18:00</p><small>Horarios ilustrativos</small></article>
          <article><div className={styles.icon} aria-hidden="true">✉</div><h3>Consultas</h3><p>El formulario permite probar la experiencia de contacto.</p><small>No se envían mensajes reales</small></article>
        </div>
      </section>

      <section className={styles.cta}>
        <div><p className={styles.eyebrow}>Elegí tu experiencia</p><h2>Conocé lo que <em>podemos hacer.</em></h2></div>
        <Link to="/precios">Ver servicios y precios <span aria-hidden="true">↗</span></Link>
      </section>
    </>
  );
}
