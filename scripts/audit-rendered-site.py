"""Validate every generated page without network or third-party packages."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
import json
import os
import re
import sys

VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}
OLD_UI = re.compile(r'^(Back|Back to Top|Tags|Tags:|Archives|Appearances|All|Building|Maintained|Archived|Selected Work(?: · 精选作品)?|Visit website|Contribution PR|Source|Story|Copy exploration receipt|Filter posts by language|More writing destinations|Blog post list|No posts yet\.|Any tag yet\.)$', re.I)
class Document(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.nodes = []
        self.ids = []
        self.labels = []
        self.lang = ''
        self.feed(html)
    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == 'html': self.lang = values.get('lang', '')
        self.nodes.append((tag, values))
        if values.get('id'): self.ids.append(values['id'])
        lang = values.get('lang') or next((a.get('lang') for _, a in reversed(self.stack) if a.get('lang')), self.lang)
        for name in ['aria-label', 'placeholder']:
            if values.get(name): self.labels.append((values[name], lang))
        if tag not in VOID: self.stack.append((tag, values))
    def handle_endtag(self, tag):
        for index in range(len(self.stack)-1, -1, -1):
            if self.stack[index][0] == tag:
                self.stack = self.stack[:index]
                break
    def handle_data(self, value):
        if not value.strip() or any(tag in {'script', 'style', 'code', 'pre'} for tag, _ in self.stack): return
        lang = next((a.get('lang') for _, a in reversed(self.stack) if a.get('lang')), self.lang)
        if any(tag in {'button', 'nav', 'summary', 'label', 'h1', 'h2'} for tag, _ in self.stack): self.labels.append((value.strip(), lang))

root = Path(sys.argv[1] if len(sys.argv)>1 else 'dist').resolve()
out = Path(os.getenv('SITE_TEST_OUTPUT', '/tmp/lorasys-static-audit'))
out.mkdir(parents=True, exist_ok=True)
docs = {p: Document(p.read_text()) for p in root.rglob('*.html')}
canonical = next(a['href'] for t,a in docs[root/'index.html'].nodes if t=='link' and a.get('rel')=='canonical')
base = urlsplit(canonical).path.rstrip('/')
origin = f'{urlsplit(canonical).scheme}://{urlsplit(canonical).netloc}'
errors = []
link_count = 0

def issue(file, kind, value):
    item = {'page':str(file.relative_to(root)), 'kind':kind, 'value':value}
    if item not in errors: errors.append(item)

for file, doc in docs.items():
    route = str(file.relative_to(root))
    route = route[:-10] if route.endswith('index.html') else route
    url = f'{origin}{base}/{route}'
    if not doc.lang: issue(file, 'missing document language', '')
    if len(doc.ids) != len(set(doc.ids)): issue(file, 'duplicate IDs', sorted({x for x in doc.ids if doc.ids.count(x)>1}))
    for label, lang in doc.labels:
        if lang.startswith('zh') and OLD_UI.fullmatch(label): issue(file, 'untranslated UI', label)
    for tag, attrs in doc.nodes:
        for target in (attrs.get('aria-controls') or '').split():
            if target not in doc.ids: issue(file, 'missing controlled element', target)
        if tag == 'label' and attrs.get('for') and attrs['for'] not in doc.ids: issue(file, 'missing label target', attrs['for'])
        raw = attrs.get('src') if tag in {'img','script','iframe','source'} else attrs.get('href') if tag in {'a','link'} else None
        if not raw: continue
        resolved = urlsplit(urljoin(url, raw))
        if resolved.scheme not in {'http','https'} or resolved.netloc != urlsplit(origin).netloc: continue
        pathname = unquote(resolved.path)
        if not (pathname == base or pathname.startswith(base+'/')):
            absolute = urlsplit(raw)
            if tag=='a' and absolute.scheme in {'http','https'} and attrs.get('target')=='_blank' and 'noopener' in attrs.get('rel','').split():
                continue
            issue(file, 'missing deployment prefix', raw)
            continue
        target = (root / pathname[len(base):].lstrip('/')).resolve()
        if not target.is_relative_to(root): issue(file, 'invalid local path', raw); continue
        if target.is_dir(): target = target/'index.html'
        # The host serves 404.html for nonexistent URLs; metadata on that page is not a navigation link.
        if file.name=='404.html' and tag=='link' and attrs.get('rel')=='canonical': continue
        link_count += 1
        if not target.exists(): issue(file, 'missing destination', raw)
        elif resolved.fragment and target in docs and unquote(resolved.fragment) not in docs[target].ids:
            issue(file, 'missing fragment', raw)
        if tag=='link' and attrs.get('hreflang') and target in docs:
            expected = attrs['hreflang'].split('-')[0]
            if expected!='x' and not docs[target].lang.startswith(expected): issue(file, 'alternate language mismatch', raw)
report = {'pages':len(docs), 'internalReferences':link_count, 'errors':errors}
(out/'static-site.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
print(json.dumps(report, ensure_ascii=False, indent=2))
if errors: sys.exit(1)
