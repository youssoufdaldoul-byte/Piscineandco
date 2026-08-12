# Pipeline local d'analyse vidéo

Transforme une vidéo locale en données exploitables (métadonnées, audio,
transcription, scènes, images clés) pour que Claude Code puisse ensuite
produire une analyse et un rapport Markdown. **Claude ne reçoit jamais le
fichier vidéo lui-même** : ce script (déterministe, sans IA) produit du JSON
et des images fixes ; Claude lit ensuite ces fichiers via l'outil `Read`
(y compris les images, qu'il peut voir) pour faire l'interprétation.

## Étapes couvertes par ce script (1 à 5)

1. `inspect_video` — métadonnées via `ffprobe`.
2. `extract_audio` — piste audio propre en WAV mono 16 kHz (fichier temporaire).
3. `transcribe_audio` — transcription locale via `faster-whisper` (timestamps,
   niveau de confiance par segment, jamais présentée comme certaine).
4. `detect_scenes` — changements de scène via le filtre ffmpeg `select=scene`,
   avec repli sur un échantillonnage uniforme si la vidéo est visuellement
   continue. Le nombre de scènes est plafonné (`--max-keyframes` / mode).
5. `extract_keyframes` — une image représentative par scène (compressée,
   960px de large max) + planche contact.

Les étapes 6 à 9 (`analyze_visuals`, `analyze_audio`, `build_timeline`,
`build_report`) sont faites par Claude Code, pas par ce script.

## Dépendances

- `ffmpeg` / `ffprobe` (système, `apt install ffmpeg`)
- `faster-whisper`, `Pillow` (`pip install -r requirements.txt`)

**Note réseau** : `faster-whisper` télécharge son modèle depuis
`huggingface.co` au premier lancement d'une taille donnée. Si l'environnement
bloque ce domaine (politique d'egress), utiliser `--visual-only` /
`--mode visual_only` en attendant, ou fournir le modèle pré-téléchargé
localement (voir cache `~/.cache/huggingface`).

## Utilisation

```bash
python3 cli.py chemin/vers/video.mp4
python3 cli.py chemin/vers/video.mp4 --mode quick
python3 cli.py chemin/vers/video.mp4 --mode precise
python3 cli.py chemin/vers/video.mp4 --from 00:10 --to 01:30
python3 cli.py chemin/vers/video.mp4 --fps 1
python3 cli.py chemin/vers/video.mp4 --visual-only
python3 cli.py chemin/vers/video.mp4 --audio-only
```

Chaque exécution crée un dossier isolé sous `.video-analysis-tmp/<run-id>/`
(gitignoré) contenant `metadata.json`, `transcript.json`, `scenes.json`,
`keyframes.json`, `keyframes/*.jpg`, `contact_sheet.jpg`, `run_config.json`.
Les fichiers strictement temporaires (audio brut) sont supprimés en fin
d'exécution sauf `--keep-temp`.

## Sécurité

- Extensions autorisées : `.mp4 .mov .mkv .webm .avi` (voir `security.py`).
- Chemins système bloqués (`/etc`, `/root/.ssh`, `/usr`, etc.).
- URL distante : acceptée uniquement avec confirmation explicite
  (`validate_url(..., allow_download=True)`), jamais par défaut.
- Aucun appel à un service externe pour l'extraction (étapes 1,2,4,5) ;
  la transcription (étape 3) est locale (CPU, pas d'API).

## Limites connues

- Transcription CPU : lente sur de longues vidéos.
- Détection de scènes basée sur un seuil de changement de contenu : peut
  sous- ou sur-segmenter des vidéos peu contrastées.
- `mouvement_presume` est une lecture qualitative des images (pas d'analyse
  de flux optique), toujours signalée comme hypothèse.
- Aucune reconnaissance faciale, aucune identification de personne, aucune
  détection d'émotion.
