"""Étape 1 : inspect_video — métadonnées via ffprobe."""

from pathlib import Path

from utils import ffprobe_json


def inspect_video(video_path: Path) -> dict:
    probe = ffprobe_json(video_path)
    fmt = probe.get("format", {})
    streams = probe.get("streams", [])

    video_stream = next((s for s in streams if s.get("codec_type") == "video"), None)
    audio_stream = next((s for s in streams if s.get("codec_type") == "audio"), None)

    fps = None
    if video_stream and video_stream.get("r_frame_rate"):
        num, _, den = video_stream["r_frame_rate"].partition("/")
        try:
            den = den or "1"
            fps = round(float(num) / float(den), 3) if float(den) != 0 else None
        except ValueError:
            fps = None

    duration = fmt.get("duration")
    duration = float(duration) if duration is not None else None

    metadata = {
        "file_name": video_path.name,
        "file_size_bytes": video_path.stat().st_size,
        "container_format": fmt.get("format_name"),
        "duration_seconds": duration,
        "resolution": {
            "width": video_stream.get("width") if video_stream else None,
            "height": video_stream.get("height") if video_stream else None,
        },
        "fps": fps,
        "video_codec": video_stream.get("codec_name") if video_stream else None,
        "has_audio": audio_stream is not None,
        "audio_codec": audio_stream.get("codec_name") if audio_stream else None,
        "audio_channels": audio_stream.get("channels") if audio_stream else None,
        "audio_sample_rate": audio_stream.get("sample_rate") if audio_stream else None,
    }
    return metadata
