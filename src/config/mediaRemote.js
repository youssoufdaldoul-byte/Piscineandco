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
