#!/usr/bin/env python3
"""
PROTO — Data collection: download real datasets and/or generate synthetic demo data.

Real data:
  - Macaque (Dryad): https://doi.org/10.5061/dryad.7f4p9  (Fukushima2015.zip)
  - Deer: use generate_synthetic_data for demo; see README for Dryad/field sources.

Usage:
  python -m src.download_data --dryad-macaque     # download Dryad macaque (requires network)
  python -m src.download_data --synthetic         # generate synthetic demo data (no network)
  python -m src.download_data --synthetic --dryad-macaque  # both
"""
from pathlib import Path
import argparse
import logging
import zipfile
import io

from .config_loader import load_config, PROJECT_ROOT

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def download_dryad_macaque(cfg: dict) -> None:
    """Download and unpack Dryad macaque vocalization dataset into data/raw_wav/Monkey."""
    try:
        import requests
    except ImportError:
        logger.warning("pip install requests for download_dryad_macaque")
        return
    raw_dir = Path(cfg["paths"]["raw_wav"]) / "Monkey"
    raw_dir.mkdir(parents=True, exist_ok=True)
    url = "https://datadryad.org/downloads/file_stream/8943"  # Fukushima2015.zip
    logger.info("Downloading Dryad macaque dataset (Fukushima2015.zip) ...")
    r = requests.get(url, stream=True, timeout=60)
    r.raise_for_status()
    buf = io.BytesIO(r.content)
    with zipfile.ZipFile(buf) as z:
        for name in z.namelist():
            if name.lower().endswith(".wav"):
                out_path = raw_dir / Path(name).name
                if out_path.exists():
                    continue
                out_path.write_bytes(z.read(name))
                logger.info("Extracted %s", out_path.name)
    logger.info("Dryad macaque data in %s", raw_dir)


def generate_synthetic_data(cfg: dict, n_monkey: int = 200, n_deer: int = 80) -> None:
    """
    Generate synthetic WAVs for pipeline testing when real data is unavailable.
    Creates two classes per species: 'alarm-like' (sharper, noisier) vs 'non-alarm' (tonal).
    """
    import numpy as np
    try:
        import soundfile as sf
        def write_wav(path: Path, y: np.ndarray) -> None:
            path.parent.mkdir(parents=True, exist_ok=True)
            sf.write(str(path), y, sr, subtype="PCM_16")
    except Exception:
        from scipy.io import wavfile
        def write_wav(path: Path, y: np.ndarray) -> None:
            path.parent.mkdir(parents=True, exist_ok=True)
            y16 = (np.clip(y, -1, 1) * 32767).astype(np.int16)
            wavfile.write(str(path), sr, y16)

    sr = cfg["sr"]
    clip_len = int(cfg["clip_len_sec"] * sr)
    rng = np.random.default_rng(cfg.get("seed", 42))

    # Monkey: mix of coo-like (tonal) and alarm-like (noisy, broader spectrum)
    raw_monkey = Path(cfg["paths"]["raw_wav"]) / "Monkey"
    raw_monkey.mkdir(parents=True, exist_ok=True)
    for i in range(n_monkey):
        alarm = i % 2 == 0
        t = np.linspace(0, cfg["clip_len_sec"], clip_len, False)
        if alarm:
            # Alarm-like: noisier, more energy in 1–4 kHz
            f0 = 800 + rng.uniform(0, 400)
            y = 0.3 * np.sin(2 * np.pi * f0 * t) + 0.4 * np.sin(2 * np.pi * 2 * f0 * t)
            y += 0.25 * rng.standard_normal(clip_len)
        else:
            # Non-alarm: cleaner coo-like tone
            f0 = 600 + rng.uniform(0, 300)
            y = 0.5 * np.sin(2 * np.pi * f0 * t) + 0.2 * np.sin(2 * np.pi * 2 * f0 * t)
            y += 0.05 * rng.standard_normal(clip_len)
        y = np.clip(y, -1, 1).astype(np.float32)
        write_wav(raw_monkey / f"monkey_{i:04d}.wav", y)

    # Deer: snort/alert vs resting
    raw_deer = Path(cfg["paths"]["raw_wav"]) / "Deer"
    raw_deer.mkdir(parents=True, exist_ok=True)
    for i in range(n_deer):
        alarm = i % 2 == 0
        t = np.linspace(0, cfg["clip_len_sec"], clip_len, False)
        if alarm:
            # Alarm-like: sharper burst + noise
            f0 = 400 + rng.uniform(0, 300)
            y = 0.35 * np.sin(2 * np.pi * f0 * t) * (1 + 0.5 * np.sin(2 * np.pi * 15 * t))
            y += 0.3 * rng.standard_normal(clip_len)
        else:
            f0 = 300 + rng.uniform(0, 200)
            y = 0.4 * np.sin(2 * np.pi * f0 * t) + 0.1 * rng.standard_normal(clip_len)
        y = np.clip(y, -1, 1).astype(np.float32)
        write_wav(raw_deer / f"deer_{i:04d}.wav", y)

    logger.info("Synthetic data: %d Monkey in %s, %d Deer in %s", n_monkey, raw_monkey, n_deer, raw_deer)


def main():
    parser = argparse.ArgumentParser(description="PROTO data collection")
    parser.add_argument("--dryad-macaque", action="store_true", help="Download Dryad macaque dataset")
    parser.add_argument("--synthetic", action="store_true", help="Generate synthetic demo WAVs")
    parser.add_argument("--n-monkey", type=int, default=200, help="Synthetic monkey clips")
    parser.add_argument("--n-deer", type=int, default=80, help="Synthetic deer clips")
    args = parser.parse_args()
    cfg = load_config()
    if args.dryad_macaque:
        download_dryad_macaque(cfg)
    if args.synthetic:
        generate_synthetic_data(cfg, n_monkey=args.n_monkey, n_deer=args.n_deer)
    if not (args.dryad_macaque or args.synthetic):
        parser.print_help()
        print("\nRun with --synthetic to generate demo data, or --dryad-macaque to download real macaque data.")


if __name__ == "__main__":
    main()
