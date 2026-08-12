#!/usr/bin/env python3
"""Pipeline local d'analyse vidéo — étapes déterministes (1 à 5).

Ce script ne fait AUCUNE interprétation : il ne fait que transformer la vidéo
en données exploitables (métadonnées, audio, transcription, scènes, images
clés). L'interprétation (analyse visuelle, analyse audio, chronologie,
rapport) est faite ensuite par Claude Code, qui lit les fichiers produits ici
via l'outil Read — jamais la vidéo elle-même.

Aucun service externe n'est appelé. Tout tourne en local (ffmpeg + faster-whisper).
"""

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from security import SecurityError, cleanup_temp_files, make_isolated_run_dir, validate_local_video
from utils import FfmpegNotFoundError, format_timestamp, parse_timestamp, print_transparency_banner, require_ffmpeg, write_json
from inspect_video import inspect_video
from extract_audio import extract_audio
from transcribe_audio import transcribe_audio
from detect_scenes import detect_scenes
from extract_keyframes import build_contact_sheet, extract_keyframes

MODE_DEFAULTS = {
    "quick":       {"max_scenes": 6,  "whisper_model": "base",  "do_audio": True,  "do_visual": True},
    "standard":    {"max_scenes": 15, "whisper_model": "small", "do_audio": True,  "do_visual": True},
    "precise":     {"max_scenes": 30, "whisper_model": "small", "do_audio": True,  "do_visual": True},
    "audio_only":  {"max_scenes": 0,  "whisper_model": "small", "do_audio": True,  "do_visual": False},
    "visual_only": {"max_scenes": 15, "whisper_model": None,    "do_audio": False, "do_visual": True},
    "custom":      {"max_scenes": 15, "whisper_model": "small", "do_audio": True,  "do_visual": True},
}

DEFAULT_TEMP_BASE = Path(__file__).resolve().parents[2] / ".video-analysis-tmp"


def build_arg_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Pipeline local d'analyse vidéo (étapes 1-5).")
    p.add_argument("video", help="Chemin local du fichier vidéo (.mp4 .mov .mkv .webm .avi)")
    p.add_argument("--mode", choices=list(MODE_DEFAULTS), default="standard")
    p.add_argument("--from", dest="from_ts", default=None, help="Début (MM:SS ou HH:MM:SS)")
    p.add_argument("--to", dest="to_ts", default=None, help="Fin (MM:SS ou HH:MM:SS)")
    p.add_argument("--fps", type=float, default=None, help="Échantillonnage uniforme (images/s) au lieu de la détection de scènes")
    p.add_argument("--visual-only", action="store_true")
    p.add_argument("--audio-only", action="store_true")
    p.add_argument("--max-keyframes", type=int, default=None)
    p.add_argument("--whisper-model", default=None, choices=["tiny", "base", "small", "medium"])
    p.add_argument("--scene-threshold", type=float, default=0.35)
    p.add_argument("--keep-temp", action="store_true", help="Conserver tous les fichiers temporaires (audio inclus)")
    p.add_argument("--temp-base", default=str(DEFAULT_TEMP_BASE))
    return p


def resolve_mode(args) -> dict:
    mode = args.mode
    if args.visual_only:
        mode = "visual_only"
    if args.audio_only:
        mode = "audio_only"
    cfg = dict(MODE_DEFAULTS[mode])
    cfg["mode"] = mode
    if args.max_keyframes is not None:
        cfg["max_scenes"] = args.max_keyframes
    if args.whisper_model is not None:
        cfg["whisper_model"] = args.whisper_model
    return cfg


