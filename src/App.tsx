import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";

function RouteEffects() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const titles: Record<string, string> = {
      "/": "Inicio | The Perfect Cut",
      "/precios": "Precios | The Perfect Cut",
      "/contacto": "Contacto | The Perfect Cut",
    };
    document.title = titles[location.pathname] ?? "The Perfect Cut";
  }, [location.pathname]);
  return null;
}

export default function App() {
  return (
    <>
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
    </>
  );
}
