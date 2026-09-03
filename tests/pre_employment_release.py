from pathlib import Path

ROOT = Path('.')

def text(path):
    return (ROOT / path).read_text(encoding='utf-8')

def require(condition, message):
    if not condition:
        raise AssertionError(message)

# 1. SKETCHUP must show the five real project galleries, not temporary Building 01/02 placeholders.
sketchup = text('sketchup.html')
for token in ['Health Gym', 'Interior Design', 'Villa 1', 'Villa 2', 'Villa 3']:
    require(token in sketchup, f'SKETCHUP missing real project: {token}')
for token in ['sketchup-building-01.html', 'sketchup-building-02.html', 'Building names are temporary']:
    require(token not in sketchup, f'SKETCHUP still exposes temporary content: {token}')

# 2. Villa 4 must not be published in All Projects while it has no evidence gallery.
projects = text('projects.html')
require("id:'villa-4'" not in projects, 'Villa 4 is still visible in All Projects')

# 4. Public project pages must not contain development/future-content notes.
for path, forbidden in {
    'zain-industries.html': ['future project content', 'third building folder remains'],
    'neom.html': ['can be expanded with additional buildings as needed'],
}.items():
    body = text(path).lower()
    for token in forbidden:
        require(token.lower() not in body, f'{path} still contains development copy: {token}')

# 5. Homepage project order must follow the approved professional-strength order.
index = text('index.html')
order_tokens = ['Qiddiya Project', '>NEOM<', '>NUPCO<', '>ZAIN INDUSTRIES<', 'Nesma Car Parking Building', 'Red Sea Turtle Bay Village']
positions = []
for token in order_tokens:
    pos = index.find(token)
    require(pos >= 0, f'Homepage missing project token: {token}')
    positions.append(pos)
require(positions == sorted(positions), f'Homepage project order is wrong: {positions}')

# 8. Public professional title must be unified with the CV title.
public_role_files = [
    'index.html', 'projects.html', 'project.html', 'certificates.html',
    'neom.html', 'neom-professional-village.html', 'nupco.html',
    'nupco-warehouse.html', 'zain-industries.html', 'sketchup.html',
    'developer-portfolio.html', 'pdf-toolbox-v9.html', 'assets/js/main.js',
    'assets/js/experience.js', 'assets/js/dynamic-project-case-study.js'
]
for path in public_role_files:
    body = text(path)
    require('Architecture BIM Modeler' not in body, f'{path} still uses Architecture BIM Modeler')
require('Architectural BIM Modeler' in index, 'Homepage missing unified Architectural BIM Modeler title')

# 9. Hero must surface the name/title and provide both project and CV actions.
require('data-i18n="heroName"' in index, 'Hero does not surface the candidate name')
require('assets/documents/Komail Jaffar Al Senan-Architectural BIM Modeler.pdf' in index, 'Hero CV action missing')

# 10. Sitemap must remove stale placeholders/generic project URL and include the published real galleries.
sitemap = text('sitemap.xml')
for token in ['sketchup-building-01.html', 'sketchup-building-02.html', '<loc>https://komail-alsenan.github.io/portfolio/project.html</loc>']:
    require(token not in sitemap, f'Sitemap still contains stale URL: {token}')
for project_id in ['health-gym', 'interior-design', 'villa-1', 'villa-2', 'villa-3']:
    require(f'project.html?id={project_id}' in sitemap, f'Sitemap missing project: {project_id}')

# Arabic/English release gate for formerly English-only key project pages.
for path in ['neom.html', 'neom-professional-village.html', 'zain-industries.html']:
    body = text(path)
    require(('data-pg-lang' in body or 'id="langBtn"' in body), f'{path} missing language switch control')
    require('data-ar=' in body, f'{path} missing Arabic localized UI strings')
    require('data-en=' in body, f'{path} missing English localized UI strings')

print('PASS: pre-employment portfolio release gates')