def main():
    args = build_arg_parser().parse_args()
    cfg = resolve_mode(args)

    try:
        require_ffmpeg()
        video_path = validate_local_video(args.video)
    except (FfmpegNotFoundError, SecurityError) as e:
        print(f"ERREUR : {e}", file=sys.stderr)
        sys.exit(1)

    run_dir = make_isolated_run_dir(Path(args.temp_base), video_path)
    print(f"Dossier de travail isolé : {run_dir}")

    services = ["ffmpeg (local) — métadonnées, audio, scènes, images clés"]
    if cfg["do_audio"]:
        services.append(f"faster-whisper modèle '{cfg['whisper_model']}' (local, CPU) — transcription")
    print_transparency_banner(services, cost_note="0 € (traitement 100% local, aucun appel API)")

    # --- Étape 1 : inspect_video ---
    metadata = inspect_video(video_path)
    write_json(run_dir / "metadata.json", metadata)
    duration = metadata["duration_seconds"] or 0.0
    print(f"[1/5] inspect_video : durée={duration:.1f}s résolution={metadata['resolution']} audio={metadata['has_audio']}")

    start = parse_timestamp(args.from_ts) if args.from_ts else 0.0
    end = parse_timestamp(args.to_ts) if args.to_ts else duration
    clip_duration = max(0.1, end - start) if (args.from_ts or args.to_ts) else None

    keep_names = {"metadata.json", "run_config.json"}

    # --- Étape 2+3 : extract_audio + transcribe_audio ---
    transcript = None
    if cfg["do_audio"] and metadata["has_audio"]:
        audio_path = run_dir / "audio_temp.wav"
        ok = extract_audio(video_path, audio_path, start=start if clip_duration else None, duration=clip_duration)
        if ok:
            print(f"[2/5] extract_audio : {audio_path.name} ({audio_path.stat().st_size // 1024} Ko)")
            print(f"[3/5] transcribe_audio : modèle {cfg['whisper_model']} (téléchargement au 1er lancement si absent)...")
            transcript = transcribe_audio(audio_path, model_size=cfg["whisper_model"], offset=start if clip_duration else 0.0)
            write_json(run_dir / "transcript.json", transcript)
            print(f"   -> {len(transcript['segments'])} segments, {transcript['uncertain_segment_count']} incertains, langue détectée : {transcript['detected_language']}")
            keep_names.add("transcript.json")
            if not args.keep_temp:
                audio_path.unlink(missing_ok=True)
            else:
                keep_names.add("audio_temp.wav")
        else:
            print("[2-3/5] extract_audio a échoué ou aucune piste exploitable — étapes audio ignorées.")
    elif cfg["do_audio"] and not metadata["has_audio"]:
        print("[2-3/5] Vidéo sans piste audio détectée — transcription ignorée.")
    else:
        print("[2-3/5] Ignoré (mode visual_only).")

    # --- Étape 4 : detect_scenes ---
    scenes = []
    keyframes = []
    if cfg["do_visual"]:
        max_scenes = cfg["max_scenes"]
        if args.fps:
            n = max(1, int((clip_duration or duration) * args.fps))
            max_scenes = min(max_scenes or n, n, 60)
        scenes = detect_scenes(
            video_path, duration, max_scenes=max_scenes or 15,
            threshold=args.scene_threshold, start=start, duration=clip_duration,
        )
        write_json(run_dir / "scenes.json", scenes)
        keep_names.add("scenes.json")
        print(f"[4/5] detect_scenes : {len(scenes)} scènes retenues (plafond {max_scenes})")

        # --- Étape 5 : extract_keyframes ---
        keyframes = extract_keyframes(video_path, scenes, run_dir / "keyframes")
        write_json(run_dir / "keyframes.json", keyframes)
        keep_names.add("keyframes.json")
        keep_names.add("keyframes")
        print(f"[5/5] extract_keyframes : {len(keyframes)} images clés extraites -> {run_dir / 'keyframes'}")

        sheet_path = build_contact_sheet(keyframes, run_dir / "contact_sheet.jpg")
        if sheet_path:
            keep_names.add("contact_sheet.jpg")
            print(f"   -> planche contact : {sheet_path}")
    else:
        print("[4-5/5] Ignoré (mode audio_only).")

    run_config = {
        "video_source": str(video_path),
        "mode": cfg["mode"],
        "clip_start_seconds": start,
        "clip_end_seconds": end if clip_duration else duration,
        "scene_threshold": args.scene_threshold,
        "fps_override": args.fps,
        "whisper_model": cfg["whisper_model"],
        "scenes_count": len(scenes),
        "keyframes_count": len(keyframes),
    }
    write_json(run_dir / "run_config.json", run_config)

    removed = []
    if not args.keep_temp:
        removed = cleanup_temp_files(run_dir, keep_names)

    print("=" * 70)
    print(f"Pipeline terminé. Fichiers disponibles dans : {run_dir}")
    if removed:
        print(f"Fichiers temporaires supprimés : {len(removed)}")
    print("=" * 70)


if __name__ == "__main__":
    main()
