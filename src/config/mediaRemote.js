/**
 * ============================================================================
 *  MÉDIAS GÉNÉRÉS (IA — Higgsfield) — hébergés sur CDN
 * ============================================================================
 *  Ce fichier associe chaque chemin local (défini dans entreprise.js) à l'URL
 *  du média généré. Il permet d'afficher les visuels immédiatement, y compris
 *  sur le site déployé, sans stocker les fichiers dans le dépôt.
 *
 *  ▶ POUR PASSER EN LOCAL (recommandé en production) :
 *    1. Téléchargez chaque URL ci-dessous dans public/media/ sous le nom local
 *       correspondant (la clé de gauche, ex. public/media/hero/hero.mp4).
 *    2. Videz l'objet `mediaRemote` (mettez-le à {}) — le site utilisera alors
 *       automatiquement les fichiers locaux.
 *
 *  ▶ PERF (audit du 2026-07-28) : les images ci-dessous marquées "optimisées"
 *    ont été redimensionnées à leur taille d'affichage réelle et recompressées
 *    en WebP q78-82 (voir mediaRemoteSmall pour les variantes mobiles). La
 *    vidéo hero-scrub a été ré-encodée keyframe-sur-chaque-frame (-g 1),
 *    sans audio. Détails complets dans le rapport de perf fourni au client.
 * ============================================================================
 */

const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3FzneIW6DeCzXNNc7KNNfmQuLKf";
// Bucket des médias ré-encodés / recompressés lors de l'audit perf.
const CDN_OPT = "https://d2ol7oe51mr4n9.cloudfront.net/user_3FzneIW6DeCzXNNc7KNNfmQuLKf";

