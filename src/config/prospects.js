/**
 * ============================================================================
 *  WHITE-LABEL PROSPECTS — démo commerciale
 * ============================================================================
 *  UN seul déploiement, le nom de l'entreprise change selon le paramètre
 *  d'URL `?client=<slug>`. Chaque prospect reçoit un lien personnalisé.
 *
 *  Champs surchargeables UNIQUEMENT : nom, ville, telephone.
 *  Laisser une chaîne vide "" conserve la valeur par défaut (jamais de blanc).
 * ============================================================================
 */
export const prospects = {
  "ce-drone-piscine": { nom: "Ce Drone Piscine", ville: "Grenoble", telephone: "" },
  "hb-piscine":       { nom: "HB Piscine",       ville: "",         telephone: "" },
  "belledonne":       { nom: "Belledonne Piscine", ville: "",       telephone: "" },
  "stp-piscine":      { nom: "STP Piscine et Spa", ville: "",       telephone: "" },
  "solution-piscine": { nom: "Solution Piscine", ville: "",         telephone: "" },
  "cote-creation":    { nom: "Côté Création Piscine", ville: "",    telephone: "" },
  "cpa":              { nom: "CPA Création Piscines & Aménagements", ville: "", telephone: "" },
  "mendez":           { nom: "Piscines Mendez",  ville: "",         telephone: "" },
  "azzura":           { nom: "Piscine Azzura",   ville: "",         telephone: "" },
  "snpc":             { nom: "Snpc",             ville: "",         telephone: "" },
};

export default prospects;
