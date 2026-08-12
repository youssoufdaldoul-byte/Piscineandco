"""Étape 3 : transcribe_audio — transcription locale (faster-whisper) avec timestamps et confiance."""

from pathlib import Path


def _confidence_label(avg_logprob: float, no_speech_prob: float) -> str:
    if no_speech_prob is not None and no_speech_prob > 0.6:
        return "incertain (probable silence/bruit)"
    if avg_logprob is not None and avg_logprob < -1.0:
        return "incertain"
    if avg_logprob is not None and avg_logprob < -0.5:
        return "moyennement fiable"
    return "fiable"


def transcribe_audio(wav_path: Path, model_size: str = "small", offset: float = 0.0) -> dict:
    """Transcrit localement avec faster-whisper. `offset` recale les timestamps sur la vidéo d'origine."""
    from faster_whisper import WhisperModel

    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    segments_iter, info = model.transcribe(
        str(wav_path),
        word_timestamps=True,
        vad_filter=True,
        beam_size=5,
    )

    segments = []
    for seg in segments_iter:
        segments.append({
            "start": round(seg.start + offset, 3),
            "end": round(seg.end + offset, 3),
            "text": seg.text.strip(),
            "avg_logprob": round(seg.avg_logprob, 3),
            "no_speech_prob": round(seg.no_speech_prob, 3),
            "confidence": _confidence_label(seg.avg_logprob, seg.no_speech_prob),
        })

    return {
        "model": f"faster-whisper/{model_size} (local, CPU)",
        "detected_language": info.language,
        "language_probability": round(info.language_probability, 3),
        "segments": segments,
        "uncertain_segment_count": sum(1 for s in segments if s["confidence"] != "fiable"),
    }