export const mediaRemote = {
  // Vidéo hero (mp4 pleine qualité) — non utilisée par le hero actif (HeroScrub
  // utilise `medias.heroScrub`), conservée pour compat / usage futur.
  "/media/hero/hero.mp4": `${CDN}/hf_20260717_234454_3cb55dfa-f660-4312-ad96-e69f9deb3275.mp4`,
  "/media/hero/hero-poster.jpg": `${CDN}/hf_20260717_234531_dd44277f-38e1-46f1-af52-06b00476a2fb_min.webp`,

  // Hero — séquence de construction (même cadrage, time-lapse) — utilisée par
  // le composant Hero.jsx (variante non active sur la page d'accueil actuelle).
  "/media/hero-construction/etape-1.jpg": `${CDN}/hf_20260719_114556_4148fe98-27d4-4df5-8ce6-2686f1084712_min.webp`,
  "/media/hero-construction/etape-2.jpg": `${CDN}/hf_20260719_114733_787f7c68-8db3-4958-b733-ba563fae99b4_min.webp`,
  "/media/hero-construction/etape-3.jpg": `${CDN}/hf_20260719_114737_b4497187-b2c3-4ccc-97c7-dec3f0436d6c_min.webp`,
  "/media/hero-construction/etape-4.jpg": `${CDN}/hf_20260719_114749_9e2ed19f-3f76-4906-8385-3fa09cda8564_min.webp`,
  "/media/hero-construction/etape-5.jpg": `${CDN}/hf_20260719_114754_d20b7893-9e79-4b02-b5a2-44a182601ece_min.webp`,

  // Hero — éléments détourés (PNG transparents) + vidéo du terrassement
  "/media/hero-construction/excavator.png": `${CDN}/hf_20260719_140208_6806b6b8-9df4-4416-8331-9aa64b51ed24.png`,
  "/media/hero-construction/truck.png": `${CDN}/hf_20260719_140215_a2295be9-e99b-4f70-bab2-83d280100afc.png`,
  "/media/hero-construction/workers.png": `${CDN}/hf_20260719_140233_8fa25988-95a3-46cd-a216-e6519d2a504c.png`,
  "/media/hero-construction/digging.mp4": `${CDN}/hf_20260719_135943_f68e07c8-11a5-4e9f-bb0e-903503542f6e.mp4`,

  // Hero scrubbé au scroll (celui réellement affiché sur "/") — ré-encodé
  // keyframe-sur-chaque-frame (-g 1) pour un scrub fluide : chaque seek tombe
  // pile sur une image-clé, aucun décodage en chaîne. Audio retiré (muet).
  // 1920 (desktop) / 960 (mobile) sont maintenant deux fichiers RÉELLEMENT
  // distincts (avant l'audit, les deux pointaient vers le même master 13 Mo).
  //   original 13.0 Mo  →  1920: 4.0 Mo (-69 %)  /  960: 1.8 Mo (-86 %)
  "/media/hero-scrub/hero-1920.mp4": `${CDN_OPT}/fada278a-e29c-40b2-a94e-aa868b3342af.mp4`,
  "/media/hero-scrub/hero-1280.mp4": `${CDN_OPT}/0b910d1d-e737-42f2-8bd7-f4bd30dd8257.mp4`,
  "/media/hero-scrub/hero-poster.jpg": `${CDN}/hf_20260719_114556_4148fe98-27d4-4df5-8ce6-2686f1084712_min.webp`,

  // Catalogue — images "avant" (même cadrage que le modèle "après")
  "/media/avant-apres/debordement-avant.jpg": `${CDN}/hf_20260719_114636_b401e6c9-bc5b-4b13-8615-cc3dc2eb1973_min.webp`,
  "/media/avant-apres/miroir-avant.jpg": `${CDN}/hf_20260719_114639_82820b8d-3988-42e2-8226-d88e56e45e87_min.webp`,
  "/media/avant-apres/couloir-avant.jpg": `${CDN}/hf_20260719_115106_02e1219c-13ab-4981-b463-1d4cc3333453_min.webp`,
  "/media/avant-apres/coque-avant.jpg": `${CDN}/hf_20260719_115108_61e697a0-64d0-44bb-b4f8-b407c35894d3_min.webp`,
  "/media/avant-apres/interieure-avant.jpg": `${CDN}/hf_20260719_115111_a124ac93-979b-474c-ae3c-90078fae7344_min.webp`,
  "/media/avant-apres/spa-avant.jpg": `${CDN}/hf_20260719_115113_4acc083b-86aa-4b3b-b248-7741b5f01d49_min.webp`,

  // Artisan
  "/media/histoire/artisan.jpg": `${CDN}/hf_20260717_235530_931725db-8274-4bcd-83b5-bdc8e4cf1802_min.webp`,

  // Services — optimisées (voir mediaRemoteSmall pour la variante mobile)
  "/media/services/sur-mesure.jpg": `${CDN_OPT}/301f1b50-9e18-4983-bcad-10b4cf6ca834.webp`,
  "/media/services/debordement.jpg": `${CDN_OPT}/49527f7d-b0d2-4082-9540-f2cc53786c57.webp`,
  "/media/services/renovation.jpg": `${CDN_OPT}/6847d33c-1679-4beb-9c5c-63b7d932f417.webp`,
  "/media/services/entretien.jpg": `${CDN_OPT}/22a4116c-eb20-4c31-93e2-f317086d78af.webp`,
  "/media/services/spa.jpg": `${CDN_OPT}/0054787c-9ea3-40f9-8f08-f39ddf9375d7.webp`,

  // Réalisations — optimisées (voir mediaRemoteSmall pour la variante mobile)
  "/media/realisations/villa-eze.jpg": `${CDN_OPT}/516414ff-035e-4f5d-be36-e808c9929262.webp`,
  "/media/realisations/cap-ferrat.jpg": `${CDN_OPT}/d57a25d6-daa7-49ed-be5d-93c2691389a6.webp`,
  "/media/realisations/cannes-nuit.jpg": `${CDN_OPT}/030ee4bd-6880-4042-ad86-4ee7721c4a11.webp`,
  "/media/realisations/mougins.jpg": `${CDN_OPT}/a727ca48-ad0e-4453-9d11-df72fa7abb84.webp`,
  "/media/realisations/antibes.jpg": `${CDN_OPT}/4a49f457-edc4-4bbc-86f2-64163c82ffc0.webp`,
  "/media/realisations/saint-tropez.jpg": `${CDN_OPT}/587d133e-2a6d-4369-bb0b-dba292f0c5ee.webp`,
  "/media/realisations/monaco.jpg": `${CDN_OPT}/9894b50d-9b8c-4c15-8a88-d8bd7c3d979c.webp`,
  "/media/realisations/menton.jpg": `${CDN_OPT}/53c45f4c-492e-4102-9763-1744c5c8a240.webp`,

  // Avis (miniatures) — recadrées à leur taille réelle d'affichage (42×42 css,
  // export 200×200 pour le rétina) : 2048×2048 → 200×200, ~234 Ko → ~5-7 Ko.
  "/media/avis/avis-1.jpg": `${CDN_OPT}/3f6c5f28-10df-4208-99ef-470e6ff529ef.webp`,
  "/media/avis/avis-2.jpg": `${CDN_OPT}/b6189710-565a-4e1a-8e3f-8439e8ccc5d0.webp`,
  "/media/avis/avis-3.jpg": `${CDN_OPT}/87fe0620-5905-4a5f-a383-6171dce90e0c.webp`,
  "/media/avis/avis-4.jpg": `${CDN_OPT}/19b649bf-bbc4-4c75-9c50-ea88f3b0fae1.webp`,
  "/media/avis/avis-5.jpg": `${CDN_OPT}/f6c69780-daa2-45e5-bbd8-c310ae411950.webp`,
};

