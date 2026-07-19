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
 * ============================================================================
 */

const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3FzneIW6DeCzXNNc7KNNfmQuLKf";

export const mediaRemote = {
  // Vidéo hero (mp4 pleine qualité)
  "/media/hero/hero.mp4": `${CDN}/hf_20260717_234454_3cb55dfa-f660-4312-ad96-e69f9deb3275.mp4`,
  "/media/hero/hero-poster.jpg": `${CDN}/hf_20260717_234531_dd44277f-38e1-46f1-af52-06b00476a2fb_min.webp`,

  // Hero — séquence de construction (même cadrage, time-lapse)
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

  // Hero scrubbé au scroll — time-lapse complet (1080p, upscalé).
  // ⚠️ Clip généré NON ré-encodé keyframe/frame : scrub potentiellement un peu
  // saccadé. Pour une fluidité parfaite, remplacer par les fichiers ré-encodés
  // locaux (public/media/hero-scrub/) et retirer ces 2 lignes.
  "/media/hero-scrub/hero-1920.mp4": `${CDN}/hf_20260719_232014_457c2481-cc80-445a-882e-9f04822b8c99.mp4`,
  "/media/hero-scrub/hero-1280.mp4": `${CDN}/hf_20260719_232014_457c2481-cc80-445a-882e-9f04822b8c99.mp4`,
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

  // Services
  "/media/services/sur-mesure.jpg": `${CDN}/hf_20260717_234622_5977f82d-98b1-4c87-84ff-79bc70076b35_min.webp`,
  "/media/services/debordement.jpg": `${CDN}/hf_20260717_235137_bb2c55b9-a8d5-4e88-86e3-fa34b3a78f74_min.webp`,
  "/media/services/renovation.jpg": `${CDN}/hf_20260717_235141_e587950f-efa9-42eb-b206-b088ae233505_min.webp`,
  "/media/services/entretien.jpg": `${CDN}/hf_20260717_234629_cdf8e06f-bfae-451e-88fb-70aa85dea2db_min.webp`,
  "/media/services/spa.jpg": `${CDN}/hf_20260717_235527_c7a3fd4a-312f-4c0e-95c2-19f0978641c9_min.webp`,

  // Réalisations
  "/media/realisations/villa-eze.jpg": `${CDN}/hf_20260717_235255_3dd4be1c-2904-460b-b3fa-df076fd8963d_min.webp`,
  "/media/realisations/cap-ferrat.jpg": `${CDN}/hf_20260717_235257_d9b2c96a-ac90-4d30-9717-8cc82bb04dbb_min.webp`,
  "/media/realisations/cannes-nuit.jpg": `${CDN}/hf_20260717_235301_d5ecfeb3-3548-4468-a31e-146b223e08f4_min.webp`,
  "/media/realisations/mougins.jpg": `${CDN}/hf_20260717_235304_b3ed4816-12cd-4abe-9b3a-571e30176e45_min.webp`,
  "/media/realisations/antibes.jpg": `${CDN}/hf_20260717_235414_19d21c97-e57e-482c-87b9-8388ff9b7428_min.webp`,
  "/media/realisations/saint-tropez.jpg": `${CDN}/hf_20260717_235417_7483c77e-cc15-4728-b67f-b71bc7bc326b_min.webp`,
  "/media/realisations/monaco.jpg": `${CDN}/hf_20260717_235420_12110b65-3491-4209-8972-4db35bb61bfb_min.webp`,
  "/media/realisations/menton.jpg": `${CDN}/hf_20260717_235425_fa284b56-71c1-446d-a202-41e2cf21321b_min.webp`,

  // Avis (miniatures)
  "/media/avis/avis-1.jpg": `${CDN}/hf_20260717_234554_c3a5e151-47d0-4954-8dbe-d565d9e1a5fd_min.webp`,
  "/media/avis/avis-2.jpg": `${CDN}/hf_20260717_234557_7ac06a42-307c-4b14-8482-c4b38eef89a3_min.webp`,
  "/media/avis/avis-3.jpg": `${CDN}/hf_20260717_234600_7e085ed3-30d8-40a4-be5b-9c4f6d7e49c2_min.webp`,
  "/media/avis/avis-4.jpg": `${CDN}/hf_20260717_235131_8cc561c3-a65f-4fd4-b2b6-de66e8a8e31b_min.webp`,
  "/media/avis/avis-5.jpg": `${CDN}/hf_20260717_235134_b65dcc7c-994c-450c-8c77-78421b3adfdd_min.webp`,
};

/** Renvoie l'URL distante si elle existe, sinon le chemin local d'origine. */
export function resolveMedia(path) {
  if (!path) return path;
  return mediaRemote[path] || path;
}

export default resolveMedia;
