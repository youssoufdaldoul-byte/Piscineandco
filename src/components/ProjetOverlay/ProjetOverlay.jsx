import { useEffect, useRef } from "react";
import { useLangue } from "../../i18n/index.jsx";
import { entreprise } from "../../config/entreprise.js";
import TransitionLink from "../../router/TransitionLink.jsx";
import ProjetComparateur from "../ProjetComparateur/ProjetComparateur.jsx";
import "./ProjetOverlay.css";

/**
 * Superposition plein écran d'un projet (ouverture par volet liquide).
 * Contient : comparateur avant/après, récit, caractéristiques, CTA, préc./suiv.
 */
export default function ProjetOverlay({ index, onClose, onNavigate }) {
  const { t } = useLangue();
  const closeRef = useRef(null);
  const modeles = entreprise.piscines.modeles;
  const open = index != null;

  const total = modeles.length;
  const prev = () => onNavigate((index - 1 + total) % total);
  const next = () => onNavigate((index + 1) % total);

  // Verrou du défilement + Échap + navigation clavier + focus initial
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      // flèches préc./suiv. — sauf quand la poignée du comparateur a le focus
      else if (!e.target.closest?.(".cmp")) {
        if (e.key === "ArrowLeft") prev();
        else if (e.key === "ArrowRight") next();
      }
    };
    document.addEventListener("keydown", onKey);
    const id = requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      cancelAnimationFrame(id);
    };
  }, [open, index]);

  if (!open) return null;

  const m = modeles[index];
  const base = `piscinesPage.modeles.${m.id}`;
  const histoire = t(`${base}.histoire`) || [];
  const carac = t(`${base}.carac`) || [];
  const num = String(index + 1).padStart(2, "0");
  const tot = String(total).padStart(2, "0");

  return (
    <div className="pov" role="dialog" aria-modal="true" aria-label={t(`${base}.nom`)}>
      <div className="pov__scrim" onClick={onClose} />
      <span className="pov__wipe" aria-hidden="true" />

      <div className="pov__dialog">
        {/* Barre supérieure */}
        <div className="pov__bar">
          <span className="pov__counter">
            {t("piscinesPage.compteur")} <strong>{num}</strong> / {tot}
          </span>
          <button ref={closeRef} className="pov__close" onClick={onClose} aria-label={t("piscinesPage.fermer")}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Contenu (remonté à chaque changement de projet → ré-animation + re-sweep) */}
        <div className="pov__panel" key={m.id}>
          <ProjetComparateur
            avant={m.avant}
            apres={m.image}
            labelAvant={t("piscinesPage.avant")}
            labelApres={t("piscinesPage.apres")}
            hint={t("piscinesPage.glisser")}
          />

          <div className="pov__body">
            <div className="pov__head">
              <span className="pov__eyebrow">{t("piscinesPage.compteur")} {num}</span>
              <h2 className="pov__titre">{t(`${base}.nom`)}</h2>
            </div>

            <div className="pov__grid">
              {/* Récit */}
              <div className="pov__story">
                <h3 className="pov__sub">{t("piscinesPage.projetTitre")}</h3>
                {histoire.map((p, i) => (
                  <p key={i} className="pov__para">{p}</p>
                ))}
              </div>

              {/* Caractéristiques + specs */}
              <aside className="pov__aside">
                <h3 className="pov__sub">{t("piscinesPage.caracTitre")}</h3>
                <ul className="pov__carac">
                  {carac.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
                <dl className="pov__specs">
                  <div><dt>{t("piscinesPage.specs.dimensions")}</dt><dd>{m.dims}</dd></div>
                  <div><dt>{t("piscinesPage.specs.profondeur")}</dt><dd>{m.profondeur}</dd></div>
                  <div><dt>{t("piscinesPage.specs.delai")}</dt><dd>{m.delai} {t("piscinesPage.specs.delaiUnite")}</dd></div>
                </dl>
              </aside>
            </div>

            <div className="pov__cta-row">
              <TransitionLink
                to={`/rendez-vous?modele=${m.id}`}
                className="btn btn--solid pov__cta"
                onNavigate={onClose}
              >
                {t("piscinesPage.overlayCta")}
              </TransitionLink>
            </div>
          </div>
        </div>

        {/* Navigation préc./suiv. */}
        <button className="pov__nav pov__nav--prev" onClick={prev} aria-label={t("piscinesPage.precedent")}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="pov__nav pov__nav--next" onClick={next} aria-label={t("piscinesPage.suivant")}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
