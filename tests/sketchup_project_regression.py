from pathlib import Path

checks = {
    'projects.html': ["id:'sketchup'", "url:'sketchup.html'", "title:'SKETCHUP'"],
    'sketchup.html': ['SKETCHUP', 'Building 01', 'Building 02', 'sketchup-building-01.html', 'sketchup-building-02.html'],
    'sketchup-building-01.html': ['Building 01', 'assets/projects/sketchup/building-01/'],
    'sketchup-building-02.html': ['Building 02', 'assets/projects/sketchup/building-02/'],
    'sitemap.xml': ['sketchup.html', 'sketchup-building-01.html', 'sketchup-building-02.html'],
    'assets/projects/sketchup/building-01/.gitkeep': [],
    'assets/projects/sketchup/building-02/.gitkeep': [],
}

missing = []
for file, tokens in checks.items():
    p = Path(file)
    if not p.exists():
        missing.append(f'missing file: {file}')
        continue
    text = p.read_text(encoding='utf-8')
    for token in tokens:
        if token not in text:
            missing.append(f'{file}: missing {token}')

if missing:
    raise SystemExit('\n'.join(missing))
print('PASS: SKETCHUP project with two buildings is fully wired')
