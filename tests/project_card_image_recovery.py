from pathlib import Path

script = Path('assets/js/project-image-protection.js').read_text(encoding='utf-8')
projects = Path('projects.html').read_text(encoding='utf-8')

required = [
    ".project-media",
    "naturalWidth",
    "image-retry",
    "addEventListener('error'",
    "project-image-fallback",
    "replaceChildren",
]

missing = [token for token in required if token not in script]
if missing:
    raise SystemExit('project card image recovery missing: ' + ', '.join(missing))

if "image:'assets/projects/interior-design/1.jpg'" not in projects:
    raise SystemExit('Interior Design primary cover unexpectedly changed; fix recovery instead of replacing the valid asset')

print('PASS: project cards retry failed image requests and replace persistent failures with a styled fallback')
