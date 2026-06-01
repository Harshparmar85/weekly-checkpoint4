// ============================================================
// main.tsx - Application entry point
// Renders the React app and registers the Service Worker (PWA)
// ============================================================

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// ─── Render React App ─────────────────────────────────────────
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// ─── Service Worker Registration (PWA) ───────────────────────
// Register the service worker only if the browser supports it.
// Service Workers enable offline functionality and caching.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js") // sw.js must be in the /public folder
      .then((registration) => {
        console.log("✅ Service Worker registered:", registration.scope);
      })
      .catch((error) => {
        console.error("❌ Service Worker registration failed:", error);
      });
  });
}