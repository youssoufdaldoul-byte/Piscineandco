"""Étape 2 : extract_audio — piste audio propre (WAV mono 16kHz) vers un fichier temporaire."""

from pathlib import Path

from utils import run


def extract_audio(video_path: Path, out_wav: Path, start: float = None, duration: float = None) -> bool:
    """Retourne True si l'audio a été extrait, False si la vidéo n'a pas de piste audio exploitable."""
    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error"]
    if start:
        cmd += ["-ss", str(start)]
    cmd += ["-i", str(video_path)]
    if duration:
        cmd += ["-t", str(duration)]
    cmd += ["-vn", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1", str(out_wav)]

    proc = run(cmd)
    if proc.returncode != 0:
        return False
    return out_wav.exists() and out_wav.stat().st_size > 44  # > taille d'un header WAV vide
