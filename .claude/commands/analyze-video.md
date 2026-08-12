---
description: Analyse une vidéo locale (ou URL, avec confirmation) via le pipeline local tools/video-analysis
---

# /analyze-video

Analyse une vidéo en combinant métadonnées, transcription, scènes, images
clés, analyse visuelle et audio, puis produit un rapport Markdown structuré.

**Rappel important** : tu (Claude) ne reçois jamais le fichier vidéo
directement. Le script `tools/video-analysis/cli.py` transforme d'abord la
vidéo en données exploitables (JSON + images fixes). Tu lis ensuite ces
fichiers avec l'outil `Read` (y compris les images clés, que tu peux voir)
pour faire l'interprétation. Ne prétends jamais avoir "regardé la vidéo" —
tu as lu des images fixes et une transcription.

## Syntaxe attendue

```
/analyze-video chemin/vers/video.mp4
/analyze-video chemin/vers/video.mp4 --mode quick|standard|precise|audio_only|visual_only|custom
/analyze-video chemin/vers/video.mp4 --from 00:10 --to 01:30
/analyze-video chemin/vers/video.mp4 --fps 1
/analyze-video chemin/vers/video.mp4 --visual-only
/analyze-video chemin/vers/video.mp4 --output rapport.md
```

## Déroulé à suivre

1. **Vérifier** que le fichier existe, a une extension autorisée
   (`.mp4 .mov .mkv .webm .avi`) et n'est pas dans un chemin système. Si
   c'est une URL, demander confirmation explicite avant tout téléchargement
   et prévenir que le contenu quittera la machine locale.
2. **Exécuter le pipeline déterministe** (étapes 1 à 5, aucune IA) :
   ```bash
   python3 tools/video-analysis/cli.py "<chemin_video>" --mode <mode> [options]
   ```
   Cette commande affiche une bannière listant les services utilisés
   (toujours locaux par défaut : ffmpeg, faster-whisper) et le coût estimé
   (0 € en local). Si un modèle Whisper doit être téléchargé et que le
   réseau le bloque, proposer `--visual-only` en attendant et le signaler
   clairement dans le rapport final (ne jamais présenter la transcription
   comme faite si elle ne l'est pas).
3. **Lire les fichiers produits** dans le dossier de run
   (`.video-analysis-tmp/<run-id>/`) : `metadata.json`, `transcript.json`
   (si présent), `scenes.json`, `keyframes.json`, et chaque image dans
   `keyframes/` via `Read`.
4. **analyze_visuals** : pour chaque image clé, décrire dans un fichier
   `visual_analysis.json` : personnes/objets visibles, texte à l'écran,
   interface, décor, action, composition, couleurs, mouvement présumé
   (toujours qualifié d'hypothèse), éléments importants, niveau de
   confiance. Ne jamais inventer le contenu d'une image floue, ne jamais
   déduire l'identité d'une personne, ne jamais affirmer une émotion —
   utiliser "semble", "probablement" ou "non déterminable".
5. **analyze_audio** : à partir de `transcript.json` uniquement (jamais de
   l'audio brut, que tu ne peux pas écouter) : sujet, ton, structure,
   musique/bruit mentionnés si déductibles du texte, appels à l'action,
   phrases importantes. Signaler les segments marqués "incertain" dans la
   transcription sans les présenter comme fiables.
6. **build_timeline** : fichier `timeline.json` — pour chaque segment :
   timestamp début/fin, image associée, texte prononcé (ou "non
   disponible"), éléments visibles, action, importance.
7. **build_report** : `report.md` (ou le chemin donné par `--output`) avec
   les sections : résumé en cinq lignes, résumé détaillé, chronologie
   scène par scène, transcription, texte à l'écran, moments clés, éléments
   visuels, structure narrative, points forts, problèmes, idées
   réutilisables, questions non résolues, niveau de confiance global.

## Après l'analyse

- Ne supprimer les fichiers temporaires (audio brut) que si l'utilisateur le
  demande — le script le fait déjà automatiquement sauf `--keep-temp`.
- Ne jamais modifier la vidéo source.
- Ne jamais publier ou envoyer la vidéo/le rapport à un service externe sans
  demande explicite.
- Présenter le rapport et attendre validation avant d'enchaîner sur une
  éventuelle vidéo suivante, sauf instruction contraire.
