"""Load config and resolve paths relative to project root."""
from pathlib import Path
import yaml

PROJECT_ROOT = Path(__file__).resolve().parent.parent


def load_config(config_path: Path = None) -> dict:
    if config_path is None:
        config_path = PROJECT_ROOT / "config.yaml"
    with open(config_path) as f:
        cfg = yaml.safe_load(f)
    # Resolve paths
    for key, val in cfg.get("paths", {}).items():
        if isinstance(val, str) and not Path(val).is_absolute():
            cfg["paths"][key] = PROJECT_ROOT / val
    return cfg


def get_path(cfg: dict, name: str) -> Path:
    return Path(cfg["paths"][name])
