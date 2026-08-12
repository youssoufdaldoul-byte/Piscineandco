"""Étape 5 : extract_keyframes — image représentative par scène + planche contact.

Compression : largeur plafonnée à 960px (JPEG qualité 85) pour rester lisible
(texte à l'écran) tout en limitant le volume de données envoyées au modèle.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from utils import format_timestamp_short, run

MAX_WIDTH = 960
JPEG_QUALITY = 85


def _extract_frame(video_path: Path, timestamp: float, out_path: Path) -> bool:
    cmd = [
        "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
        "-ss", str(timestamp), "-i", str(video_path),
        "-frames:v", "1", "-q:v", "3", str(out_path),
    ]
    proc = run(cmd)
    return proc.returncode == 0 and out_path.exists()


def _compress(path: Path) -> None:
    with Image.open(path) as img:
        img = img.convert("RGB")
        if img.width > MAX_WIDTH:
            ratio = MAX_WIDTH / img.width
            img = img.resize((MAX_WIDTH, int(img.height * ratio)), Image.LANCZOS)
        img.save(path, "JPEG", quality=JPEG_QUALITY, optimize=True)


def extract_keyframes(video_path: Path, scenes: list, keyframes_dir: Path) -> list:
    """Extrait une image au milieu de chaque scène. Retourne la liste des images clés."""
    keyframes = []
    for scene in scenes:
        mid = (scene["start"] + scene["end"]) / 2
        fname = f"scene_{scene['index']:03d}_t{format_timestamp_short(mid)}.jpg"
        out_path = keyframes_dir / fname
        ok = _extract_frame(video_path, mid, out_path)
        if not ok:
            continue
        _compress(out_path)
        keyframes.append({
            "scene_index": scene["index"],
            "timestamp": round(mid, 3),
            "scene_start": scene["start"],
            "scene_end": scene["end"],
            "file": str(out_path),
        })
    return keyframes


def build_contact_sheet(keyframes: list, out_path: Path, columns: int = 4) -> Path:
    if not keyframes:
        return None

    thumb_w = 240
    thumbs = []
    try:
        font = ImageFont.load_default()
    except Exception:
        font = None

    for kf in keyframes:
        with Image.open(kf["file"]) as img:
            img = img.convert("RGB")
            ratio = thumb_w / img.width
            thumb_h = int(img.height * ratio)
            thumb = img.resize((thumb_w, thumb_h), Image.LANCZOS)
            label_h = 18
            canvas = Image.new("RGB", (thumb_w, thumb_h + label_h), (20, 20, 20))
            canvas.paste(thumb, (0, 0))
            draw = ImageDraw.Draw(canvas)
            label = f"#{kf['scene_index']:03d} {kf['timestamp']:.1f}s"
            draw.text((4, thumb_h + 2), label, fill=(255, 255, 255), font=font)
            thumbs.append(canvas)

    rows = (len(thumbs) + columns - 1) // columns
    cell_w, cell_h = thumbs[0].size
    sheet = Image.new("RGB", (cell_w * columns, cell_h * rows), (0, 0, 0))
    for i, thumb in enumerate(thumbs):
        x = (i % columns) * cell_w
        y = (i // columns) * cell_h
        sheet.paste(thumb, (x, y))

    sheet.save(out_path, "JPEG", quality=85, optimize=True)
    return out_path
