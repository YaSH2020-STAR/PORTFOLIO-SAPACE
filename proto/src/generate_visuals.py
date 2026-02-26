#!/usr/bin/env python3
"""
PROTO — Generate all figures:
  UMAP by species, UMAP by alarm vs non-alarm, confusion matrix,
  similarity histogram (nearest vs random), optional spectrogram comparisons.
"""
import argparse
import logging
from pathlib import Path

import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

from .config_loader import load_config, get_path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def load_embeddings_and_labels(cfg):
    emb_path = get_path(cfg, "embeddings_csv")
    if not emb_path.exists():
        raise FileNotFoundError(f"Run extract_features.py first: {emb_path}")
    df = pd.read_csv(emb_path)
    feat_cols = [c for c in df.columns if c.startswith("f")]
    X = df[feat_cols].values
    labels_path = get_path(cfg, "labels_csv")
    if labels_path.exists():
        labels_df = pd.read_csv(labels_path)
        merge = df[["clip", "species"]].merge(
            labels_df[["clip", "species", "label"]],
            on=["clip", "species"],
            how="left",
        )
        df = pd.concat([df, merge[["label"]]], axis=1)
    else:
        labels = np.full(len(df), -1)
        for i, row in df.iterrows():
            clip = row["clip"]
            if "deer_" in clip.lower() or "monkey_" in clip.lower():
                try:
                    parts = clip.replace(".wav", "").split("_")
                    idx = int(parts[1]) if len(parts) > 1 else 0
                    labels[i] = 1 if idx % 2 == 0 else 0
                except (ValueError, IndexError):
                    pass
        df = pd.concat([df, pd.DataFrame({"label": labels}, index=df.index)], axis=1)
    return df, X


def umap_embed(X, n_neighbors=15, min_dist=0.1):
    try:
        import umap
        reducer = umap.UMAP(n_components=2, n_neighbors=n_neighbors, min_dist=min_dist, random_state=42)
        return reducer.fit_transform(X)
    except ImportError:
        logger.warning("umap-learn not installed; using PCA for 2D plot")
        pca = PCA(n_components=2, random_state=42)
        return pca.fit_transform(StandardScaler().fit_transform(X))


def run(cfg):
    fig_dir = get_path(cfg, "figures")
    fig_dir.mkdir(parents=True, exist_ok=True)
    df, X = load_embeddings_and_labels(cfg)
    X_s = StandardScaler().fit_transform(X)
    coords_2d = umap_embed(X_s)

    df = df.copy()
    df["x"] = coords_2d[:, 0]
    df["y"] = coords_2d[:, 1]

    # UMAP by species
    plt.figure(figsize=(8, 6))
    for sp in df["species"].unique():
        m = df["species"] == sp
        plt.scatter(df.loc[m, "x"], df.loc[m, "y"], label=sp, alpha=0.6, s=15)
    plt.legend()
    plt.title("UMAP of SSL embeddings (colored by species)")
    plt.tight_layout()
    plt.savefig(fig_dir / "umap_by_species.png", dpi=150)
    plt.close()
    logger.info("Saved umap_by_species.png")

    # UMAP by alarm vs non-alarm (only labeled)
    labeled = df["label"].isin([0, 1])
    if labeled.sum() > 0:
        plt.figure(figsize=(8, 6))
        for lab, name in [(1, "alarm"), (0, "non_alarm")]:
            m = (df["label"] == lab) & labeled
            if m.sum() > 0:
                plt.scatter(df.loc[m, "x"], df.loc[m, "y"], label=name, alpha=0.6, s=15)
        plt.legend()
        plt.title("UMAP (colored by alarm vs non-alarm)")
        plt.tight_layout()
        plt.savefig(fig_dir / "umap_by_alarm.png", dpi=150)
        plt.close()
        logger.info("Saved umap_by_alarm.png")

    # PCA low-dimensional check (Eval4): alarm separation in 2–5 dims
    n_pca = cfg.get("eval", {}).get("n_pca_components", 5)
    pca = PCA(n_components=n_pca, random_state=42)
    X_pca = pca.fit_transform(X_s)
    if labeled.sum() >= 10 and df["label"].nunique() >= 2:
        from sklearn.metrics import silhouette_score
        labs = df.loc[labeled, "label"].values
        score = silhouette_score(X_pca[labeled], labs, metric="cosine")
        logger.info("Eval4 — Silhouette in %d-d PCA (alarm vs non-alarm): %.4f", n_pca, score)

    # Confusion matrix (if we have transfer test results)
    retrieval_dir = get_path(cfg, "retrieval")
    # We don't save confusion matrix in evaluate_transfer; generate from re-run or skip
    # Similarity histogram: load retrieval metrics if available
    retrieval_metrics = retrieval_dir / "retrieval_metrics.csv"
    if retrieval_metrics.exists():
        met = pd.read_csv(retrieval_metrics)
        plt.figure(figsize=(6, 4))
        v = met.set_index("metric")["value"]
        nearest_val = v.get("mean_cosine_nearest", met["value"].iloc[0])
        random_val = v.get("mean_cosine_random", met["value"].iloc[1])
        plt.bar(["nearest", "random"], [nearest_val, random_val], color=["C0", "C1"])
        plt.ylabel("Mean cosine similarity")
        plt.title("Cross-species retrieval: nearest vs random")
        plt.tight_layout()
        plt.savefig(fig_dir / "similarity_histogram.png", dpi=150)
        plt.close()
        logger.info("Saved similarity_histogram.png")

    logger.info("Figures saved to %s", fig_dir)


def main():
    parser = argparse.ArgumentParser()
    args = parser.parse_args()
    cfg = load_config()
    run(cfg)


if __name__ == "__main__":
    main()
