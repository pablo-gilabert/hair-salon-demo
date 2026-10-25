import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router";

import DisplayControls from "../../components/DisplayControls/DisplayControls";
import { useDisplay } from "../../context/DisplayContext";
import { DEMO_ADMIN, useSalon } from "../../context/SalonContext";
import { adminTranslate, type AdminTranslationKey } from "../../i18n/AdminTranslations";
import styles from "./AdminLogin.module.css";

// The demo login is a public portfolio screen. Credentials and permissions are browser-only.
export default function AdminLogin() {
    const { loggedIn, login } = useSalon();
    const { language } = useDisplay();
    const navigate = useNavigate();
    const a = (key: AdminTranslationKey) => adminTranslate(language, key);

    const [email, setEmail] = useState(DEMO_ADMIN.email as string);
    const [password, setPassword] = useState(DEMO_ADMIN.password as string);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [error, setError] = useState(false);

    // Successful sign-in opens the same appointments dashboard as the existing demo.
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (login(email.trim(), password)) {
            navigate("/admin/turnos", { replace: true });
        } else {
            setError(true);
        }
    };

    // A one-click demo account makes every administration feature easy to discover.
    const enterDemo = () => {
        setError(false);
        setEmail(DEMO_ADMIN.email);
        setPassword(DEMO_ADMIN.password);

        if (login(DEMO_ADMIN.email, DEMO_ADMIN.password)) {
            navigate("/admin/turnos", { replace: true });
        }
    };

    if (loggedIn) return <Navigate to="/admin/turnos" replace />;

    return (
        <div className={styles.page}>
            {/* Brand story follows Aula Studio's left-panel / right-form layout. */}
            <aside className={styles.story} aria-label={a("loginStoryLabel")}>
                <div className={styles.storyContent}>
                    <Link to="/" className={styles.brand}>
                        <span className={styles.brandMark} aria-hidden="true">✧</span>
                        <span>THE <strong>PERFECT CUT</strong><span className={styles.brandDot}>.</span></span>
                    </Link>

                    <div className={styles.storyMain}>
                        <span className={styles.storyEyebrow}>
                            <span className={styles.storyEyebrowLine} />
                            {a("loginStoryEyebrow")}
                        </span>
                        <h1>{a("loginStoryTitle")}<br /><em>{a("loginStoryAccent")}</em></h1>
                        <p>{a("loginStoryDescription")}</p>

                        <div className={styles.storyTiles}>
                            <div className={styles.storyTile}>
                                <span className={styles.tileIcon} aria-hidden="true">▦</span>
                                <strong>{a("loginFeatureAppointments")}</strong>
                                <small>{a("loginFeatureAppointmentsText")}</small>
                            </div>
                            <div className={styles.storyTile}>
                                <span className={styles.tileIcon} aria-hidden="true">◈</span>
                                <strong>{a("loginFeatureDeposits")}</strong>
                                <small>{a("loginFeatureDepositsText")}</small>
                            </div>
                            <div className={styles.storyTile}>
                                <span className={styles.tileIcon} aria-hidden="true">✳</span>
                                <strong>{a("loginFeatureServices")}</strong>
                                <small>{a("loginFeatureServicesText")}</small>
                            </div>
                        </div>
                    </div>

                    <p className={styles.storyFooter}>
                        <span className={styles.storyEyebrowLine} />
                        {a("loginStoryFooter")}
                    </p>
                </div>
                <span className={styles.decorOne} aria-hidden="true" />
                <span className={styles.decorTwo} aria-hidden="true" />
                <span className={styles.decorThree} aria-hidden="true" />
            </aside>

            {/* The visible form and demo credentials mirror Aula Studio's entry flow. */}
            <main className={styles.loginArea} id="main-content">
                <header className={styles.loginTop}>
                    <Link to="/" className={styles.returnLink}>← {a("publicSite")}</Link>
                    <div className={styles.loginTopRight}>
                        <span className={styles.prototypeTag}>{a("loginPrototype")}</span>
                        <span className={styles.liveDot} aria-hidden="true" />
                        <DisplayControls />
                    </div>
                </header>

                <section className={styles.formWrap} aria-labelledby="admin-login-title">
                    <span className={styles.welcomeIcon} aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="5" y="10" width="14" height="11" rx="2" />
                            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                        </svg>
                    </span>
                    <span className={styles.formEyebrow}>{a("demoTag")}</span>
                    <h2 id="admin-login-title">{a("loginWelcomeFirst")}<br /><em>{a("loginWelcomeSecond")}</em></h2>
                    <p className={styles.intro}>{a("loginWelcomeDescription")}</p>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <label htmlFor="admin-email">
                            {a("email")}
                            <input
                                id="admin-email"
                                name="email"
                                autoComplete="username"
                                type="email"
                                required
                                value={email}
                                onChange={(event) => { setEmail(event.target.value); setError(false); }}
                                placeholder={DEMO_ADMIN.email}
                            />
                        </label>
                        <label htmlFor="admin-password">
                            {a("password")}
                            <span className={styles.passwordWrap}>
                                <input
                                    id="admin-password"
                                    name="password"
                                    autoComplete="current-password"
                                    type={isPasswordVisible ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(event) => { setPassword(event.target.value); setError(false); }}
                                />
                                <button
                                    type="button"
                                    className={styles.passwordToggle}
                                    onClick={() => setIsPasswordVisible((current) => !current)}
                                    aria-label={a(isPasswordVisible ? "loginHidePassword" : "loginShowPassword")}
                                    aria-pressed={isPasswordVisible}
                                    aria-controls="admin-password"
                                >
                                    {isPasswordVisible ? (
                                        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="m3 3 18 18M10.6 10.65a2 2 0 0 0 2.75 2.75" />
                                            <path d="M9.9 5.3A10.4 10.4 0 0 1 12 5c5 0 8.6 4.2 10 7a13.6 13.6 0 0 1-3.1 4.2M6.5 6.5C4.3 7.8 2.8 9.9 2 12c1.4 2.8 5 7 10 7 1.1 0 2.1-.2 3-.5" />
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </span>
                        </label>
                        {error && <p className={styles.error} role="alert">{a("loginError")}</p>}
                        <button type="submit" className={styles.loginButton}>
                            {a("signIn")}
                            <span aria-hidden="true">↗</span>
                        </button>
                    </form>

                    {/* Credentials remain visible even if the visitor edits the login fields. */}
                    <div className={styles.divider}>
                        <span />
                        {a("loginDemoHeading")}
                        <span />
                    </div>
                    <p className={styles.credentialsNote}>{a("loginDemoHint")}</p>
                    <button type="button" className={styles.demoRole} onClick={enterDemo}>
                        <span className={styles.roleIcon} aria-hidden="true">✳</span>
                        <span className={styles.demoRoleText}>
                            <strong>{a("loginDemoRole")}</strong>
                            <small><b>{a("email")}:</b> {DEMO_ADMIN.email}</small>
                            <small><b>{a("password")}:</b> {DEMO_ADMIN.password}</small>
                        </span>
                        <span className={styles.roleArrow} aria-hidden="true">→</span>
                    </button>
                    <p className={styles.demoActionHint}>{a("loginDemoActionHint")}</p>
                </section>

                <footer className={styles.loginFooter}>{a("loginSecurityNote")}</footer>
            </main>
        </div>
    );
}
