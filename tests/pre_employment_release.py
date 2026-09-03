from pathlib import Path

ROOT = Path('.')

def text(path):
    return (ROOT / path).read_text(encoding='utf-8')

def require(condition, message):
    if not condition:
        raise AssertionError(message)

# 1. SKETCHUP is one project made of two buildings only. The other five are independent projects.
sketchup = text('sketchup.html')
for token in ['Building 01', 'Building 02']:
    require(token in sketchup, f'SKETCHUP missing building: {token}')
for token in ['project.html?id=health-gym', 'project.html?id=interior-design', 'project.html?id=villa-1', 'project.html?id=villa-2', 'project.html?id=villa-3']:
    require(token not in sketchup, f'SKETCHUP incorrectly contains independent project: {token}')
projects = text('projects.html')
for project_id in ['sketchup', 'health-gym', 'interior-design', 'villa-1', 'villa-2', 'villa-3']:
    require(f"id:'{project_id}'" in projects, f'All Projects missing independent project: {project_id}')

# 2. Villa 4 must not be published in All Projects while it has no evidence gallery.
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

# 8. Use one visible professional title across the public portfolio.
for path in ['index.html', 'projects.html', 'project.html', 'certificates.html', 'neom.html', 'neom-professional-village.html', 'nupco.html', 'nupco-warehouse.html', 'zain-industries.html', 'sketchup.html', 'developer-portfolio.html', 'pdf-toolbox-v9.html']:
    body = text(path)
    require('Architectural BIM Modeler' not in body.replace('Komail Jaffar Al Senan-Architectural BIM Modeler.pdf', ''), f'{path} exposes a conflicting professional title')
require('Architecture BIM Modeler' in index, 'Homepage missing canonical Architecture BIM Modeler title')

# 9. Hero must surface the name/title and provide both project and CV actions.
require('data-i18n="heroName"' in index, 'Hero does not surface the candidate name')
require('assets/documents/Komail Jaffar Al Senan-Architectural BIM Modeler.pdf' in index, 'Hero CV action missing')

# 10. Sitemap must avoid empty SketchUp building pages and include the five independent published galleries.
sitemap = text('sitemap.xml')
for token in ['sketchup-building-01.html', 'sketchup-building-02.html', '<loc>https://komail-alsenan.github.io/portfolio/project.html</loc>']:
    require(token not in sitemap, f'Sitemap still contains stale URL: {token}')
for project_id in ['health-gym', 'interior-design', 'villa-1', 'villa-2', 'villa-3']:
    require(f'project.html?id={project_id}' in sitemap, f'Sitemap missing project: {project_id}')

# Arabic/English release gate for key public project pages.
for path in ['neom.html', 'neom-professional-village.html', 'zain-industries.html', 'sketchup.html']:
    body = text(path)
    require(('data-pg-lang' in body or 'id="langBtn"' in body), f'{path} missing language switch control')
    require('data-ar=' in body, f'{path} missing Arabic localized UI strings')
    require('data-en=' in body, f'{path} missing English localized UI strings')

print('PASS: pre-employment portfolio release gates')
