import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import App from "./App";
import "./styles/Global.css";

// Mount the SPA with strict-mode checks and client-side routing.
const container = document.getElementById("root");

if (!container) {
    throw new Error("The application root element was not found.");
}

createRoot(container).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
);
