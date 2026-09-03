from pathlib import Path

required = {
    'projects.html': [
        "id:'sketchup'", "url:'sketchup.html'", "title:'SKETCHUP'",
        "id:'health-gym'", "id:'interior-design'", "id:'villa-1'", "id:'villa-2'", "id:'villa-3'"
    ],
    'sketchup.html': [
        'SKETCHUP', 'Building 01', 'Building 02',
        'data-en="Building 01"', 'data-ar="المبنى 01"',
        'data-en="Building 02"', 'data-ar="المبنى 02"'
    ],
    'sitemap.xml': [
        'sketchup.html', 'project.html?id=health-gym', 'project.html?id=interior-design',
        'project.html?id=villa-1', 'project.html?id=villa-2', 'project.html?id=villa-3'
    ],
}
forbidden = {
    'sketchup.html': [
        'project.html?id=health-gym', 'project.html?id=interior-design',
        'project.html?id=villa-1', 'project.html?id=villa-2', 'project.html?id=villa-3',
        'Gallery ready', 'Project images will appear here', 'Building names are temporary'
    ],
    'sitemap.xml': ['sketchup-building-01.html', 'sketchup-building-02.html'],
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

if errors:
    raise SystemExit('\n'.join(errors))
print('PASS: SKETCHUP is a two-building project and the other five projects remain independent')
