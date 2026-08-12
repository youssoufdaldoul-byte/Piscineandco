"""Utilitaires communs : appels ffmpeg/ffprobe, timestamps, bannière de transparence."""

import json
import shutil
import subprocess
from pathlib import Path


class FfmpegNotFoundError(Exception):
    pass


def require_ffmpeg():
    if shutil.which("ffmpeg") is None or shutil.which("ffprobe") is None:
        raise FfmpegNotFoundError(
            "ffmpeg/ffprobe introuvables. Installer avec : sudo apt-get install -y ffmpeg"
        )


def run(cmd: list, timeout: int = 600) -> subprocess.CompletedProcess:
    return subprocess.run(
        cmd, capture_output=True, text=True, timeout=timeout, check=False
    )


def ffprobe_json(video_path: Path) -> dict:
    cmd = [
        "ffprobe", "-v", "quiet", "-print_format", "json",
        "-show_format", "-show_streams", str(video_path),
    ]
    proc = run(cmd)
    if proc.returncode != 0:
        raise RuntimeError(f"ffprobe a échoué : {proc.stderr.strip()}")
    return json.loads(proc.stdout)


def format_timestamp(seconds: float) -> str:
    """Format HH:MM:SS.mmm"""
    if seconds is None:
        return "??:??:??"
    seconds = max(0.0, seconds)
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = seconds % 60
    return f"{h:02d}:{m:02d}:{s:06.3f}"


def format_timestamp_short(seconds: float) -> str:
    """Format compact pour noms de fichiers : 00m03s500"""
    seconds = max(0.0, seconds)
    m = int(seconds // 60)
    s = seconds % 60
    return f"{m:02d}m{s:05.2f}s".replace(".", "_")


def parse_timestamp(value: str) -> float:
    """Parse 'SS', 'MM:SS' ou 'HH:MM:SS' en secondes."""
    if value is None:
        return None
    parts = value.strip().split(":")
    parts = [float(p) for p in parts]
    while len(parts) < 3:
        parts.insert(0, 0.0)
    h, m, s = parts[-3], parts[-2], parts[-1]
    return h * 3600 + m * 60 + s


def print_transparency_banner(services: list, cost_note: str):
    print("=" * 70)
    print("TRAITEMENT — TRANSPARENCE")
    print("=" * 70)
    for s in services:
        print(f"  - {s}")
    print(f"  Coût estimé : {cost_note}")
    print("=" * 70)


def write_json(path: Path, data) -> None:
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
