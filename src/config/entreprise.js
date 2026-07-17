/**
 * ============================================================================
 *  CONFIGURATION CENTRALE — AZUR PISCINES
 * ============================================================================
 *  ⚙️  POUR ADAPTER LE SITE À UN VRAI CLIENT : modifiez UNIQUEMENT ce fichier.
 *
 *  Tout ici est utilisé à travers l'ensemble du site :
 *   - Identité & coordonnées
 *   - Couleurs de marque (brand tokens) → injectées en variables CSS
 *   - Réseaux sociaux, zone d'intervention, horaires
 *   - Contenus structurés : services, réalisations, avis, processus
 *   - Intégration du formulaire (Formspree ou équivalent)
 *
 *  Les TEXTES multilingues (FR / EN / IT / RU) sont dans : src/i18n/
 * ============================================================================
 */

export const entreprise = {
  // ─────────────────────────────────────────────────────────────────────────
  //  IDENTITÉ
  // ─────────────────────────────────────────────────────────────────────────
  nom: "AZUR PISCINES",
  slogan: "L'art de la piscine",
  baseline: "Créateur de piscines d'exception sur la Côte d'Azur",
  anneeCreation: 2004,
  fondateur: "Laurent Vasseur",

  // Chiffres clés (preuve sociale) — affichés dans plusieurs sections
  stats: {
    realisations: "200+",
    avis: "60+",
    experience: "20 ans",
    note: "5.0",
  },

  // ─────────────────────────────────────────────────────────────────────────
  //  COORDONNÉES / CONTACT
  // ─────────────────────────────────────────────────────────────────────────
  contact: {
    telephone: "+33 4 93 00 00 00",
    telephoneLien: "+33493000000", // format tel: sans espaces
    email: "contact@azur-piscines.fr",
    adresse: "12 Promenade des Anglais",
    codePostal: "06000",
    ville: "Nice",
    pays: "France",
    // Google Maps embed (remplacer par l'adresse réelle du client)
    mapsQuery: "Nice, France",
  },

  // Zone d'intervention (affichée dans le footer et la section contact)
  zoneIntervention: [
    "Nice",
    "Cannes",
    "Antibes",
    "Saint-Tropez",
    "Monaco",
    "Menton",
    "Saint-Jean-Cap-Ferrat",
  ],

  horaires: {
    semaine: "Lun – Ven : 8h30 – 18h30",
    samedi: "Sam : 9h00 – 12h00",
    dimanche: "Dim : sur rendez-vous",
  },

  // ─────────────────────────────────────────────────────────────────────────
  //  RÉSEAUX SOCIAUX (laisser vide "" pour masquer un lien)
  // ─────────────────────────────────────────────────────────────────────────
  reseaux: {
    instagram: "https://instagram.com/azurpiscines",
    facebook: "https://facebook.com/azurpiscines",
    linkedin: "",
    youtube: "",
    whatsapp: "https://wa.me/33493000000",
  },

  // ─────────────────────────────────────────────────────────────────────────
  //  FORMULAIRE DE DEVIS
  //  Remplacer par votre endpoint Formspree : https://formspree.io/f/xxxxxxx
  //  (ou tout autre service : Getform, Web3Forms, backend maison…)
  // ─────────────────────────────────────────────────────────────────────────
  formulaire: {
    endpoint: "https://formspree.io/f/VOTRE_ID_FORMSPREE",
    delaiReponse: "48h",
  },

  // ─────────────────────────────────────────────────────────────────────────
  //  BRAND TOKENS — COULEURS (injectées en variables CSS :root)
  //  Modifiez ces valeurs pour re-brander instantanément tout le site.
  // ─────────────────────────────────────────────────────────────────────────
  couleurs: {
    fondProfond: "#0B1420", // bleu nuit / charcoal
    accent: "#2FB6C4", // turquoise eau
    accentSecondaire: "#1A7A9E", // bleu lagon
    or: "#C9A86A", // or / sable (touches luxe)
    texte: "#F2F6F7", // blanc cassé
    // dérivés utilitaires
    fondClair: "#12202F",
    ligne: "rgba(242, 246, 247, 0.12)",
  },

  // ─────────────────────────────────────────────────────────────────────────
  //  SERVICES / L'EXPÉRIENCE
  //  Le champ `titre`/`texte` par langue est géré dans src/i18n/.
  //  Ici on garde l'ordre, la clé et le média associé.
  // ─────────────────────────────────────────────────────────────────────────
  services: [
    { id: "surmesure", image: "/media/services/sur-mesure.jpg" },
    { id: "debordement", image: "/media/services/debordement.jpg" },
    { id: "renovation", image: "/media/services/renovation.jpg" },
    { id: "entretien", image: "/media/services/entretien.jpg" },
    { id: "spa", image: "/media/services/spa.jpg" },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  //  NOS RÉALISATIONS (galerie)
  //  type: "photo" | "video"  — src pointe vers /public/media/...
  //  Les libellés (lieu/type) traduits sont dans src/i18n/ via la clé `id`.
  // ─────────────────────────────────────────────────────────────────────────
  realisations: [
    { id: "villa-eze", type: "photo", src: "/media/realisations/villa-eze.jpg", lieu: "Èze-sur-Mer", categorie: "debordement", ratio: "portrait" },
    { id: "cap-ferrat", type: "photo", src: "/media/realisations/cap-ferrat.jpg", lieu: "Cap-Ferrat", categorie: "vuemer", ratio: "paysage" },
    { id: "cannes-nuit", type: "photo", src: "/media/realisations/cannes-nuit.jpg", lieu: "Cannes", categorie: "nocturne", ratio: "paysage" },
    { id: "mougins", type: "photo", src: "/media/realisations/mougins.jpg", lieu: "Mougins", categorie: "villa", ratio: "portrait" },
    { id: "antibes", type: "photo", src: "/media/realisations/antibes.jpg", lieu: "Antibes", categorie: "interieure", ratio: "paysage" },
    { id: "saint-tropez", type: "photo", src: "/media/realisations/saint-tropez.jpg", lieu: "Saint-Tropez", categorie: "debordement", ratio: "portrait" },
    { id: "monaco", type: "photo", src: "/media/realisations/monaco.jpg", lieu: "Monaco", categorie: "rooftop", ratio: "paysage" },
    { id: "menton", type: "photo", src: "/media/realisations/menton.jpg", lieu: "Menton", categorie: "villa", ratio: "portrait" },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  //  AVIS CLIENTS (preuve sociale)
  //  Le texte de l'avis traduit est dans src/i18n/ via la clé `id`.
  // ─────────────────────────────────────────────────────────────────────────
  avis: [
    { id: "avis1", auteur: "Famille Moretti", lieu: "Cap-Ferrat", note: 5, photo: "/media/avis/avis-1.jpg" },
    { id: "avis2", auteur: "M. & Mme Laurent", lieu: "Cannes", note: 5, photo: "/media/avis/avis-2.jpg" },
    { id: "avis3", auteur: "Villa Serena", lieu: "Saint-Tropez", note: 5, photo: "/media/avis/avis-3.jpg" },
    { id: "avis4", auteur: "A. Petrov", lieu: "Monaco", note: 5, photo: "/media/avis/avis-4.jpg" },
    { id: "avis5", auteur: "Famille Dubois", lieu: "Mougins", note: 5, photo: "/media/avis/avis-5.jpg" },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  //  LE PROCESSUS (étapes) — icône + clé de traduction
  // ─────────────────────────────────────────────────────────────────────────
  processus: [
    { id: "rencontre", numero: "01" },
    { id: "conception", numero: "02" },
    { id: "construction", numero: "03" },
    { id: "livraison", numero: "04" },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  //  MÉDIAS PRINCIPAUX (héros, histoire…)
  //  Fournir vos fichiers dans /public/media/. Placeholders en attendant.
  // ─────────────────────────────────────────────────────────────────────────
  medias: {
    heroVideo: "/media/hero/hero.mp4", // vidéo cinématique 16:9
    heroPoster: "/media/hero/hero-poster.jpg", // image affichée avant chargement
    histoireImage: "/media/histoire/artisan.jpg", // photo artisan / équipe
    ogImage: "/media/og-image.jpg", // aperçu réseaux sociaux
  },

  // ─────────────────────────────────────────────────────────────────────────
  //  MENTIONS LÉGALES (footer)
  // ─────────────────────────────────────────────────────────────────────────
  legal: {
    raisonSociale: "AZUR PISCINES SARL",
    siret: "000 000 000 00000",
    tva: "FR00000000000",
    assurance: "Garantie décennale — MMA Assurances",
  },
};

// ───────────────────────────────────────────────────────────────────────────
//  LANGUES DISPONIBLES (ordre = ordre d'affichage du sélecteur)
// ───────────────────────────────────────────────────────────────────────────
export const languesDisponibles = [
  { code: "fr", label: "FR", nom: "Français" },
  { code: "en", label: "EN", nom: "English" },
  { code: "it", label: "IT", nom: "Italiano" },
  { code: "ru", label: "RU", nom: "Русский" },
];

export const langueParDefaut = "fr";

export default entreprise;
