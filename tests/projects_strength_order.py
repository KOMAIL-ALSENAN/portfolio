from pathlib import Path

EXPECTED_ORDER = [
    "qiddiya",
    "neom",
    "nupco",
    "zain",
    "nesma",
    "red-sea",
    "sketchup",
    "health-gym",
    "interior-design",
    "villa-1",
    "villa-2",
    "villa-3",
]

text = Path("projects.html").read_text(encoding="utf-8")
if "id:'villa-4'" in text:
    raise SystemExit("Villa 4 must remain unpublished until a real evidence gallery exists")

positions = {}
for project_id in EXPECTED_ORDER:
    token = f"id:'{project_id}'"
    pos = text.find(token)
    if pos < 0:
        raise SystemExit(f"Missing project card: {project_id}")
    positions[project_id] = pos

actual = sorted(EXPECTED_ORDER, key=lambda project_id: positions[project_id])
if actual != EXPECTED_ORDER:
    raise SystemExit(
        "All Projects strength order mismatch.\n"
        f"Expected: {EXPECTED_ORDER}\n"
        f"Actual:   {actual}"
    )

print("PASS: All Projects cards follow the approved professional-strength order")
