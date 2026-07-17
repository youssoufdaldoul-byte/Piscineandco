import { entreprise, languesDisponibles } from "./config/entreprise.js";
import { useLangue } from "./i18n/index.jsx";
import "./App.css";

/**
 * ⚠️ App de VALIDATION (étape 1 : structure + config).
 * Cet écran vérifie que la fondation fonctionne :
 *   - couleurs de marque injectées depuis entreprise.js
 *   - lecture de la config centrale
 *   - changement de langue FR / EN / IT / RU en direct
 * Il sera remplacé par les sections cinématiques une fois validé.
 */
export default function App() {
  const { langue, setLangue, t } = useLangue();

  const swatches = [
    { nom: "Fond profond", val: entreprise.couleurs.fondProfond },
    { nom: "Turquoise", val: entreprise.couleurs.accent },
    { nom: "Bleu lagon", val: entreprise.couleurs.accentSecondaire },
    { nom: "Or / sable", val: entreprise.couleurs.or },
    { nom: "Blanc cassé", val: entreprise.couleurs.texte },
  ];

  return (
    <main className="preview">
      <div className="container">
        <header className="preview__head">
          <span className="eyebrow">Étape 1 — Fondation validée</span>
          <h1 className="preview__logo">{entreprise.nom}</h1>
          <p className="preview__baseline">{t("hero.sousTitre")}</p>
        </header>

        {/* Sélecteur de langue */}
        <section className="preview__block">
          <h2>Multilingue — {t("nav.langue")}</h2>
          <div className="preview__langs">
            {languesDisponibles.map((l) => (
              <button
                key={l.code}
                className={`lang-btn ${langue === l.code ? "is-active" : ""}`}
                onClick={() => setLangue(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>
          <p className="preview__demo">
            <strong>{t("hero.titre")}</strong> — {t("hero.cta")}
          </p>
        </section>

        {/* Brand tokens */}
        <section className="preview__block">
          <h2>Couleurs de marque (brand tokens)</h2>
          <div className="preview__swatches">
            {swatches.map((s) => (
              <div key={s.nom} className="swatch">
                <span className="swatch__color" style={{ background: s.val }} />
                <span className="swatch__name">{s.nom}</span>
                <span className="swatch__val">{s.val}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Récap config */}
        <section className="preview__block">
          <h2>Config centrale — src/config/entreprise.js</h2>
          <ul className="preview__list">
            <li><span>Fondateur</span><b>{entreprise.fondateur}</b></li>
            <li><span>Depuis</span><b>{entreprise.anneeCreation}</b></li>
            <li><span>Réalisations</span><b>{entreprise.stats.realisations}</b></li>
            <li><span>Avis 5★</span><b>{entreprise.stats.avis}</b></li>
            <li><span>Téléphone</span><b>{entreprise.contact.telephone}</b></li>
            <li><span>Email</span><b>{entreprise.contact.email}</b></li>
            <li><span>Zone</span><b>{entreprise.zoneIntervention.join(" · ")}</b></li>
            <li><span>Services</span><b>{entreprise.services.length}</b></li>
            <li><span>Réalisations (galerie)</span><b>{entreprise.realisations.length}</b></li>
          </ul>
        </section>

        <footer className="preview__foot">
          <p>
            Fondation prête. Sections cinématiques à construire une fois cette
            étape validée : Hero → Expérience → Réalisations → Histoire → Avis →
            Processus → Devis → Footer.
          </p>
        </footer>
      </div>
    </main>
  );
}
