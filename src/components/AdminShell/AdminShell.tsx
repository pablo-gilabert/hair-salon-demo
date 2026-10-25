import { NavLink, Outlet, useNavigate } from "react-router";

import { useDisplay } from "../../context/DisplayContext";
import { useSalon } from "../../context/SalonContext";
import { adminTranslate } from "../../i18n/AdminTranslations";
import DisplayControls from "../DisplayControls/DisplayControls";
import styles from "./AdminShell.module.css";

// The admin shell is deliberately separate from the photographic public-site navigation.
export default function AdminShell() {
    const { language } = useDisplay();
    const { logout } = useSalon();
    const navigate = useNavigate();
    const a = (key: Parameters<typeof adminTranslate>[1]) => adminTranslate(language, key);

    return (
        <div className={styles.shell}>
            <header className={styles.header}>
                <NavLink to="/" className={styles.brand} aria-label="The Perfect Cut">✧ THE PERFECT CUT <span>{a("demoTag")}</span></NavLink>
                <div className={styles.actions}>
                    <DisplayControls />
                    <button type="button" className={styles.textButton} onClick={() => { logout(); navigate("/admin/login", { replace: true }); }}>
                        {a("logout")}
                    </button>
                </div>
            </header>
            <div className={styles.layout}>
                <aside className={styles.sidebar} aria-label={a("panel")}>
                    <strong>{a("panel")}</strong>
                    <NavLink to="/admin/turnos" className={({ isActive }: { isActive: boolean }) => isActive ? styles.active : styles.link}>{a("appointments")}</NavLink>
                    <NavLink to="/admin/horarios" className={({ isActive }: { isActive: boolean }) => isActive ? styles.active : styles.link}>{a("schedule")}</NavLink>
                    <NavLink to="/admin/servicios" className={({ isActive }: { isActive: boolean }) => isActive ? styles.active : styles.link}>{a("services")}</NavLink>
                    <NavLink to="/" className={styles.link}>{a("publicSite")} ↗</NavLink>
                </aside>
                <main className={styles.main} id="main-content">
                    <Outlet />
                    <p className={styles.warning}>{a("browserOnly")} {a("accountNote")}</p>
                </main>
            </div>
        </div>
    );
}
