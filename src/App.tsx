import { useEffect, type ReactNode } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import AdminShell from "./components/AdminShell/AdminShell";
import Home from "./pages/Home/Home";
import Pricing from "./pages/Pricing/Pricing";
import Contact from "./pages/Contact/Contact";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AdminHours from "./pages/AdminHours/AdminHours";
import AdminServices from "./pages/AdminServices/AdminServices";
import { DisplayProvider, useDisplay } from "./context/DisplayContext";
import { SalonProvider, useSalon } from "./context/SalonContext";
import { adminTranslate } from "./i18n/AdminTranslations";

// Page title and scroll reset react to route and language changes, not theme toggles.
function RouteEffects() {
    const { pathname } = useLocation();
    const { t, language } = useDisplay();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        const titles: Record<string, string> = {
            "/": t("meta.home"),
            "/precios": t("meta.pricing"),
            "/contacto": t("meta.contact"),
            "/admin/login": adminTranslate(language, "access"),
            "/admin/turnos": adminTranslate(language, "appointments"),
            "/admin/horarios": adminTranslate(language, "schedule"),
            "/admin/servicios": adminTranslate(language, "services"),
        };
        document.title = `${titles[pathname] ?? t("meta.home")} | The Perfect Cut`;
    }, [pathname, t, language]);
    return null;
}

// Redirect all private paths to the demo sign-in, without claiming real server-side security.
function RequireAdmin({ children }: { children: ReactNode }) {
    const { loggedIn } = useSalon();
    return loggedIn ? children : <Navigate to="/admin/login" replace />;
}

function ApplicationRoutes() {
    const { pathname } = useLocation();
    const adminArea = pathname.startsWith("/admin");
    return (
        <>
            <RouteEffects />
            {!adminArea && <Navbar />}
            {adminArea ? (
                <Routes>
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<RequireAdmin><Navigate to="/admin/turnos" replace /></RequireAdmin>} />
                    <Route element={<RequireAdmin><AdminShell /></RequireAdmin>}>
                        <Route path="/admin/turnos" element={<AdminDashboard />} />
                        <Route path="/admin/horarios" element={<AdminHours />} />
                        <Route path="/admin/servicios" element={<AdminServices />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/admin/turnos" replace />} />
                </Routes>
            ) : (
                <>
                    <main id="main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/precios" element={<Pricing />} />
                            <Route path="/contacto" element={<Contact />} />
                            <Route path="*" element={<Home />} />
                        </Routes>
                    </main>
                    <Footer />
                </>
            )}
        </>
    );
}

export default function App() {
    return (
        <DisplayProvider>
            <SalonProvider>
                <ApplicationRoutes />
            </SalonProvider>
        </DisplayProvider>
    );
}
