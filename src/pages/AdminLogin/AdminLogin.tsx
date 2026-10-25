import { type ChangeEvent, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router";

import { DEMO_ADMIN, useSalon } from "../../context/SalonContext";
import { useDisplay } from "../../context/DisplayContext";
import { adminTranslate } from "../../i18n/AdminTranslations";
import DisplayControls from "../../components/DisplayControls/DisplayControls";
import styles from "./AdminLogin.module.css";

// The admin identity is intentionally a browser-only portfolio demonstration.
export default function AdminLogin() {
    const { loggedIn, login } = useSalon();
    const { language } = useDisplay();
    const navigate = useNavigate();
    const a = (key: Parameters<typeof adminTranslate>[1]) => adminTranslate(language, key);
    const [email, setEmail] = useState<string>(DEMO_ADMIN.email);
    const [password, setPassword] = useState<string>(DEMO_ADMIN.password);
    const [error, setError] = useState(false);

    if (loggedIn) return <Navigate to="/admin/turnos" replace />;

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (login(email, password)) navigate("/admin/turnos", { replace: true });
        else setError(true);
    };

    return (
        <main className={styles.screen} id="main-content">
            <header className={styles.header}>
                <Link to="/" className={styles.wordmark}>✧ THE PERFECT CUT</Link>
                <DisplayControls />
            </header>
            <section className={styles.card}>
                <span className={styles.kicker}>{a("demoTag")}</span>
                <h1>{a("loginTitle")}</h1>
                <p>{a("loginSubtitle")}</p>
                <form onSubmit={submit} className={styles.form}>
                    <label>{a("email")}<input type="email" required autoComplete="username" value={email} onChange={(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setEmail(event.target.value); setError(false); }} /></label>
                    <label>{a("password")}<input type="password" required autoComplete="current-password" value={password} onChange={(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setPassword(event.target.value); setError(false); }} /></label>
                    {error && <p className={styles.error} role="alert">{a("loginError")}</p>}
                    <button className={styles.submit} type="submit">{a("signIn")} ↗</button>
                </form>
                <div className={styles.demoAccount}>
                    <strong>{a("account")}</strong>
                    <code>{DEMO_ADMIN.email}</code>
                    <code>{DEMO_ADMIN.password}</code>
                    <small>{a("accountNote")}</small>
                </div>
                <Link to="/" className={styles.back}>← {a("publicSite")}</Link>
            </section>
        </main>
    );
}
