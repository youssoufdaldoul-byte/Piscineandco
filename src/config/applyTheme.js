import { entreprise } from "./entreprise.js";

/**
 * Injecte les couleurs de marque définies dans entreprise.js
 * en variables CSS sur :root. Permet de re-brander tout le site
 * en changeant uniquement l'objet `couleurs` de la config.
 */
export function applyTheme() {
  const { couleurs } = entreprise;
  const root = document.documentElement;

  const map = {
    "--c-fond": couleurs.fondProfond,
    "--c-fond-clair": couleurs.fondClair,
    "--c-accent": couleurs.accent,
    "--c-accent-2": couleurs.accentSecondaire,
    "--c-or": couleurs.or,
    "--c-texte": couleurs.texte,
    "--c-ligne": couleurs.ligne,
  };

  Object.entries(map).forEach(([key, value]) => {
    if (value) root.style.setProperty(key, value);
  });
}

export default applyTheme;
