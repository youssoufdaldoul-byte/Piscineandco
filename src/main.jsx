import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { LangueProvider } from "./i18n/index.jsx";
import { applyTheme } from "./config/applyTheme.js";
import "./styles/theme.css";
import "./styles/global.css";

// Applique les couleurs de marque depuis la config centrale
applyTheme();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <LangueProvider>
        <App />
      </LangueProvider>
    </BrowserRouter>
  </React.StrictMode>
);
