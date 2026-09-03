from pathlib import Path

# Post-apply verification for the published SKETCHUP image wiring.
cover = 'assets/projects/sketchup/building-01/WhatsApp Image 2026-09-03 at 1.21.01 PM.jpeg'
b1 = [
'WhatsApp Image 2026-09-03 at 1.21.01 PM.jpeg',
'WhatsApp Image 2026-09-03 at 1.21.04 PM (1).jpeg',
'WhatsApp Image 2026-09-03 at 1.21.04 PM (2).jpeg',
'WhatsApp Image 2026-09-03 at 1.21.04 PM.jpeg',
'WhatsApp Image 2026-09-03 at 1.21.05 PM (1).jpeg',
'WhatsApp Image 2026-09-03 at 1.21.05 PM.jpeg',
'WhatsApp Image 2026-09-03 at 1.21.06 PM (1).jpeg',
'WhatsApp Image 2026-09-03 at 1.21.06 PM (2).jpeg',
'WhatsApp Image 2026-09-03 at 1.21.06 PM.jpeg',
'WhatsApp Image 2026-09-03 at 1.21.07 PM.jpeg',
'WhatsApp Image 2026-09-03 at 1.21.08 PM (1).jpeg',
'WhatsApp Image 2026-09-03 at 1.21.08 PM.jpeg',
]
b2 = [
'WhatsApp Image 2026-09-03 at 1.21.08 PM (2).jpeg',
'WhatsApp Image 2026-09-03 at 1.21.09 PM (1).jpeg',
'WhatsApp Image 2026-09-03 at 1.21.09 PM.jpeg',
'WhatsApp Image 2026-09-03 at 1.21.10 PM.jpeg',
]

checks = []
projects = Path('projects.html').read_text(encoding='utf-8')
checks.append(('SKETCHUP cover in projects.html', cover in projects))

sketchup = Path('sketchup.html').read_text(encoding='utf-8')
checks.append(('Building 01 thumbnail', b1[0] in sketchup))
checks.append(('Building 02 thumbnail', b2[0] in sketchup))

p1 = Path('sketchup-building-01.html').read_text(encoding='utf-8')
p2 = Path('sketchup-building-02.html').read_text(encoding='utf-8')
for name in b1:
    checks.append((f'Building 01 image: {name}', name in p1))
for name in b2:
    checks.append((f'Building 02 image: {name}', name in p2))
checks.append(('Building 01 gallery markup', 'data-sketchup-gallery="building-01"' in p1))
checks.append(('Building 02 gallery markup', 'data-sketchup-gallery="building-02"' in p2))

missing = [name for name, ok in checks if not ok]
if missing:
    raise SystemExit('Missing SKETCHUP image gallery wiring:\n- ' + '\n- '.join(missing))
print(f'PASS: SKETCHUP cover, thumbnails and {len(b1)+len(b2)} gallery images are wired')
