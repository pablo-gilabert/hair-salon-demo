import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import styles from "./NavBar.module.css";

const navigation = [
  { label: "Inicio", path: "/" },
  { label: "Precios", path: "/precios" },
  { label: "Contacto", path: "/contacto" },
];

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isMenuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" aria-label="The Perfect Cut, ir al inicio" className={styles.logo}>
          <span className={styles.logoWord}>THE</span>
          <span>PERFECT CUT</span>
        </Link>

        <button
          type="button"
          className={`${styles.menuButton} ${isMenuOpen ? styles.menuButtonActive : ""}`}
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="primary-navigation" aria-label="Navegación principal" className={`${styles.navigation} ${isMenuOpen ? styles.open : ""}`}>
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/contacto" className={styles.mobileBooking} onClick={() => setIsMenuOpen(false)}>
            Reservá tu turno <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
