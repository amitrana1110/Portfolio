"""Regenerate optimized Satoshi assets: pip install fonttools brotli."""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parents[1]
# Keep Latin, punctuation, arrows, and every authored character.
characters = set(range(0x100)) | set(range(0x2000, 0x2070)) | set(range(0x2190, 0x2200))
for directory in ("app", "components", "data", "lib"):
    for source in (root / directory).rglob("*"):
        if source.suffix in (".js", ".jsx"):
            characters.update(map(ord, source.read_text(encoding="utf-8-sig")))
for weight in ("regular", "medium", "bold"):
    source = root / "public" / "fonts" / f"satoshi-{weight}.woff2"
    target = source.with_name(f"satoshi-{weight}-subset.woff2")
    font = TTFont(source)
    original = font.getBestCmap()
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    sub = subset.Subsetter(options=options)
    sub.populate(unicodes=characters)
    sub.subset(font)
    font.save(target)
    remaining = TTFont(target).getBestCmap()
    assert all(code in remaining for code in characters if code in original)
    print(f"{weight}: {source.stat().st_size} -> {target.stat().st_size} bytes")

