"""Étape 4 : detect_scenes — changements de scène via le filtre ffmpeg `select=gt(scene,...)`.

Limite volontairement le nombre de scènes retenues pour éviter une explosion
du nombre d'images clés (voir PERFORMANCE dans la spec).
"""

import re
from pathlib import Path

from utils import run

SCENE_TIME_RE = re.compile(r"pts_time:([\d.]+)")


def _detect_boundaries(video_path: Path, threshold: float, start: float, duration: float) -> list:
    cmd = ["ffmpeg", "-hide_banner"]
    if start:
        cmd += ["-ss", str(start)]
    cmd += ["-i", str(video_path)]
    if duration:
        cmd += ["-t", str(duration)]
    cmd += ["-vf", f"select='gt(scene,{threshold})',showinfo", "-f", "null", "-"]

    proc = run(cmd, timeout=900)
    times = [float(m) for m in SCENE_TIME_RE.findall(proc.stderr)]
    return sorted(set(times))


def _cap_list(values: list, max_count: int) -> list:
    if len(values) <= max_count:
        return values
    step = len(values) / max_count
    return [values[int(i * step)] for i in range(max_count)]


def detect_scenes(video_path: Path, video_duration: float, max_scenes: int = 20,
                   threshold: float = 0.35, start: float = 0.0, duration: float = None) -> list:
    """Retourne une liste de scènes {index, start, end} en secondes, offsets sur la vidéo d'origine."""
    clip_duration = duration if duration else (video_duration - start)
    boundaries = _detect_boundaries(video_path, threshold, start, duration)

    # Offset : les temps retournés par ffmpeg sont relatifs au clip découpé (-ss avant -i).
    boundaries = [round(t + start, 3) for t in boundaries]

    # Vidéo statique / peu de coupures détectées : repli sur un échantillonnage temporel uniforme.
    if len(boundaries) < 2:
        n = min(max_scenes, max(2, int(clip_duration // 3) or 2))
        boundaries = [round(start + i * clip_duration / n, 3) for i in range(n)]

    if boundaries[0] > start + 0.01:
        boundaries.insert(0, round(start, 3))

    boundaries = _cap_list(boundaries, max_scenes)

    end_of_clip = round(start + clip_duration, 3)
    scenes = []
    for i, t0 in enumerate(boundaries):
        t1 = boundaries[i + 1] if i + 1 < len(boundaries) else end_of_clip
        if t1 <= t0:
            continue
        scenes.append({"index": i, "start": t0, "end": t1})

    return scenes
