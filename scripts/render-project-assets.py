from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import argparse,json,hashlib
parser=argparse.ArgumentParser(description='Compose localized Zhihu Threads artwork from existing Lora character assets.')
parser.add_argument('--font-dir', type=Path, default=Path('/usr/share/fonts/opentype/noto'))
parser.add_argument('--evidence-dir', type=Path)
args=parser.parse_args()
R=Path(__file__).resolve().parents[1]
D=R/'src/assets/projects'
E=args.evidence_dir
if E:
 if E.resolve().is_relative_to(R): raise SystemExit('Keep intermediate evidence outside the repository')
 E.mkdir(parents=True,exist_ok=True)
F=args.font_dir
for name in ['NotoSansCJK-Bold.ttc','NotoSansCJK-Regular.ttc']:
 if not (F/name).is_file(): raise SystemExit(f'Missing font: {F/name}. Install Noto CJK; do not commit fonts.')
INK='#312921';MUTED='#786853';AMBER='#B4762D';LINE='#D7C4A8';PAPER='#F4EBDD';CARD='#FBF7EF'
def font(n,bold=False):return ImageFont.truetype(str(F/('NotoSansCJK-Bold.ttc' if bold else 'NotoSansCJK-Regular.ttc')),n,index=2)
def txt(draw,pos,s,n=30,fill=INK,bold=False):draw.text(pos,s,font=font(n,bold),fill=fill,stroke_width=0)
def base():
 im=Image.new('RGB',(1600,900),PAPER);dr=ImageDraw.Draw(im)
 for x in range(0,1600,48):dr.line((x,0,x,900),fill='#EADFCF',width=1)
 for y in range(0,900,48):dr.line((0,y,1600,y),fill='#EADFCF',width=1)
 dr.rectangle((32,32,1568,868),outline=LINE,width=1)
 return im
def paste_art(im,path,bounds):
 art=Image.open(path).convert('RGBA');art=art.crop(art.getbbox());art.thumbnail((bounds[2],bounds[3]),Image.Resampling.LANCZOS)
 layer=Image.new('RGBA',im.size);layer.alpha_composite(art,(bounds[0],bounds[1]));im.alpha_composite(layer)
def card(dr,box,title,sub,en=False,focus=False):
 dr.rounded_rectangle(box,12,fill=CARD,outline=AMBER if focus else LINE,width=3 if focus else 2)
 x,y,_,_=box;txt(dr,(x+22,y+18),title,30,bold=True);txt(dr,(x+22,y+67),sub,22,fill=MUTED)
def save(im,name):
 im=im.convert('RGB');p=D/name;im.save(p,'WEBP',quality=86,method=6)
 if E:
  preview=im.copy();preview.thumbnail((1000,563));preview.save(E/(name+'.png'))
 return {'file':name,'bytes':p.stat().st_size,'width':1600,'height':900,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
records=[]
for lang in ['zh','en']:
 en=lang=='en';im=base().convert('RGBA');dr=ImageDraw.Draw(im)
 txt(dr,(80,65),'LORA FIELD NOTES' if en else 'LORA 构建记录',21,AMBER,True)
 txt(dr,(74,122),'Zhihu',99,bold=True);txt(dr,(74,231),'Threads',99,bold=True)
 dr.line((80,370,566,370),fill=AMBER,width=5)
 txt(dr,(80,404),'Learn from selected evidence' if en else '把问题变成学习线',31 if en else 43,bold=True)
 txt(dr,(80,474),'Zhihu excerpts. Your source choices.' if en else '知乎摘录 · 手动选源 · 追问自测',25,MUTED)
 for i,(t,s) in enumerate([('Choose sources','Your decision'),('Build a thread','AI organizes excerpts'),('Ask and test','Keep the evidence')] if en else [('选择来源','由你决定引用哪些摘录'),('组织学习线','AI 整理证据与节点'),('追问与自测','继续保留来源')]):
  y=553+i*81;dr.ellipse((82,y+16,108,y+42),fill=AMBER if i==0 else '#E2CEAF',outline=AMBER,width=2)
  if i<2:dr.line((95,y+44,95,y+97),fill=LINE,width=3)
  txt(dr,(129,y),t,26,bold=True);txt(dr,(129,y+36),s,21,MUTED)
 # Papers sit behind the existing illustrated desk and characters.
 card(dr,(930,78,1490,227),'SOURCE NOTES' if en else '来源摘录','Answer / article · not full text' if en else '回答或专栏 · 不是完整正文',en)
 card(dr,(1070,244,1530,388),'EVIDENCE GAP' if en else '证据不足','Say what is unknown' if en else '明确保留未知项',en,True)
 paste_art(im,R/'src/assets/lora-visual/v2/lora-v2-hero-lora.webp',(673,259,844,730))
 paste_art(im,R/'src/assets/lora-visual/v2/lora-v2-hero-mochi.webp',(1280,610,250,292))
 dr=ImageDraw.Draw(im);txt(dr,(81,824),'PROJECT ILLUSTRATION' if en else '项目插画 · 非产品截图',18,MUTED)
 records.append(save(im,f'lora-v3-project-zhihu-threads-{lang}.webp'))
 # A single independent mechanism: selection controls the evidence boundary.
 im=base().convert('RGBA');dr=ImageDraw.Draw(im)
 txt(dr,(80,60),'ZHIHU THREADS',23,AMBER,True)
 txt(dr,(80,113),'You choose the evidence.' if en else '先选来源，再组织学习线',55,bold=True)
 txt(dr,(82,200),'AI explains the candidates. It does not choose them for you.' if en else 'AI 解释候选来源，不替用户勾选。',28,MUTED)
 steps=[('01','Question','Clarify the intent'),('02','Excerpts','Search Zhihu'),('03','Your selection','Choose sources'),('04','Learning thread','Follow up and self-test')] if en else [('01','提出问题','澄清学习意图'),('02','检索摘录','知乎回答与专栏'),('03','手动选源','用户选择引用范围'),('04','生成学习线','追问与自测')]
 for i,(num,title,sub) in enumerate(steps):
  x=80+i*379;box=(x,314,x+302,526)
  dr.rounded_rectangle(box,14,fill=CARD,outline=AMBER if i==2 else LINE,width=4 if i==2 else 2)
  txt(dr,(x+23,332),num,24,AMBER,True);txt(dr,(x+23,385),title,31 if en else 38,bold=True);txt(dr,(x+23,461),sub,21,MUTED)
  if i<3:
   dr.line((x+318,417,x+355,417),fill=AMBER,width=3);dr.line((x+346,409,x+355,417,x+346,425),fill=AMBER,width=3)
 dr.line((1048,529,1048,607,470,607),fill=AMBER,width=3)
 dr.rounded_rectangle((365,657,1460,815),14,fill=CARD,outline=LINE,width=2)
 txt(dr,(398,675),'Only selected excerpts can support the thread.' if en else '学习线只使用已选择的摘要摘录。',32,bold=True)
 txt(dr,(398,733),'Missing evidence stays unknown. No invented article bodies.' if en else '证据不足就标记未知，不补造完整正文。',25,MUTED)
 paste_art(im,R/'src/assets/lora-visual/v2/lora-v2-hero-mochi.webp',(90,600,225,218))
 txt(ImageDraw.Draw(im),(81,835),'WORKFLOW ILLUSTRATION' if en else '流程示意',18,MUTED)
 records.append(save(im,f'lora-v3-zhihu-workflow-{lang}.webp'))
if E: (E/'manifest.json').write_text(json.dumps(records,indent=2,ensure_ascii=False))
print(json.dumps(records,indent=2,ensure_ascii=False))
