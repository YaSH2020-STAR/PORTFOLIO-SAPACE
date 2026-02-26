#!/usr/bin/env python3
"""
PROTO — Preprocessing: raw WAV → mono 16kHz, 1s clips, silence filtering.
Output: data/clips_1s/<Species>/*.wav
Uses librosa when available; falls back to scipy.io.wavfile if librosa fails (e.g. libgfortran on Anaconda).
"""
import argparse
import logging
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.io import wavfile
from scipy.signal import resample

from .config_loader import load_config, get_path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

_use_librosa = None


def _load_librosa(path: Path, sr: int):
    import librosa
    y, orig_sr = librosa.load(path, sr=None, mono=True)
    if orig_sr != sr:
        y = librosa.resample(y, orig_sr=orig_sr, target_sr=sr)
    return y.astype(np.float32)


def _load_scipy(path: Path, sr: int) -> np.ndarray:
    orig_sr, y = wavfile.read(path)
    if y.dtype in (np.int16, np.int32):
        y = y.astype(np.float32) / (np.iinfo(y.dtype).max + 1)
    if len(y.shape) > 1:
        y = y.mean(axis=1)
    if orig_sr != sr:
        n = int(len(y) * sr / orig_sr)
        y = resample(y, n).astype(np.float32)
    return y.astype(np.float32)


def load_and_resample(path: Path, sr: int) -> np.ndarray:
    global _use_librosa
    if _use_librosa is None:
        try:
            out = _load_librosa(path, sr)
            _use_librosa = True
            return out
        except Exception:
            logger.info("Falling back to scipy for WAV load (librosa failed).")
            _use_librosa = False
    if _use_librosa:
        return _load_librosa(path, sr)
    return _load_scipy(path, sr)


def slice_clips(y: np.ndarray, sr: int, clip_len_sec: float, silence_threshold_db: float, min_energy: float):
    clip_len = int(clip_len_sec * sr)
    step = clip_len
    clips = []
    for start in range(0, len(y) - clip_len + 1, step):
        seg = y[start : start + clip_len]
        rms = np.sqrt(np.mean(seg ** 2))
        if rms < min_energy:
            continue
        db = 20 * np.log10(rms + 1e-10)
        if db < silence_threshold_db:
            continue
        clips.append(seg)
    return clips


def run(cfg: dict, overwrite: bool = False) -> None:
    sr = cfg["sr"]
    clip_len_sec = cfg["clip_len_sec"]
    silence_threshold_db = cfg.get("silence_threshold_db", -40)
    min_energy = cfg.get("min_clip_energy", 1e-3)
    raw_base = get_path(cfg, "raw_wav")
    clips_base = get_path(cfg, "clips_1s")

    for species in cfg["species"]:
        raw_dir = raw_base / species
        out_dir = clips_base / species
        if not raw_dir.exists():
            logger.warning("Skipping %s: %s not found", species, raw_dir)
            continue
        out_dir.mkdir(parents=True, exist_ok=True)
        wavs = list(raw_dir.glob("*.wav")) + list(raw_dir.glob("*.WAV"))
        total = 0
        for path in wavs:
            try:
                y = load_and_resample(path, sr)
            except Exception as e:
                logger.warning("Failed %s: %s", path.name, e)
                continue
            clips = slice_clips(y, sr, clip_len_sec, silence_threshold_db, min_energy)
            for i, seg in enumerate(clips):
                out_name = f"{path.stem}_clip{i:03d}.wav"
                out_path = out_dir / out_name
                if out_path.exists() and not overwrite:
                    continue
                sf.write(str(out_path), seg, sr, subtype="PCM_16")
                total += 1
        logger.info("%s: %d clips in %s", species, total, out_dir)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--overwrite", action="store_true")
    args = parser.parse_args()
    cfg = load_config()
    run(cfg, overwrite=args.overwrite)


if __name__ == "__main__":
    main()
