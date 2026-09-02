from pathlib import Path

html = Path('index.html').read_text(encoding='utf-8')
css = Path('assets/css/main.css').read_text(encoding='utf-8')
checks = {
    'experience section': 'id="experience"' in html,
    'experience nav': 'href="#experience"' in html,
    'Gulf Consult role': 'GULF CONSULT Architects &amp; Engineers' in html and 'BIM Modeler' in html,
    'Fouad internship': 'FOUAD AHMAD ENGINEERING CONSULTANTS' in html and "CADD/ARCH'T" in html,
    'aramco apprenticeship': '>aramco<' in html and 'Design Engineer' in html,
    'Arabic copy': 'المسار المهني' in html and 'مصمم نماذج BIM' in html,
    'timeline styles': '.experience-timeline' in css,
    'language visibility': 'data-exp-lang' in html and '[data-exp-lang]' in css,
    'schema current employer': '"worksFor"' in html and 'GULF CONSULT Architects & Engineers' in html,
}
failed = [name for name, ok in checks.items() if not ok]
if failed:
    raise SystemExit('FAILED: ' + ', '.join(failed))
print(f'PASS: {len(checks)} Experience checks')
