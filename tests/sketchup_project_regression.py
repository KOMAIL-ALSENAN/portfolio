from pathlib import Path

required = {
    'projects.html': ["id:'sketchup'", "url:'sketchup.html'", "title:'SKETCHUP'"],
    'sketchup.html': [
        'SKETCHUP', 'Health Gym', 'Interior Design', 'Villa 1', 'Villa 2', 'Villa 3',
        'project.html?id=health-gym', 'project.html?id=interior-design',
        'project.html?id=villa-1', 'project.html?id=villa-2', 'project.html?id=villa-3'
    ],
    'sitemap.xml': [
        'sketchup.html', 'project.html?id=health-gym', 'project.html?id=interior-design',
        'project.html?id=villa-1', 'project.html?id=villa-2', 'project.html?id=villa-3'
    ],
}
forbidden = {
    'sketchup.html': ['Building 01', 'Building 02', 'temporary', 'sketchup-building-01.html', 'sketchup-building-02.html'],
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
            errors.append(f'{file}: stale temporary token {token}')

if errors:
    raise SystemExit('\n'.join(errors))
print('PASS: SKETCHUP showcases the five real published project galleries')
