# 🎬 Médias à générer (Higgsfield / IA)

Déposez les fichiers générés dans `public/media/` en respectant **exactement** les
noms ci-dessous (référencés dans `src/config/entreprise.js`). En attendant, le site
affiche des placeholders propres et ne plante pas.

> Direction artistique commune à tous les médias :
> eau turquoise `#2FB6C4`, ciel/mer méditerranéens, lumière dorée de fin de journée,
> ambiance luxe discret, villas contemporaines, aucune personne au premier plan
> (sauf image artisan). Rendu photoréaliste, haute gamme, éditorial.

---

## 1. HERO — vidéo cinématique (priorité absolue)

| Fichier | Format | Durée |
|---|---|---|
| `public/media/hero/hero.mp4` | 16:9, 1920×1080, H.264, < 6 Mo (compressé) | ~10 s, boucle |
| `public/media/hero/hero-poster.jpg` | 1920×1080 (1re frame) | — |

**Prompt vidéo :**
> Cinematic slow push-in over a luxury infinity pool at golden hour on the French
> Riviera, perfectly still turquoise water reflecting a warm sunset, Mediterranean
> sea and hazy horizon in the background, modern villa edge on the side, subtle
> golden light glints on the water surface, ultra-realistic, shallow depth of field,
> smooth dolly-forward camera, 10 seconds, seamless loop, 4K, no people.

---

## 2. L'EXPÉRIENCE — 5 images de services (`public/media/services/`)

| Fichier | Prompt |
|---|---|
| `sur-mesure.jpg` | Bespoke contemporary pool integrated into a Riviera hillside villa, clean architectural lines, turquoise water, olive trees, golden hour, editorial architecture photography, no people |
| `debordement.jpg` | Stunning infinity edge pool overlooking the Mediterranean sea, water blending with the horizon, sunset reflections, luxury minimalist terrace, ultra-realistic, no people |
| `renovation.jpg` | Beautifully renovated modern pool, new mosaic tiling, crystal-clear turquoise water, elegant stone deck, warm afternoon light, high-end real estate photography |
| `entretien.jpg` | Close-up of pristine crystal-clear turquoise pool water with gentle ripples and light caustics, calm and luxurious, macro detail, sunlight |
| `spa.jpg` | Luxury built-in spa with glowing jets at dusk, warm ambient chromotherapy lighting, steam, elegant stone surround, Mediterranean villa, cinematic, no people |

---

## 3. NOS RÉALISATIONS — galerie (`public/media/realisations/`)

Photos verticales (portrait) et horizontales (paysage) mélangées, ~1200 px de large.

| Fichier | Prompt |
|---|---|
| `villa-eze.jpg` (portrait) | Infinity pool of a cliffside villa in Èze-sur-Mer, dramatic sea view, turquoise water, sunset, vertical composition, luxury, no people |
| `cap-ferrat.jpg` (paysage) | Elegant pool with panoramic Mediterranean sea view in Cap-Ferrat, pine trees, deep blue water, midday sun, wide luxury shot |
| `cannes-nuit.jpg` (paysage) | Illuminated pool at night in Cannes, glowing underwater lighting, turquoise glow, modern villa, reflections, cinematic blue hour |
| `mougins.jpg` (portrait) | Provençal luxury villa pool in Mougins, stone terrace, lavender, turquoise water, warm light, vertical |
| `antibes.jpg` (paysage) | Sleek indoor pool in an Antibes villa, glass walls, soft daylight, reflections, minimalist luxury interior |
| `saint-tropez.jpg` (portrait) | Glamorous infinity pool villa in Saint-Tropez, sun loungers, turquoise water, golden hour, vertical editorial |
| `monaco.jpg` (paysage) | Rooftop pool overlooking Monaco harbour and yachts, dusk city lights, luxury penthouse, wide shot |
| `menton.jpg` (portrait) | Mediterranean villa pool in Menton with citrus garden, colourful sunset, turquoise water, vertical |

---

## 4. NOTRE HISTOIRE — artisan (`public/media/histoire/`)

| Fichier | Prompt |
|---|---|
| `artisan.jpg` | Portrait of a distinguished French master pool builder in his 50s, standing confidently by a luxury infinity pool at golden hour, rolled sleeves, warm authentic expression, Mediterranean villa background, editorial photography |

---

## 5. AVIS CLIENTS — miniatures piscines (`public/media/avis/`)

`avis-1.jpg` … `avis-5.jpg` — petites images carrées de piscines réalisées
(réutiliser des variantes des réalisations, cadrées serré sur l'eau).

---

## 6. Divers

| Fichier | Usage |
|---|---|
| `public/media/og-image.jpg` | Aperçu réseaux sociaux (1200×630), la plus belle piscine à débordement |

---

### Conseils d'optimisation (perf mobile — exigence critique)
- Vidéo hero : compresser en H.264, viser **< 6 Mo**, retirer l'audio.
- Images : exporter en **WebP** ou JPEG qualité ~80, largeur max 1600 px.
- Fournir un `hero-poster.jpg` léger pour l'affichage instantané avant la vidéo.
