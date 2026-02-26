# Data layout

- **raw_wav/Monkey/** — Original WAVs (monkey vocalizations). From synthetic generator or [Dryad macaque dataset](https://datadryad.org/dataset/doi:10.5061/dryad.7f4p9).
- **raw_wav/Deer/** — Original WAVs (deer vocalizations). From synthetic generator or your own recordings / [Dryad herbivore datasets](https://datadryad.org/dataset/doi:10.5061/dryad.mb7dd20).
- **clips_1s/Monkey/**, **clips_1s/Deer/** — Created by `make_clips.py`: mono 16 kHz, 1 s clips, silence filtered.
- **clip_labels.csv** — Optional; columns: `clip`, `species`, `label` (0 = non_alarm, 1 = alarm). Create with `python -m src.create_labels` or `--template` for manual labeling.
