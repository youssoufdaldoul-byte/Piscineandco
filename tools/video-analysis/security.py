"""Validation de sécurité : extensions autorisées, chemins bloqués, dossier isolé."""

import os
import re
import time
from pathlib import Path

ALLOWED_EXTENSIONS = {".mp4", ".mov", ".mkv", ".webm", ".avi"}

# Préfixes de chemins système où la lecture/écriture est refusée.
SYSTEM_PATH_BLOCKLIST = (
    "/etc", "/boot", "/sys", "/proc", "/dev",
    "/root/.ssh", "/root/.aws", "/root/.gnupg",
    "/var/lib", "/var/backups", "/usr", "/bin", "/sbin", "/lib",
)


class SecurityError(Exception):
    pass


def validate_local_video(path: str) -> Path:
    """Vérifie l'existence, l'extension et l'emplacement d'un fichier vidéo local."""
    resolved = Path(path).expanduser().resolve()

    if not resolved.exists():
        raise SecurityError(f"Fichier introuvable : {resolved}")
    if not resolved.is_file():
        raise SecurityError(f"Le chemin n'est pas un fichier : {resolved}")

    ext = resolved.suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise SecurityError(
            f"Extension non autorisée : {ext} (autorisées : {sorted(ALLOWED_EXTENSIONS)})"
        )

    resolved_str = str(resolved)
    for blocked in SYSTEM_PATH_BLOCKLIST:
        if resolved_str == blocked or resolved_str.startswith(blocked + os.sep):
            raise SecurityError(f"Chemin système bloqué : {resolved}")

    return resolved


def validate_url(url: str, allow_download: bool) -> str:
    """Les URLs ne sont acceptées qu'avec confirmation explicite (--allow-download)."""
    if not re.match(r"^https?://", url):
        raise SecurityError("Seules les URLs http(s) sont acceptées.")
    if not allow_download:
        raise SecurityError(
            "Téléchargement bloqué : une vidéo distante ne sera récupérée qu'avec "
            "--allow-download, après avertissement explicite à l'utilisateur."
        )
    return url


def make_isolated_run_dir(base_dir: Path, video_path: Path) -> Path:
    """Crée un dossier de travail isolé et unique pour cette analyse."""
    base_dir = Path(base_dir).resolve()
    base_dir.mkdir(parents=True, exist_ok=True)

    slug = re.sub(r"[^a-zA-Z0-9_-]+", "-", video_path.stem)[:60].strip("-") or "video"
    run_id = f"{slug}-{int(time.time())}"
    run_dir = base_dir / run_id
    run_dir.mkdir(parents=True, exist_ok=False)
    (run_dir / "keyframes").mkdir()
    return run_dir


def cleanup_temp_files(run_dir: Path, keep_names: set) -> list:
    """Supprime tout fichier/dossier du run_dir qui n'est pas dans keep_names. Retourne la liste supprimée."""
    removed = []
    for entry in sorted(run_dir.iterdir()):
        if entry.name in keep_names:
            continue
        if entry.is_dir():
            for f in entry.rglob("*"):
                if f.is_file():
                    f.unlink()
            try:
                entry.rmdir()
            except OSError:
                pass
            removed.append(str(entry))
        else:
            entry.unlink()
            removed.append(str(entry))
    return removed
