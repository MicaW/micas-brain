// Builds facts.json for the BRAIN homepage's "Brain nugget of the day" card.
// Reads the Training the Trainer content and turns findings, myths, mistakes,
// learning mechanics, case studies and Insights pieces into short daily facts.
// Run after `npm run content` (it needs src/content/generated/playbook-index.json).
// Usage: node scripts/build-facts.mjs [out-file]   (default dist/facts.json)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';

const out = process.argv[2] || 'dist/facts.json';
const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
const SITE = 'https://micaw.github.io/micas-brain/training/#';

const home = read('src/content/home.json');
const insights = read('src/content/insights.json');
const mechanics = read('src/content/toolkit/mechanics.json');
const index = read('src/content/generated/playbook-index.json');

const slugify = (t) =>
  t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const topicPath = {};
for (const stage of index.stages)
  for (const part of stage.parts)
    for (const topic of part.topics)
      topicPath[topic.id] = `/playbook/stage-${stage.n}/${slugify(topic.title)}`;

// Plain text: drop markdown links and bold marks.
const plain = (s = '') => s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
// Keep whole sentences up to roughly `max` characters.
const clip = (s, max = 230) => {
  s = plain(s);
  if (s.length <= max) return s;
  const parts = s.match(/[^.!?]+[.!?]+(\s|$)/g) || [s];
  let acc = '';
  for (const p of parts) { if ((acc + p).length > max && acc) break; acc += p; }
  return acc.trim() || s.slice(0, max).replace(/\s+\S*$/, '') + '…';
};
// "Roediger and Karpicke (2006), Test-enhanced…" -> "Roediger and Karpicke (2006)"
const cite = (s = '') => { const m = plain(s).match(/^[^.;]*?\(\d{4}\)/); return m ? m[0] : ''; };
const link = (path) => SITE + (path || '/');

const groups = {
  Research: home.findings.items.map((f) => ({
    title: plain(f.title), body: clip(f.use), source: cite(f.source), href: link(topicPath[f.topicId]),
  })),
  'Myth, busted': home.myths.items.map((m) => ({
    title: plain(m.claim).replace(/^"|"$/g, '').replace(/^“|”$/g, ''), body: clip(m.why),
    source: plain(m.verdict), href: link('/'),
  })),
  Tip: home.mistakes.items.map((m) => ({
    title: 'Avoid: ' + plain(m.title).replace(/\.$/, ''), body: clip('Instead: ' + plain(m.instead)), source: '', href: link(topicPath[m.topicId]),
  })),
  Theory: mechanics.map((m) => ({
    title: plain(m.name), body: clip(m.what || m.description), source: cite(m.basis), href: link(`/playbook/mechanics/${m.slug}`),
  })),
  Inspiration: home.cases.items.map((c) => ({
    title: `${plain(c.name)}: ${plain(c.programme)}`, body: clip('Worth borrowing: ' + plain(c.borrow)), source: '', href: link('/'),
  })),
  'Big read': insights.ideas.map((i) => ({
    title: plain(i.title), body: clip(i.standfirst), source: '', href: link(`/insights/${i.slug}`),
  })),
};

// Optional hand-written facts from other sites (AI Ethics, Facilitation): home/facts-extra.json
// Each entry: { "kind": "Theory", "site": "AI Ethics", "title": "...", "body": "...", "source": "...", "href": "https://..." }
let extra = [];
if (existsSync('home/facts-extra.json')) extra = read('home/facts-extra.json');

// Seeded shuffle within each kind, then deal the kinds in turn so consecutive days differ.
let seed = 20261119;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const piles = Object.entries(groups).map(([kind, items]) => shuffle(items.filter((x) => x.title && x.body).map((x) => ({ kind, site: 'Training', ...x }))));
const bySite = {};
for (const e of extra) (bySite[e.site] ||= []).push(e);
for (const list of Object.values(bySite)) piles.push(shuffle(list));

const facts = [];
while (piles.some((p) => p.length)) for (const p of piles) if (p.length) facts.push(p.shift());

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify({ start: '2026-11-19', facts }, null, 0));
console.log(`facts.json: ${facts.length} facts -> ${out}`);
