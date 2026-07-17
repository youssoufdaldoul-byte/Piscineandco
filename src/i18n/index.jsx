import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import fr from "./fr.js";
import en from "./en.js";
import it from "./it.js";
import ru from "./ru.js";
import { langueParDefaut } from "../config/entreprise.js";

const dictionnaires = { fr, en, it, ru };

const STORAGE_KEY = "azur_langue";

const LangueContext = createContext(null);

/** Récupère une valeur imbriquée via une clé "a.b.c" */
function resoudre(objet, chemin) {
  return chemin.split(".").reduce((acc, cle) => (acc ? acc[cle] : undefined), objet);
}

export function LangueProvider({ children }) {
  const [langue, setLangueState] = useState(() => {
    if (typeof window === "undefined") return langueParDefaut;
    const sauvegardee = window.localStorage.getItem(STORAGE_KEY);
    if (sauvegardee && dictionnaires[sauvegardee]) return sauvegardee;
    // Détection depuis le navigateur
    const nav = (window.navigator.language || "fr").slice(0, 2).toLowerCase();
    return dictionnaires[nav] ? nav : langueParDefaut;
  });

  const setLangue = useCallback((code) => {
    if (!dictionnaires[code]) return;
    setLangueState(code);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch (_) {
      /* stockage indisponible : on ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("lang", langue);
  }, [langue]);

  const t = useCallback(
    (chemin) => {
      const valeur = resoudre(dictionnaires[langue], chemin);
      if (valeur === undefined) return resoudre(dictionnaires[langueParDefaut], chemin) ?? chemin;
      return valeur;
    },
    [langue]
  );

  const valeur = useMemo(() => ({ langue, setLangue, t }), [langue, setLangue, t]);

  return <LangueContext.Provider value={valeur}>{children}</LangueContext.Provider>;
}

export function useLangue() {
  const ctx = useContext(LangueContext);
  if (!ctx) throw new Error("useLangue doit être utilisé dans <LangueProvider>");
  return ctx;
}

export default LangueProvider;
