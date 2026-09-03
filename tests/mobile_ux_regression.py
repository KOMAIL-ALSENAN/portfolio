from pathlib import Path

s = Path('assets/css/main.css').read_text(encoding='utf-8')
required = [
    'MOBILE_UX_OPTIMIZATION_V1',
    '@media(max-width:620px)',
    'env(safe-area-inset-top)',
    'font-size:clamp(2.35rem,12vw,3.25rem)',
    'section{padding-block:56px!important}',
    '.actions>.btn',
    'overflow-x:hidden',
    '100dvh',
    '@media(max-width:380px)',
]
missing = [token for token in required if token not in s]
if missing:
    raise SystemExit('Missing mobile UX tokens: ' + ', '.join(missing))
print('PASS: mobile UX optimization layer verified')
