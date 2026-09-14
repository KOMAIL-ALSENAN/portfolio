from pathlib import Path

script = Path('assets/js/project-image-protection.js').read_text(encoding='utf-8')

required = [
    'PROJECT_WATERMARK_LAYER_V1',
    'project-watermark-layer',
    'project-protection-layer',
    'KOMAIL ALSENAN',
    'PORTFOLIO',
    'z-index:2',
    'z-index:3',
    'host.append(watermark,shield)',
    'MutationObserver',
]

missing = [token for token in required if token not in script]
if missing:
    raise SystemExit('Missing watermark-layer behavior: ' + ', '.join(missing))

print('PASS: project watermark layer stack is present')
