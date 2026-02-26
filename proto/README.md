# PROTO — Cross-Species Acoustic Proto-Language Discovery

Investigation of **shared acoustic primitives** in vocalizations of sympatric species (e.g., Monkey and Deer), using self-supervised learning and proto-language-style evaluation.

## Quick start (synthetic demo)

Use a **virtual environment** so scipy/librosa work correctly (avoids Anaconda libgfortran issues on macOS):

```bash
cd proto
python -m venv venv && source venv/bin/activate   # or on Windows: venv\Scripts\activate
pip install -r requirements.txt
python run_pipeline.py
```

If you already ran `pip install -r requirements.txt` in the venv, just activate it and run the pipeline:

```bash
source venv/bin/activate
python run_pipeline.py
```

This will: generate synthetic Monkey/Deer WAVs → slice to 1s clips → create labels → train SSL encoder → extract embeddings → run all four evaluations → save figures to `outputs/figures/`.

## Data collection

### Option 1: Synthetic data (no network)

```bash
python -m src.download_data --synthetic --n-monkey 200 --n-deer 80
```

Generates WAVs in `data/raw_wav/Monkey/` and `data/raw_wav/Deer/` with alarm-like vs non-alarm-like structure for pipeline testing.

### Option 2: Real macaque vocalizations (Dryad)

- **Dataset:** [Distributed acoustic cues for caller identity in macaque vocalization](https://datadryad.org/dataset/doi:10.5061/dryad.7f4p9) (Fukushima et al., Dryad).
- **Contents:** WAV files, 8 macaques, coo calls (~132 MB).
- **Download:**  
  ```bash
  python -m src.download_data --dryad-macaque
  ```
  Or download [Fukushima2015.zip](https://datadryad.org/downloads/file_stream/8943) manually and extract WAVs into `data/raw_wav/Monkey/`.

### Option 3: Deer / other species

- **Deer vocalizations:** See e.g. [Deer mothers sensitive to infant distress vocalizations](https://datadryad.org/dataset/doi:10.5061/dryad.pj891), [African savannah herbivores alarm communication](https://datadryad.org/dataset/doi:10.5061/dryad.mb7dd20). Place WAVs in `data/raw_wav/Deer/`.
- **Manual labels:** For real data, create labels with  
  `python -m src.create_labels --template`  
  then fill the `label` column (0 = non_alarm, 1 = alarm) in `data/clip_labels.csv`.

## Pipeline steps

| Step | Script | Output |
|------|--------|--------|
| 1 | `src.download_data` | `data/raw_wav/<Species>/*.wav` |
| 2 | `src.make_clips` | `data/clips_1s/<Species>/*.wav` (mono 16 kHz, 1 s) |
| 3 | `src.create_labels` | `data/clip_labels.csv` |
| 4 | `src.train_ssl` | `models/ssl_model.pt` |
| 5 | `src.extract_features` | `outputs/audio_embeddings.csv` |
| 6 | `src.evaluate_transfer` | Console: silhouette, transfer accuracy, baseline |
| 7 | `src.retrieve_neighbors` | `outputs/retrieval/retrieval_metrics.csv` |
| 8 | `src.generate_visuals` | `outputs/figures/*.png` |

## Evaluations

1. **Cross-species functional clustering** — Silhouette score by alarm vs non-alarm (not by species).
2. **Cross-species transfer test** — Train linear classifier on Monkey alarm/non-alarm; test on Deer.
3. **Cross-species retrieval** — For Deer alarm clips, nearest Monkey clips vs random (cosine similarity).
4. **Low-dimensional proto-primitives** — PCA to 2–5 dimensions; check if alarm clustering persists.

## Config

Edit `config.yaml` for sample rate, mel bins, embedding size, training epochs, and paths.

## Citation (for Dryad macaque data)

Fukushima, M.; Doyle, A.M.; Mullarkey, M.P.; et al. (2015). Data from: Distributed acoustic cues for caller identity in macaque vocalization. Dryad. https://doi.org/10.5061/dryad.7f4p9

## Troubleshooting

- **`libgfortran` / scipy load errors on macOS:** Use a clean environment, e.g. `python -m venv venv && source venv/bin/activate` then `pip install -r requirements.txt`. If using Anaconda, try `conda install numpy scipy` to get compatible libraries.
- **No clips after make_clips:** Ensure `librosa` and `soundfile` (or `scipy`) work. Check that `data/raw_wav/Monkey/` and `data/raw_wav/Deer/` contain WAV files.
- **Auto-labeled 0 clips:** `create_labels` auto-labels only when clip names look like `monkey_0000_clip000.wav` or `deer_0001_clip002.wav` (from synthetic data). For other naming, use `python -m src.create_labels --template` and fill `data/clip_labels.csv` manually (0 = non_alarm, 1 = alarm).

## License

Project code: use as you like. External datasets follow their respective licenses (Dryad: CC0).
