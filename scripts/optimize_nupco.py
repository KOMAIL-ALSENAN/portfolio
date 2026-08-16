#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import shutil
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/projects/nupco/building-01"
OUTPUT = ROOT / "assets/projects/nupco/building-01-web"
MANIFEST = OUTPUT / "manifest.json"


def seq(a: int, b: int) -> list[str]:
    return [f"{n:05d}" for n in range(a, b + 1)]

GROUPS = [
    ("AR-0000", "General / Cover", "عام / أغلفة", ["00000","00003","00004","00005","00006","00007","00008","00701","00702","00703"]),
    ("AR-0100", "Fire Life Safety", "السلامة ومكافحة الحريق", ["00010","00011","00012","00013","01301","01302","01303","01304","01305"]),
    ("AR-0200", "Site Drawings", "مخططات الموقع", ["00015"]),
    ("AR-0300", "Architecture Drawings", "المخططات المعمارية", seq(16,32)+seq(34,40)+["00062","00066","00072","00667","03201"]+seq(3403,3415)+seq(3703,3715)),
    ("AR-0400", "Elevations", "الواجهات", seq(75,83)),
    ("AR-0500", "Sections", "القطاعات", seq(84,90)),
    ("AR-0600", "Reflected Ceiling", "الأسقف المنعكسة", ["00014"]+seq(93,97)+seq(9200,9215)+seq(9503,9515)),
    ("AR-0700", "Floor Pattern Layout", "مخططات تشطيبات الأرضيات", ["00102","00103"]+seq(1010,1026)+seq(1060,1075)),
    ("AR-0800", "Furniture Layouts", "مخططات الأثاث", seq(109,113)+seq(1080,1095)+seq(1111,1123)),
    ("AR-0900", "Internal Elevations", "الواجهات الداخلية", seq(114,120)),
    ("AR-1000", "Stairs, Ramps & Lifts", "السلالم والمنحدرات والمصاعد", seq(121,132)+["01211","01212"]),
    ("AR-1300", "Kitchens", "المطابخ", ["00133","00155"]),
    ("AR-1401", "Toilets", "دورات المياه", ["00063","00064","00134","00135","00136","00138","00139","00140","00141"]),
    ("AR-1500", "Wall Sections", "قطاعات الجدران", ["00143","00144","00145","01451","01452","01457"]),
    ("AR-1600", "Schedules", "الجداول", seq(146,153)+["00156","00157"]+seq(1453,1456)+["01458"]+seq(1561,1566)),
    ("AR-1700", "Signage", "اللوحات الإرشادية", seq(8001,8004)),
]
LOOKUP = {number: code for code, _, _, expected in GROUPS for number in expected}
GROUP_META = {code: {"code": code, "name_en": en, "name_ar": ar, "expected": expected} for code, en, ar, expected in GROUPS}
SHEET_RE = re.compile(r"DD-(\d{5})\b", re.I)


def title_from_name(name: str) -> str:
    stem = Path(name).stem
    stem = re.sub(r"_\d+$", "", stem).strip()
    if " - " in stem:
        stem = stem.split(" - ", 1)[1].strip()
    return stem.replace("_", " ").strip()


def slug(text: str) -> str:
    text = re.sub(r"[^A-Za-z0-9]+", "-", text).strip("-").lower()
    return text[:70] or "sheet"


def optimize(src: Path, dst: Path, max_dimension: int, quality: int) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGB")
        if im.mode == "RGBA":
            bg = Image.new("RGB", im.size, "white")
            bg.paste(im, mask=im.getchannel("A"))
            im = bg
        im.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)
        im.save(dst, "WEBP", quality=quality, method=6)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--max-dimension", type=int, default=1600)
    parser.add_argument("--quality", type=int, default=82)
    parser.add_argument("--replace-source", action="store_true")
    args = parser.parse_args()

    sources = sorted(p for p in SOURCE.iterdir() if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}) if SOURCE.exists() else []
    if not sources:
        print("No source images found; nothing to optimize.")
        return 0

    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir(parents=True, exist_ok=True)

    entries = []
    used = set()
    for src in sources:
        match = SHEET_RE.search(src.name)
        number = match.group(1) if match else None
        code = LOOKUP.get(number, "CHECK") if number else "CHECK"
        title = title_from_name(src.name)
        base = f"DD-{number}-{slug(title)}" if number else slug(title)
        candidate = base
        index = 2
        while (code, candidate) in used:
            candidate = f"{base}-{index}"
            index += 1
        used.add((code, candidate))
        rel = Path("assets/projects/nupco/building-01-web") / code / f"{candidate}.webp"
        dst = ROOT / rel
        optimize(src, dst, args.max_dimension, args.quality)
        entries.append({
            "number": number,
            "group": code,
            "title": title,
            "path": rel.as_posix(),
            "source_name": src.name,
        })

    groups = []
    missing_total = 0
    for code, en, ar, expected in GROUPS:
        present = {entry["number"] for entry in entries if entry["group"] == code and entry["number"]}
        missing = [number for number in expected if number not in present]
        missing_total += len(missing)
        groups.append({"code": code, "name_en": en, "name_ar": ar, "expected": expected, "missing": missing})
    uncategorized = sum(1 for entry in entries if entry["group"] == "CHECK")
    payload = {
        "version": 1,
        "generated_from": "assets/projects/nupco/building-01",
        "max_dimension": args.max_dimension,
        "quality": args.quality,
        "uploaded": len(entries),
        "matched": len(entries) - uncategorized,
        "uncategorized": uncategorized,
        "missing_expected": missing_total,
        "groups": groups,
        "images": entries,
    }
    MANIFEST.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    if args.replace_source:
        for src in sources:
            src.unlink()
        keep = SOURCE / ".gitkeep"
        keep.touch(exist_ok=True)

    before = sum(p.stat().st_size for p in sources if p.exists())
    after = sum(p.stat().st_size for p in OUTPUT.rglob("*.webp"))
    print(f"Optimized {len(entries)} images; web assets total {after / 1024 / 1024:.1f} MiB")
    print(f"Manifest: {MANIFEST.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
