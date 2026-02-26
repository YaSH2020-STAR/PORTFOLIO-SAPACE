#!/usr/bin/env python3
"""
PROTO — Core evaluations:
  1) Cross-species functional clustering (silhouette by alarm vs non-alarm)
  2) Cross-species transfer test (train on Monkey alarm/non-alarm, test on Deer)
  3) Baseline: random encoder comparison
"""
import argparse
import logging
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import silhouette_score, confusion_matrix, classification_report
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

from .config_loader import load_config, get_path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def load_embeddings_and_labels(cfg):
    emb_path = get_path(cfg, "embeddings_csv")
    labels_path = get_path(cfg, "labels_csv")
    if not emb_path.exists():
        raise FileNotFoundError(f"Run extract_features.py first: {emb_path}")
    df = pd.read_csv(emb_path)
    feat_cols = [c for c in df.columns if c.startswith("f")]
    X = df[feat_cols].values
    df["species"] = df["species"].astype(str)

    if labels_path.exists():
        labels_df = pd.read_csv(labels_path)
        # labels_df: clip, species, label (alarm=1, non_alarm=0)
        merge = df[["clip", "species"]].merge(
            labels_df[["clip", "species", "label"]],
            on=["clip", "species"],
            how="left",
        )
        y_func = merge["label"].values
        labeled_mask = pd.notna(y_func)
        y_func = np.where(labeled_mask, y_func.astype(int), -1)
    else:
        # No labels: use synthetic naming convention (monkey_0000_clip000 = alarm if clip index even)
        y_func = np.full(len(df), -1)
        labeled_mask = np.zeros(len(df), dtype=bool)
        for i, row in df.iterrows():
            clip = row["clip"]
            if "monkey_" in clip.lower() or "deer_" in clip.lower():
                try:
                    parts = clip.replace(".wav", "").split("_")
                    idx = int(parts[1]) if len(parts) > 1 else 0
                    y_func[i] = 1 if idx % 2 == 0 else 0
                    labeled_mask[i] = True
                except (ValueError, IndexError):
                    pass
    return df, X, y_func, labeled_mask, feat_cols


def eval1_silhouette_by_function(X, y_func, labeled_mask):
    """Silhouette score by FUNCTION (alarm vs non-alarm), only on labeled subset."""
    if labeled_mask.sum() < 10:
        logger.warning("Too few labeled clips for silhouette by function")
        return None
    X_l = X[labeled_mask]
    y_l = y_func[labeled_mask]
    if len(np.unique(y_l)) < 2:
        return None
    score = silhouette_score(X_l, y_l, metric="cosine")
    logger.info("Eval1 — Silhouette by function (alarm vs non-alarm): %.4f", score)
    return score


def eval2_transfer_test(df, X, y_func, labeled_mask, cfg):
    """Train linear classifier on Monkey alarm vs non-alarm; test on Deer."""
    species = df["species"].values
    monkey_mask = species == "Monkey"
    deer_mask = species == "Deer"
    monkey_labeled = monkey_mask & labeled_mask
    deer_labeled = deer_mask & labeled_mask
    if monkey_labeled.sum() < 10 or deer_labeled.sum() < 5:
        logger.warning("Insufficient labeled Monkey/Deer for transfer test")
        return None, None

    X_tr = X[monkey_labeled]
    y_tr = y_func[monkey_labeled]
    X_te = X[deer_labeled]
    y_te = y_func[deer_labeled]

    scaler = StandardScaler()
    X_tr_s = scaler.fit_transform(X_tr)
    X_te_s = scaler.transform(X_te)
    clf = LogisticRegression(max_iter=1000, random_state=cfg.get("seed", 42))
    clf.fit(X_tr_s, y_tr)
    acc = clf.score(X_te_s, y_te)
    y_pred = clf.predict(X_te_s)
    cm = confusion_matrix(y_te, y_pred)
    logger.info("Eval2 — Transfer test (Monkey→Deer) accuracy: %.4f", acc)
    logger.info("Confusion matrix (Deer):\n%s", cm)
    return acc, cm


def eval_baseline_random(df, X, y_func, labeled_mask, cfg):
    """Compare to random encoder: shuffle features and recompute transfer accuracy."""
    rng = np.random.default_rng(cfg.get("seed", 42))
    X_shuf = X.copy()
    for j in range(X_shuf.shape[1]):
        rng.shuffle(X_shuf[:, j])
    species = df["species"].values
    monkey_labeled = (species == "Monkey") & labeled_mask
    deer_labeled = (species == "Deer") & labeled_mask
    if monkey_labeled.sum() < 10 or deer_labeled.sum() < 5:
        return None
    X_tr = X_shuf[monkey_labeled]
    y_tr = y_func[monkey_labeled]
    X_te = X_shuf[deer_labeled]
    y_te = y_func[deer_labeled]
    scaler = StandardScaler()
    X_tr_s = scaler.fit_transform(X_tr)
    X_te_s = scaler.transform(X_te)
    clf = LogisticRegression(max_iter=1000, random_state=cfg.get("seed", 42))
    clf.fit(X_tr_s, y_tr)
    return clf.score(X_te_s, y_te)


def run(cfg):
    df, X, y_func, labeled_mask, _ = load_embeddings_and_labels(cfg)
    eval1_silhouette_by_function(X, y_func, labeled_mask)
    acc, cm = eval2_transfer_test(df, X, y_func, labeled_mask, cfg)
    baseline_acc = eval_baseline_random(df, X, y_func, labeled_mask, cfg)
    if baseline_acc is not None:
        logger.info("Baseline (shuffled features) transfer accuracy: %.4f", baseline_acc)
        if acc is not None:
            logger.info("SSL outperforms random: %s", acc > baseline_acc)
    return {"transfer_accuracy": acc, "confusion_matrix": cm, "baseline_accuracy": baseline_acc}


def main():
    parser = argparse.ArgumentParser()
    args = parser.parse_args()
    cfg = load_config()
    run(cfg)


if __name__ == "__main__":
    main()
