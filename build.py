#!/usr/bin/env python3
"""Inline src/*.js into src/template.html.

Writes two copies of the game:
  dist/innovation-rush.html  page body only, for publishing as a Claude artifact (which adds its own <head>)
  docs/index.html            full standalone page, served by GitHub Pages
"""
from pathlib import Path

root = Path(__file__).parent
body = (root / 'src/template.html').read_text()
for marker, name in [('/*ENGINE*/', 'engine.js'), ('/*ART*/', 'art.js'), ('/*UI*/', 'ui.js')]:
    body = body.replace(marker, (root / 'src' / name).read_text())

standalone = (
    '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    '</head>\n<body>\n' + body + '\n</body>\n</html>\n'
)

for rel, html in [('dist/innovation-rush.html', body), ('docs/index.html', standalone)]:
    out = root / rel
    out.parent.mkdir(exist_ok=True)
    out.write_text(html)
    print(f'wrote {rel} ({len(html) // 1024} KB)')
