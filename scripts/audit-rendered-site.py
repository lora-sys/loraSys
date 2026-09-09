"""Audit every built page, internal target and interface label without external requests."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json, os, re

ROOT = Path('dist').resolve()
BASE = '/loraSys'
OLD_UI = re.compile(r'^(?:Selected Work|Selected work|Case guide|views|comments|Visit website|Source|Copy code|Copy failed|Collapse|Expand|All tags|Previous Page|Next Page|Powered by|Skip to content|Back|All|Search project, stack, repository|Repository archive|All projects|Build channel map|Project page|BUILDING|ACTIVE|ARCHIVED)$')
class Page(HTMLParser):
    def __init__(self, file):
        super().__init__(convert_charrefs=True)
        self.file, self.ids, self.links, self.labels, self.controls, self.alt_text = file, [], [], [], [], []
        self.stack, self.lang, self.canonical = [], '', ''
    def handle_starttag(self, tag, pairs):
        attrs = dict(pairs)
        if tag == 'html': self.lang = attrs.get('lang', '')
        if 'id' in attrs: self.ids.append(attrs['id'])
        if tag == 'link' and attrs.get('rel') == 'canonical': self.canonical = attrs.get('href', '')
        for key in ['href', 'src']:
            if key in attrs and tag not in ['script', 'iframe']: self.links.append((tag, key, attrs[key], attrs))
        for key in ['aria-controls', 'aria-labelledby']:
            if key in attrs: self.controls.append((key, attrs[key]))
        lang = attrs.get('lang', self.stack[-1][1] if self.stack else self.lang)
        if tag == 'img' and attrs.get('alt') and attrs.get('aria-hidden') != 'true':
            self.alt_text.append({'alt':attrs['alt'], 'lang':lang})
        if tag not in ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']:
            self.stack.append((tag, lang))
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, -1, -1):
            if self.stack[i][0] == tag:
                self.stack = self.stack[:i]
                break
    def handle_data(self, value):
        if self.stack and not any(tag in ['script','style','pre','code'] for tag,_ in self.stack):
            text = value.strip()
            if text and self.stack[-1][1].startswith('zh') and OLD_UI.fullmatch(text): self.labels.append(text)

pages = {}
for file in ROOT.rglob('*.html'):
    p = Page(file); p.feed(file.read_text()); pages[file] = p

def local_file(raw_path):
    raw_path = unquote(raw_path).rstrip('/')
    if raw_path == BASE: return ROOT / 'index.html'
    if not raw_path.startswith(BASE + '/'): return None
    p = ROOT / raw_path[len(BASE)+1:]
    if p.is_dir(): p = p / 'index.html'
    if not p.exists() and p.suffix == '': p = p.with_suffix('.html')
    return p

errors = []
checked = 0
alternates = 0

def issue(file, kind, detail): errors.append({'page':str(file.relative_to(ROOT)), 'kind':kind, 'detail':detail})
for file, page in pages.items():
    if not page.lang: issue(file, 'missing language', '')
    if len(page.ids) != len(set(page.ids)): issue(file, 'duplicate IDs', sorted({x for x in page.ids if page.ids.count(x)>1}))
    for label in page.labels: issue(file, 'untranslated Chinese interface', label)
    for image in page.alt_text:
        if image['lang'].startswith('en') and re.search('[\u3400-\u9fff]', image['alt']):
            issue(file, 'untranslated English image description', image['alt'])
    for key, ids in page.controls:
        for ident in ids.split():
            if ident not in page.ids: issue(file, 'missing accessible target', f'{key}={ident}')
    for tag, key, raw, attrs in page.links:
        if raw.startswith(('mailto:', 'tel:', 'data:', 'javascript:')): continue
        parsed = urlsplit(raw)
        if parsed.netloc and parsed.netloc != 'lora-sys.github.io': continue
        if raw.startswith('#'):
            target, fragment = file, unquote(parsed.fragment)
        elif parsed.path.startswith('/'):
            target, fragment = local_file(parsed.path), unquote(parsed.fragment)
        else:
            continue
        if target is None:
            if file.name == '404.html' and tag == 'link' and attrs.get('rel') == 'canonical': continue
            # Separate project sites share the same Pages origin, but are explicitly external links.
            if tag == 'a' and parsed.scheme in {'http','https'} and attrs.get('target') == '_blank' and 'noopener' in attrs.get('rel','').split(): continue
            issue(file, 'missing deployment prefix', raw)
            continue
        checked += 1
        if not target.exists():
            if file.name == '404.html' and tag == 'link' and attrs.get('rel') == 'canonical': continue
            issue(file, 'missing local target', raw)
            continue
        if fragment and target in pages and fragment not in pages[target].ids:
            issue(file, 'missing fragment', raw)
        if attrs.get('hreflang'):
            alternates += 1
            language = attrs['hreflang']
            if language != 'x-default' and target in pages and not pages[target].lang.startswith(language[:2]):
                issue(file, 'alternate language mismatch', raw)
report = {'pages':len(pages), 'internalReferences':checked, 'alternateReferences':alternates, 'errors':errors}
out = Path(os.environ.get('SITE_TEST_OUTPUT', '/tmp/lorasys-static-audit')); out.mkdir(parents=True, exist_ok=True)
(out / 'static-site.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
print(json.dumps(report, ensure_ascii=False, indent=2))
raise SystemExit(1 if errors else 0)
