import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Pricing from "./pages/Pricing/Pricing";
import Contact from "./pages/Contact/Contact";
import { DisplayProvider, useDisplay } from "./context/DisplayContext";

// Update document metadata and scroll position when the visitor changes routes.
function RouteEffects() {
    const { pathname } = useLocation();
    const { t } = useDisplay();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });

        const titles: Record<string, string> = {
            "/": t("meta.home"),
            "/precios": t("meta.pricing"),
            "/contacto": t("meta.contact"),
        };

        document.title = `${titles[pathname] ?? t("meta.home")} | The Perfect Cut`;

        const descriptions: Record<string, string> = {
            "/": t("meta.descriptionHome"),
            "/precios": t("meta.descriptionPricing"),
            "/contacto": t("meta.descriptionContact"),
        };

        document.querySelector('meta[name="description"]')?.setAttribute(
            "content",
            descriptions[pathname] ?? t("meta.descriptionHome"),
        );
    }, [pathname, t]);

    return null;
}

// Shared navigation, route-specific content and footer compose the main application shell.
export default function App() {
    return (
        <DisplayProvider>
            <RouteEffects />
            <Navbar />
            <main id="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/precios" element={<Pricing />} />
                    <Route path="/contacto" element={<Contact />} />
                    <Route path="*" element={<Home />} />
                </Routes>
            </main>
            <Footer />
        </DisplayProvider>
    );
}
