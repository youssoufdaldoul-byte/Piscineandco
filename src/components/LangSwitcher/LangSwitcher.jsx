import { languesDisponibles } from "../../config/entreprise.js";
import { useLangue } from "../../i18n/index.jsx";
import "./LangSwitcher.css";

/**
 * Sélecteur de langue FR / EN / IT / RU.
 * variant : "bar" (compact, barre de nav) | "menu" (grand, dans l'overlay)
 */
export default function LangSwitcher({ variant = "bar" }) {
  const { langue, setLangue } = useLangue();

  return (
    <div className={`lang lang--${variant}`} role="group" aria-label="Language">
      {languesDisponibles.map((l, i) => (
        <span key={l.code} className="lang__item">
          {i > 0 && <span className="lang__sep" aria-hidden="true">/</span>}
          <button
            className={`lang__btn ${langue === l.code ? "is-active" : ""}`}
            onClick={() => setLangue(l.code)}
            aria-pressed={langue === l.code}
          >
            {l.label}
          </button>
        </span>
      ))}
    </div>
  );
}