/**
 * Variantes "petit écran" (≈800px de large max) des images ci-dessus, pour le
 * srcset responsive de <MediaImage>. Seules les images du dessus-de-page /
 * grilles homepage (services, réalisations) ont une variante ; les chemins
 * absents ici n'ont simplement pas de srcset (fallback sur mediaRemote seul).
 */
export const mediaRemoteSmall = {
  "/media/services/sur-mesure.jpg": `${CDN_OPT}/d1eac19a-06fc-4a99-9092-bd45852148f8.webp`,
  "/media/services/debordement.jpg": `${CDN_OPT}/31a7a906-d170-460d-a9d7-861716f4d451.webp`,
  "/media/services/renovation.jpg": `${CDN_OPT}/ddb61ab3-3e02-45bd-a807-938f6aeeaa79.webp`,
  "/media/services/entretien.jpg": `${CDN_OPT}/25bb9d76-1bb8-4c37-a5ba-aa337ded131e.webp`,
  "/media/services/spa.jpg": `${CDN_OPT}/be94aa02-9e03-42b8-9622-e509c1c328fc.webp`,

  "/media/realisations/villa-eze.jpg": `${CDN_OPT}/8cd35d6a-a208-4345-8734-f8f96890fe38.webp`,
  "/media/realisations/cap-ferrat.jpg": `${CDN_OPT}/a0db808e-ab72-4b22-8741-303b0774876a.webp`,
  "/media/realisations/cannes-nuit.jpg": `${CDN_OPT}/ebecd647-0d03-42d5-ae68-cd7bc091c5b8.webp`,
  "/media/realisations/mougins.jpg": `${CDN_OPT}/9853ac6a-594f-480e-a3e7-6fda3062c9a6.webp`,
  "/media/realisations/antibes.jpg": `${CDN_OPT}/52805439-515d-4df3-b5c6-4dda2e8a7321.webp`,
  "/media/realisations/saint-tropez.jpg": `${CDN_OPT}/3a920042-92b0-4c68-be2f-1c84d94cb9ee.webp`,
  "/media/realisations/monaco.jpg": `${CDN_OPT}/f87d5ed0-0216-469b-98c7-31cd2678bba0.webp`,
  "/media/realisations/menton.jpg": `${CDN_OPT}/edc69c1c-c752-4533-852d-21d8a9b8d6cc.webp`,
};

/** Renvoie l'URL distante si elle existe, sinon le chemin local d'origine. */
export function resolveMedia(path) {
  if (!path) return path;
  return mediaRemote[path] || path;
}

/** Renvoie l'URL de la variante "petit écran" (~800px), ou null si absente. */
export function resolveMediaSmall(path) {
  if (!path) return null;
  return mediaRemoteSmall[path] || null;
}

export default resolveMedia;
