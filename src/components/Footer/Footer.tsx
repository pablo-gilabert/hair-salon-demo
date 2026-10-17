import { Link } from "react-router";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo} aria-label="The Perfect Cut, inicio"><span>THE</span> PERFECT CUT</Link>
          <p>Tu estilo, nuestra pasión. Un espacio dedicado a que te sientas bien con vos.</p>
          <p className={styles.location}>Guernica, Buenos Aires · Ubicación ilustrativa</p>
        </div>
        <div className={styles.hours}>
          <h2>Horarios</h2>
          <p>Lunes a viernes <span>09:00 – 20:00</span></p>
          <p>Sábados <span>09:00 – 18:00</span></p>
          <p>Domingos <span>Cerrado</span></p>
        </div>
        <div className={styles.links}>
          <h2>Explorá</h2>
          <Link to="/">Inicio</Link>
          <Link to="/precios">Servicios y precios</Link>
          <Link to="/contacto">Contacto</Link>
          <Link to="/contacto">Consultar turno <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
      <div className={styles.bottom}>
        <small>© {new Date().getFullYear()} The Perfect Cut — Sitio ficticio de demostración.</small>
        <small>Inspirado en el diseño de Figma «Hair Salon Web Design».</small>
      </div>
    </footer>
  );
}
