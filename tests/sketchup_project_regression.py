from pathlib import Path

required = {
    'projects.html': [
        "id:'sketchup'", "url:'sketchup.html'", "title:'SKETCHUP'",
        "id:'health-gym'", "id:'interior-design'", "id:'villa-1'", "id:'villa-2'", "id:'villa-3'"
    ],
    'sketchup.html': [
        'SKETCHUP', 'Building 01', 'Building 02',
        'sketchup-building-01.html', 'sketchup-building-02.html',
        'assets/projects/sketchup/building-01/', 'assets/projects/sketchup/building-02/',
        'data-en="Building 01"', 'data-ar="المبنى 01"',
        'data-en="Building 02"', 'data-ar="المبنى 02"'
    ],
    'sketchup-building-01.html': [
        'Building 01', 'المبنى 01', 'id="langBtn"', 'data-gallery', 'lightbox',
        'assets/js/project-image-protection.js'
    ],
    'sketchup-building-02.html': [
        'Building 02', 'المبنى 02', 'id="langBtn"', 'data-gallery', 'lightbox',
        'assets/js/project-image-protection.js'
    ],
    'sitemap.xml': [
        'sketchup.html', 'sketchup-building-01.html', 'sketchup-building-02.html',
        'project.html?id=health-gym', 'project.html?id=interior-design',
        'project.html?id=villa-1', 'project.html?id=villa-2', 'project.html?id=villa-3'
    ],
}
forbidden = {
    'sketchup.html': [
        'project.html?id=health-gym', 'project.html?id=interior-design',
        'project.html?id=villa-1', 'project.html?id=villa-2', 'project.html?id=villa-3',
        'Gallery ready', 'Project images will appear here', 'Building names are temporary'
    ],
}

errors = []
for file, tokens in required.items():
    p = Path(file)
    if not p.exists():
        errors.append(f'missing file: {file}')
        continue
    body = p.read_text(encoding='utf-8')
    for token in tokens:
        if token not in body:
            errors.append(f'{file}: missing {token}')

for file, tokens in forbidden.items():
    body = Path(file).read_text(encoding='utf-8')
    for token in tokens:
        if token.lower() in body.lower():
            errors.append(f'{file}: forbidden token {token}')

# Protect the exact published image counts for each SketchUp building.
if Path('sketchup-building-01.html').exists():
    b1 = Path('sketchup-building-01.html').read_text(encoding='utf-8')
    count1 = b1.count('assets/projects/sketchup/building-01/WhatsApp Image')
    if count1 != 12:
        errors.append(f'sketchup-building-01.html: expected 12 gallery images, found {count1}')
if Path('sketchup-building-02.html').exists():
    b2 = Path('sketchup-building-02.html').read_text(encoding='utf-8')
    count2 = b2.count('assets/projects/sketchup/building-02/WhatsApp Image')
    if count2 != 4:
        errors.append(f'sketchup-building-02.html: expected 4 gallery images, found {count2}')

if errors:
    raise SystemExit('\n'.join(errors))
print('PASS: SKETCHUP publishes Building 01 (12 images) and Building 02 (4 images) as separate galleries')
