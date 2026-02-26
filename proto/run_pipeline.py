#!/usr/bin/env python3
"""
PROTO — Run full pipeline: data -> clips -> labels -> train SSL -> extract -> evaluate -> visuals.
Usage: from project root:  python run_pipeline.py [--skip-download] [--epochs 20]
"""
import argparse
import subprocess
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent


def run(cmd, cwd=None):
    cwd = cwd or PROJECT_ROOT
    print(f"\n>>> {cmd}")
    r = subprocess.run(cmd, shell=True, cwd=cwd)
    if r.returncode != 0:
        print(f"Exit code {r.returncode}", file=sys.stderr)
        sys.exit(r.returncode)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--skip-download", action="store_true", help="Skip synthetic data generation")
    parser.add_argument("--skip-train", action="store_true", help="Skip SSL training (use existing model)")
    parser.add_argument("--epochs", type=int, default=None)
    parser.add_argument("--dryad", action="store_true", help="Download Dryad macaque (requires network)")
    args = parser.parse_args()

    if not args.skip_download:
        run("python -m src.download_data --synthetic")
        if args.dryad:
            run("python -m src.download_data --dryad-macaque")

    run("python -m src.make_clips")
    run("python -m src.create_labels")

    if not args.skip_train:
        cmd = "python -m src.train_ssl"
        if args.epochs is not None:
            cmd += f" --epochs {args.epochs}"
        run(cmd)

    run("python -m src.extract_features")
    run("python -m src.evaluate_transfer")
    run("python -m src.retrieve_neighbors")
    run("python -m src.generate_visuals")

    print("\nPipeline complete. Check outputs/figures/ and outputs/retrieval/")


if __name__ == "__main__":
    main()
