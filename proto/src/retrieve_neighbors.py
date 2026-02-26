#!/usr/bin/env python3
"""
PROTO — Evaluation 3: Cross-species retrieval.
For each Deer alarm clip, retrieve nearest Monkey clips in embedding space.
Report cosine similarity: nearest vs random.
"""
import argparse
import logging
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

from .config_loader import load_config, get_path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def load_embeddings_and_labels(cfg):
    emb_path = get_path(cfg, "embeddings_csv")
    labels_path = get_path(cfg, "labels_csv")
    df = pd.read_csv(emb_path)
    feat_cols = [c for c in df.columns if c.startswith("f")]
    X = np.asarray(df[feat_cols], dtype=np.float32)
    df = df.copy()

    if labels_path.exists():
        labels_df = pd.read_csv(labels_path)
        merge = df[["clip", "species"]].merge(
            labels_df[["clip", "species", "label"]],
            on=["clip", "species"],
            how="left",
        )
        df["label"] = merge["label"]
    else:
        df["label"] = -1
        for i, row in df.iterrows():
            clip = row["clip"]
            if "deer_" in clip.lower() or "monkey_" in clip.lower():
                try:
                    parts = clip.replace(".wav", "").split("_")
                    idx = int(parts[1]) if len(parts) > 1 else 0
                    df.loc[i, "label"] = 1 if idx % 2 == 0 else 0
                except (ValueError, IndexError):
                    pass
    return df, X


def run(cfg, n_neighbors=10, n_random=50):
    df, X = load_embeddings_and_labels(cfg)
    species = df["species"].values
    label = df["label"].values
    deer_alarm = (species == "Deer") & (label == 1)
    monkey_idx = np.where(species == "Monkey")[0]
    if deer_alarm.sum() == 0 or len(monkey_idx) == 0:
        logger.warning("Need Deer alarm clips and Monkey clips for retrieval")
        return

    deer_alarm_idx = np.where(deer_alarm)[0]
    X_deer = X[deer_alarm_idx]
    X_monkey = X[monkey_idx]
    sim_matrix = cosine_similarity(X_deer, X_monkey)

    nearest_sims = []
    random_sims = []
    rng = np.random.default_rng(cfg.get("seed", 42))
    for i in range(len(deer_alarm_idx)):
        sims = sim_matrix[i]
        top_k_idx = np.argsort(sims)[-n_neighbors:]
        nearest_sims.extend(sims[top_k_idx])
        rand_idx = rng.choice(len(monkey_idx), size=min(n_random, len(monkey_idx)), replace=False)
        random_sims.extend(sims[rand_idx])
    nearest_mean = np.mean(nearest_sims)
    random_mean = np.mean(random_sims)
    logger.info("Eval3 — Retrieval: mean cosine nearest %.4f vs random %.4f", nearest_mean, random_mean)
    logger.info("Nearest > random: %s", nearest_mean > random_mean)

    out_dir = get_path(cfg, "retrieval")
    out_dir.mkdir(parents=True, exist_ok=True)
    results = pd.DataFrame({
        "metric": ["mean_cosine_nearest", "mean_cosine_random", "difference"],
        "value": [nearest_mean, random_mean, nearest_mean - random_mean],
    })
    results.to_csv(out_dir / "retrieval_metrics.csv", index=False)
    return {"nearest": nearest_mean, "random": random_mean}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--n-neighbors", type=int, default=10)
    parser.add_argument("--n-random", type=int, default=50)
    args = parser.parse_args()
    cfg = load_config()
    run(cfg, n_neighbors=args.n_neighbors, n_random=args.n_random)


if __name__ == "__main__":
    main()
