#!/usr/bin/env python3
"""
PROTO — Extract 128-d embeddings for all clips using trained SSL encoder.
Output: outputs/audio_embeddings.csv (clip, species, f0, ..., f127)
"""
import argparse
import logging
import warnings
from pathlib import Path

import numpy as np
import pandas as pd
import torch
import soundfile as sf
import librosa
from tqdm import tqdm

from .config_loader import load_config, get_path
from .train_ssl import Encoder, log_mel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def load_encoder(cfg, device):
    out_dir = get_path(cfg, "models")
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", FutureWarning)
        ckpt = torch.load(out_dir / "ssl_model.pt", map_location=device, weights_only=False)
    model = Encoder(n_mels=cfg["n_mels"], embed_dim=cfg["embed_dim"])
    model.load_state_dict(ckpt["encoder"])
    model.to(device)
    model.eval()
    return model


def extract_embedding(model, wav_path: Path, sr: int, n_mels: int, device) -> np.ndarray:
    y, _ = sf.read(wav_path)
    if len(y.shape) > 1:
        y = y.mean(axis=1)
    mel = log_mel(y.astype(np.float32), sr, n_mels)
    x = torch.from_numpy(mel).float().unsqueeze(0).unsqueeze(0).to(device)
    with torch.no_grad():
        z = model(x)
    return z.cpu().numpy().flatten()


def run(cfg) -> None:
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = load_encoder(cfg, device)
    clips_base = get_path(cfg, "clips_1s")
    sr, n_mels = cfg["sr"], cfg["n_mels"]
    rows = []
    for species in cfg["species"]:
        d = clips_base / species
        if not d.exists():
            continue
        for path in tqdm(sorted(d.glob("*.wav")), desc=species):
            try:
                emb = extract_embedding(model, path, sr, n_mels, device)
            except Exception as e:
                logger.warning("Skip %s: %s", path.name, e)
                continue
            row = {"clip": path.name, "species": species}
            for i, v in enumerate(emb):
                row[f"f{i}"] = float(v)
            rows.append(row)
    df = pd.DataFrame(rows)
    out_path = get_path(cfg, "embeddings_csv")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(out_path, index=False)
    logger.info("Saved %d rows to %s", len(df), out_path)


def main():
    parser = argparse.ArgumentParser()
    args = parser.parse_args()
    cfg = load_config()
    run(cfg)


if __name__ == "__main__":
    main()
