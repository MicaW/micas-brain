import sys, json, re, openpyxl
src, outdir = sys.argv[1], sys.argv[2]
wb = openpyxl.load_workbook(src, read_only=True, data_only=True)
def rows(name):
    it = wb[name].iter_rows(values_only=True); head = [str(h).strip() if h else '' for h in next(it)]
    return head, [dict(zip(head, [(str(c).strip() if c is not None else '') for c in r])) for r in it if any(r)]
def slug(t): return re.sub(r'^-|-$', '', re.sub(r'[^a-z0-9]+', '-', t.lower()))
def tier(raw):
    letters = re.findall(r'\b([A-E])\b', raw.split(' - ')[0]) if raw else []
    return max(letters) if letters else None   # the more cautious letter of a mixed label
BAD = re.compile(r'\bIBM\b|watsonx|internal (file|document|material|source)|marked confidential', re.I)
flag = []
def clean(v, where):
    if BAD.search(v): flag.append((where, v[:90])); return ''
    return v
h, R = rows('Master taxonomy'); print('master cols:', h)
methods, by = [], {}
for r in R:
    name = r['Method / variant']
    if r['Level'] == '1':
        m = {'id': r['ID'], 'slug': slug(name), 'name': name, 'family': re.sub(r'^\d+\.\s*', '', r['Grandparent group']), 'format': r['Format / modality'],
             'description': clean(r['Granular description'], name), 'bestFor': clean(r['Best used for'], name), 'phase': r['Recommended journey phase'],
             'facilitation': r['Facilitation intensity'], 'tech': r['Technology dependency'], 'variants': []}
        for k, col in [('tierRaw', 'Evidence strength'), ('mechanics', 'Learning mechanisms'), ('cautions', 'Key cautions'), ('theory', 'Scientific or design theory'), ('presence', 'Physical presence advantage')]:
            if col in r and r[col]: m[k] = clean(r[col], name)
        m['tier'] = tier(m.get('tierRaw', ''))
        methods.append(m); by[name] = m
    else:
        p = by.get(r['Parent method'])
        if p:
            d = r['Granular description']
            p['variants'].append({'name': name, 'description': '' if d.lower().startswith('a more specific implementation') else clean(d, name)})
# A variant description that only repeats its parent, or is shared word for word by its siblings, says nothing: leave it blank.
from collections import Counter as C
for m in methods:
    seen = C(v['description'] for v in m['variants'])
    for v in m['variants']:
        if v['description'] and (seen[v['description']] > 1 or v['description'] == m['description']): v['description'] = ''
print('variants with their own description:', sum(1 for m in methods for v in m['variants'] if v['description']))
h, R = rows('Learning mechanics'); print('mech cols:', h)
mech = [{'slug': slug(r['Learning mechanic']), 'name': r['Learning mechanic'], 'description': clean(r['Detailed description'], 'mech'), 'what': clean(r[h[2]], 'mech'), 'basis': clean(r[h[3]], 'mech'),
         'methods': r['Best delivery methods'], 'example': clean(r['Worked example'], 'mech'), 'useful': r['When it is most useful'], 'failures': r['Common failure modes'], 'checks': r['Design checks'],
         'tierRaw': r['Evidence maturity'], 'tier': tier(r['Evidence maturity'])} for r in R]
h, R = rows('Retreat pattern library'); print('recipe cols:', h)
rec = [{'slug': slug(r['Recipe name']), 'name': r['Recipe name'], 'purpose': clean(r['Primary purpose'], 'rec'), 'audience': r['Ideal audience'], 'sequence': [s.strip() for s in r['Experience sequence'].split('→')],
        'duration': r['Typical duration'], 'methods': r['Methods combined'], 'mechanics': r['Learning mechanics activated'], 'setup': r['Physical setup'], 'needs': r['Facilitation / production needs'],
        'outputs': r['Outputs'], 'bestUse': r['Best use'], 'cautions': clean(r['Critical cautions'], 'rec')} for r in R]
_, ev = rows('Evidence guide'); _, sel = rows('Design selector'); _, mx = rows('Mechanics x recipes')
ref = {'evidenceGuide': [{'tier': e['Tier'].split(' - ')[0], 'word': e['Tier'].split(' - ')[1], 'meaning': e['Meaning'], 'use': e['How to use it']} for e in ev],
       'designSelector': sel, 'mechanicsByNeed': [{'need': m['Design need'], 'mechanics': m['Prioritise these learning mechanics'], 'recipes': m['Strong recipe starting points'], 'why': m['Why this combination works']} for m in mx]}
for name, data in [('methods', methods), ('mechanics', mech), ('recipes', rec), ('toolkit-reference', ref)]:
    json.dump(data, open(f'{outdir}/{name}.json', 'w'), ensure_ascii=False, indent=0)
print(len(methods), 'methods', sum(len(m['variants']) for m in methods), 'variants', len(mech), 'mechanics', len(rec), 'recipes; flagged:', flag)
from collections import Counter
print(Counter(m['family'] for m in methods)); print(Counter(m['tier'] for m in methods), Counter(m['tier'] for m in mech))
print(json.dumps(methods[0], ensure_ascii=False)[:900]); print(json.dumps(ref['evidenceGuide'], ensure_ascii=False)[:1200])
