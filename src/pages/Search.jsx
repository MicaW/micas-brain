import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import home from '../content/home.json';
import insights from '../content/insights.json';
import evidence from '../content/evidence.json';
import { mechanics, site, stageLabel, topicById, topics } from '../lib.js';
import { methods, recipes } from '../toolkit-data.js';
import { Arrow } from '../components/ui.jsx';

// Everything that can be found, built once.
const INDEX = [
  ...topics.map((t) => ({ group: 'Playbook topics', name: t.title, sub: `${stageLabel(t.stage)}. ${t.theory}`, to: t.path })),
  ...home.mistakes.items.map((m) => ({ group: 'Common mistakes', name: m.title, sub: m.instead, to: topicById(m.topicId).path })),
  ...home.findings.items.map((f) => ({ group: 'Findings', name: f.title, sub: f.source, to: topicById(f.topicId).path })),
  ...methods.map((m) => ({ group: 'Methods', name: m.name, sub: m.description, to: `/toolkit/methods/${m.slug}`, extra: m.variants.map((v) => v.name).join(' ') })),
  ...mechanics.map((m) => ({ group: 'Learning mechanics', name: m.name, sub: m.useful, to: `/playbook/mechanics/${m.slug}` })),
  ...recipes.map((r) => ({ group: 'Session recipes', name: r.plainName || r.name, sub: r.purpose, to: `/toolkit/recipes/${r.slug}`, extra: r.name })),
  ...home.cases.items.map((c) => ({ group: 'Case studies', name: c.name, sub: c.programme, to: '/insights/what-good-looks-like-today' })),
  ...insights.ideas.map((i) => ({ group: 'Insights', name: i.title, sub: i.standfirst, to: `/insights/${i.slug}` })),
  ...site.templateData.map((t) => ({ group: 'Templates', name: t.name, sub: t.what, to: '/toolkit/templates', extra: t.when })),
  ...evidence.glossary.map((g) => ({ group: 'Glossary', name: g.term, sub: g.def, to: '/glossary' })),
].map((entry) => ({ ...entry, text: `${entry.name} ${entry.sub} ${entry.extra || ''}`.toLowerCase() }));

export default function Search() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  // The words inside every topic, fetched once, so a search also finds topics that mention the word in their text.
  const [inside, setInside] = useState(null);
  useEffect(() => {
    let live = true;
    import('../content/generated/search-words.json').then((m) => live && setInside(m.default), () => {});
    return () => {
      live = false;
    };
  }, []);
  const groups = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    const hits = INDEX.filter((entry) => words.every((w) => entry.text.includes(w)));
    const found = new Set(hits.filter((h) => h.group === 'Playbook topics').map((h) => h.to));
    const mentions =
      inside && words.every((w) => w.length > 2)
        ? topics
            .filter((t) => !found.has(t.path) && words.every((w) => `${t.title.toLowerCase()} ${inside[t.id] || ''}`.includes(w)))
            .map((t) => ({ group: 'Topics that mention it', name: t.title, sub: `${stageLabel(t.stage)}. ${t.theory}`, to: t.path }))
        : [];
    const all = [...hits, ...mentions];
    const order = [...new Set(all.map((h) => h.group))].sort((a, b) => (a === 'Topics that mention it') - (b === 'Topics that mention it'));
    return order.map((group) => ({ group, hits: all.filter((h) => h.group === group) }));
  }, [query, inside]);

  return (
    <>
      <section className="detail-head" aria-labelledby="h-detail">
        <h1 id="h-detail" className="detail-h1">
          Search
        </h1>
        <label className="sr-only" htmlFor="search-page-q">
          Search the site
        </label>
        <input id="search-page-q" className="lib-search" type="search" placeholder="Search topics, methods, recipes" value={query} onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })} autoComplete="off" />
      </section>
      <section aria-label="Results" aria-live="polite">
        {!query.trim() && <p className="lib-empty">Type a word to search topics, insights, mistakes, findings, methods, mechanics, recipes, templates, case studies and the glossary.</p>}
        {query.trim() && groups.length === 0 && <p className="lib-empty">Nothing found for "{query}". Try a shorter or different word.</p>}
        {groups.map(({ group, hits }) => (
          <div key={group}>
            <h2 className="lib-group">{group}</h2>
            <ul className="lib-list">
              {hits.map((hit) => (
                <li key={hit.to + hit.name}>
                  <Link className="lib-row" to={hit.to} style={{ gridTemplateColumns: 'minmax(0, 1fr) 28px' }}>
                    <span>
                      <span className="lib-name">{hit.name}</span>
                      <span className="meta">{hit.sub}</span>
                    </span>
                    <Arrow />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}
