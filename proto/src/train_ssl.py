#!/usr/bin/env python3
"""
PROTO — Self-supervised representation learning (SimCLR-style InfoNCE).
Input: log-mel spectrogram 80 mel bins. Encoder: small CNN → 128-d → projection head.
"""
import argparse
import logging
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader
import soundfile as sf
import librosa

from .config_loader import load_config, get_path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def log_mel(signal: np.ndarray, sr: int, n_mels: int = 80, n_fft: int = 512, hop: int = 160) -> np.ndarray:
    S = librosa.feature.melspectrogram(y=signal, sr=sr, n_mels=n_mels, n_fft=n_fft, hop_length=hop)
    return librosa.power_to_db(S + 1e-8, ref=np.max).astype(np.float32)


class ClipDataset(Dataset):
    def __init__(self, clip_paths, sr, n_mels, augment=True, max_time_shift_sec=0.1, noise_std=0.005):
        self.clip_paths = clip_paths
        self.sr = sr
        self.n_mels = n_mels
        self.augment = augment
        self.max_shift = int(max_time_shift_sec * sr)
        self.noise_std = noise_std

    def __len__(self):
        return len(self.clip_paths)

    def _load_mel(self, path):
        y, _ = sf.read(path)
        if len(y.shape) > 1:
            y = y.mean(axis=1)
        if self.augment and self.max_shift > 0:
            shift = np.random.randint(-self.max_shift, self.max_shift + 1)
            y = np.roll(y, shift)
        if self.augment and self.noise_std > 0:
            y = y + np.random.randn(len(y)).astype(np.float32) * self.noise_std
        mel = log_mel(y, self.sr, self.n_mels)
        return mel

    def __getitem__(self, i):
        mel_a = self._load_mel(self.clip_paths[i])
        mel_b = self._load_mel(self.clip_paths[i])
        return torch.from_numpy(mel_a).unsqueeze(0), torch.from_numpy(mel_b).unsqueeze(0)


class Encoder(nn.Module):
    """Small CNN: (1, n_mels, T) -> 128-d."""

    def __init__(self, n_mels=80, embed_dim=128):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(1, 32, 3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(64, 128, 3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d(1),
        )
        self.fc = nn.Linear(128, embed_dim)

    def forward(self, x):
        h = self.conv(x)
        h = h.view(h.size(0), -1)
        return self.fc(h)


class ProjectionHead(nn.Module):
    def __init__(self, embed_dim=128, proj_dim=64):
        super().__init__()
        self.mlp = nn.Sequential(
            nn.Linear(embed_dim, embed_dim),
            nn.ReLU(),
            nn.Linear(embed_dim, proj_dim),
        )

    def forward(self, z):
        return self.mlp(z)


def info_nce_loss(z_i, z_j, temperature=0.07):
    batch = z_i.size(0)
    z_i = F.normalize(z_i, dim=1)
    z_j = F.normalize(z_j, dim=1)
    logits = torch.mm(z_i, z_j.t()) / temperature
    labels = torch.arange(batch, device=z_i.device)
    return F.cross_entropy(logits, labels)


def collect_clip_paths(cfg):
    clips_base = get_path(cfg, "clips_1s")
    paths = []
    for species in cfg["species"]:
        d = clips_base / species
        if d.exists():
            paths.extend(d.glob("*.wav"))
    return [str(p) for p in paths]


def train_epoch(model, proj, opt, loader, device, temperature):
    model.train()
    proj.train()
    total_loss = 0.0
    n_batches = 0
    for (x_a, x_b) in loader:
        x_a, x_b = x_a.to(device), x_b.to(device)
        h_a = model(x_a)
        h_b = model(x_b)
        z_a = proj(h_a)
        z_b = proj(h_b)
        loss = (info_nce_loss(z_a, z_b, temperature) + info_nce_loss(z_b, z_a, temperature)) / 2
        opt.zero_grad()
        loss.backward()
        opt.step()
        total_loss += loss.item()
        n_batches += 1
    return total_loss / max(n_batches, 1)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--epochs", type=int, default=None)
    parser.add_argument("--batch-size", type=int, default=None)
    parser.add_argument("--lr", type=float, default=None)
    args = parser.parse_args()
    cfg = load_config()
    torch.manual_seed(cfg.get("seed", 42))

    paths = collect_clip_paths(cfg)
    if not paths:
        logger.error("No clips found under %s. Run make_clips.py first.", get_path(cfg, "clips_1s"))
        return
    logger.info("Training on %d clips", len(paths))

    dataset = ClipDataset(paths, cfg["sr"], cfg["n_mels"], augment=True)
    batch_size = int(args.batch_size or cfg.get("batch_size", 64))
    loader = DataLoader(
        dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=0,
        pin_memory=False,
    )
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = Encoder(n_mels=int(cfg["n_mels"]), embed_dim=int(cfg["embed_dim"])).to(device)
    proj = ProjectionHead(embed_dim=int(cfg["embed_dim"]), proj_dim=int(cfg.get("projection_dim", 64))).to(device)
    lr = float(args.lr if args.lr is not None else cfg.get("lr", 1e-3))
    opt = torch.optim.Adam(list(model.parameters()) + list(proj.parameters()), lr=lr)
    epochs = int(args.epochs or cfg.get("epochs", 50))
    temp = float(cfg.get("temperature", 0.07))

    for ep in range(epochs):
        loss = train_epoch(model, proj, opt, loader, device, temp)
        if (ep + 1) % 10 == 0 or ep == 0:
            logger.info("Epoch %d loss %.4f", ep + 1, loss)

    out_dir = get_path(cfg, "models")
    out_dir.mkdir(parents=True, exist_ok=True)
    state = {"encoder": model.state_dict(), "config": {k: v for k, v in cfg.items() if k != "paths"}}
    torch.save(state, out_dir / "ssl_model.pt")
    logger.info("Saved %s", out_dir / "ssl_model.pt")


if __name__ == "__main__":
    main()
