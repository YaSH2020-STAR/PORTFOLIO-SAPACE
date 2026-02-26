#!/usr/bin/env python3
"""
PROTO — Create data/clip_labels.csv for evaluation (alarm=1, non_alarm=0).
For synthetic data: auto-label by naming (monkey_0000_clip000 -> alarm if first index even).
For real data: create template CSV for manual labeling.
"""
import argparse
from pathlib import Path

import pandas as pd

from .config_loader import load_config, get_path


def auto_label_synthetic(cfg) -> pd.DataFrame:
    """Infer alarm (1) vs non_alarm (0) from synthetic clip naming: even index = alarm."""
    clips_base = get_path(cfg, "clips_1s")
    rows = []
    for species in cfg["species"]:
        d = clips_base / species
        if not d.exists():
            continue
        for path in sorted(d.glob("*.wav")):
            name = path.name
            label = -1
            try:
                # Support: monkey_0000.wav, monkey_0000_clip001.wav, deer_0001_clip000.wav
                stem = name.replace(".wav", "").replace(".WAV", "")
                parts = stem.split("_")
                if "monkey" in stem.lower() or "deer" in stem.lower():
                    # First numeric part after species name
                    for p in parts[1:]:
                        if p.isdigit():
                            idx = int(p)
                            label = 1 if idx % 2 == 0 else 0
                            break
            except (ValueError, IndexError):
                pass
            rows.append({"clip": name, "species": species, "label": label})
    return pd.DataFrame(rows)


def template_for_manual(cfg) -> pd.DataFrame:
    """List all clips with empty label for manual fill (0=non_alarm, 1=alarm)."""
    clips_base = get_path(cfg, "clips_1s")
    rows = []
    for species in cfg["species"]:
        d = clips_base / species
        if not d.exists():
            continue
        for path in sorted(d.glob("*.wav")):
            rows.append({"clip": path.name, "species": species, "label": ""})
    return pd.DataFrame(rows)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--template", action="store_true", help="Create empty template for manual labels")
    args = parser.parse_args()
    cfg = load_config()
    out_path = get_path(cfg, "labels_csv")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    if args.template:
        df = template_for_manual(cfg)
        df.to_csv(out_path, index=False)
        print(f"Template with {len(df)} rows saved to {out_path}. Fill column 'label' (0=non_alarm, 1=alarm).")
    else:
        df = auto_label_synthetic(cfg)
        df.to_csv(out_path, index=False)
        print(f"Auto-labeled {len(df)} clips -> {out_path}")


if __name__ == "__main__":
    main()
