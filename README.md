# AZUR PISCINES — Site vitrine cinématique

Site vitrine immersif et haut de gamme pour un pisciniste de la Côte d'Azur.
Démo réutilisable : tout le contenu client se change dans **un seul fichier**.

## Stack

- **Vite + React** — build rapide, DX moderne
- **GSAP + ScrollTrigger** — animations et scroll-scrubbing cinématique
- **Lenis** — smooth scroll
- **Three.js** — surface d'eau animée (hero)
- **CSS moderne** — variables de thème centralisées
- **Multilingue** — FR / EN / IT / RU
- **Responsive** — mobile + desktop

## Démarrage

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de production dans /dist
npm run preview  # prévisualise le build
```

## ⚙️ Adapter à un vrai client

Tout se configure dans **`src/config/entreprise.js`** :
coordonnées, couleurs de marque, réseaux sociaux, services, réalisations,
avis, endpoint du formulaire de devis…

Les **textes multilingues** sont dans `src/i18n/` (`fr.js`, `en.js`, `it.js`, `ru.js`).

## Médias

Voir **[MEDIAS.md](./MEDIAS.md)** pour la liste des images/vidéos à générer
(avec prompts IA optimisés). Déposez-les dans `public/media/`.

## Déploiement

Optimisé pour **Vercel** (framework détecté automatiquement : Vite).

## Structure

```
src/
├── config/
│   ├── entreprise.js   ← LE fichier à modifier par client
│   └── applyTheme.js   ← injecte les couleurs en variables CSS
├── i18n/               ← traductions FR/EN/IT/RU + contexte de langue
├── styles/             ← thème (brand tokens) + styles globaux
├── sections/           ← sections cinématiques (à venir)
├── components/         ← nav, sélecteur de langue… (à venir)
├── App.jsx
└── main.jsx
```
