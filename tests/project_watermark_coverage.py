from pathlib import Path

TAG = '<script src="assets/js/project-image-protection.js"></script>'
ROOT = Path('.')

KNOWN_PROJECT_PAGES = {
    'index.html',
    'projects.html',
    'project.html',
    'neom.html',
    'neom-professional-village.html',
    'nupco.html',
    'nupco-warehouse.html',
    'zain-industries.html',
    'sketchup.html',
    'sketchup-building-01.html',
    'sketchup-building-02.html',
}

missing_known = sorted(p for p in KNOWN_PROJECT_PAGES if not Path(p).exists())
if missing_known:
    raise SystemExit('Known project pages missing from repository: ' + ', '.join(missing_known))

coverage_pages = set()
missing_protection = []
duplicate_tags = []

for page in ROOT.rglob('*.html'):
    if any(part.startswith('.') for part in page.parts):
        continue
    text = page.read_text(encoding='utf-8')
    body = text.split('</head>', 1)[1] if '</head>' in text else text

    # Only require the watermark runtime when the rendered page body references
    # project assets. This excludes metadata-only social-card references.
    if 'assets/projects/' not in body:
        continue

    rel = page.as_posix()
    coverage_pages.add(rel)
    count = body.count(TAG)
    if count == 0:
        missing_protection.append(rel)
    elif count > 1:
        duplicate_tags.append(rel)

missing_known_coverage = sorted(KNOWN_PROJECT_PAGES - coverage_pages)
if missing_known_coverage:
    raise SystemExit(
        'Known project pages escaped automatic coverage detection: '
        + ', '.join(missing_known_coverage)
    )

if missing_protection:
    raise SystemExit(
        'Watermark protection script missing from project pages: '
        + ', '.join(sorted(missing_protection))
    )

if duplicate_tags:
    raise SystemExit(
        'Duplicate watermark protection script tags found in: '
        + ', '.join(sorted(duplicate_tags))
    )

script = Path('assets/js/project-image-protection.js').read_text(encoding='utf-8')
required_tokens = [
    'contextmenu',
    'dragstart',
    'copy',
    'keydown',
    'assets/projects/',
    'PROJECT_WATERMARK_LAYER_V1',
    'project-watermark-layer',
    'project-protection-layer',
    'MutationObserver',
]
missing_tokens = [token for token in required_tokens if token not in script]
if missing_tokens:
    raise SystemExit(
        'Global project protection runtime is missing behavior: '
        + ', '.join(missing_tokens)
    )

print(
    f'PASS: watermark protection covers {len(coverage_pages)} project HTML pages '
    'and the global protection runtime contains all required behaviors.'
)
