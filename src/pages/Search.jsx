import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import home from '../content/home.json';
import { mechanics, methods, recipes, stageLabel, topicById, topics } from '../lib.js';
import { Arrow } from '../components/ui.jsx';

// Everything that can be found, built once.
const INDEX = [
  ...topics.map((t) => ({ group: 'Playbook topics', name: t.title, sub: `${stageLabel(t.stage)}. ${t.theory}`, to: t.path })),
  ...home.mistakes.items.map((m) => ({ group: 'Common mistakes', name: m.title, sub: m.instead, to: topicById(m.topicId).path })),
  ...home.findings.items.map((f) => ({ group: 'Findings', name: f.title, sub: f.source, to: topicById(f.topicId).path })),
  ...methods.map((m) => ({ group: 'Methods', name: m.name, sub: m.description, to: `/toolkit/methods/${m.slug}`, extra: m.variants.map((v) => v.name).join(' ') })),
  ...mechanics.map((m) => ({ group: 'Learning mechanics', name: m.name, sub: m.useful, to: `/playbook/mechanics/${m.slug}` })),
  ...recipes.map((r) => ({ group: 'Session recipes', name: r.name, sub: r.purpose, to: `/toolkit/recipes/${r.slug}` })),
  ...home.cases.items.map((c) => ({ group: 'Case studies', name: c.name, sub: c.programme, to: `/case-studies/${c.slug}` })),
].map((entry) => ({ ...entry, text: `${entry.name} ${entry.sub} ${entry.extra || ''}`.toLowerCase() }));

export default function Search() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const groups = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    const hits = INDEX.filter((entry) => words.every((w) => entry.text.includes(w)));
    return [...new Set(hits.map((h) => h.group))].map((group) => ({ group, hits: hits.filter((h) => h.group === group) }));
  }, [query]);

  return (
    <>
      <section className="detail-head" aria-labelledby="h-detail">
        <h1 id="h-detail" className="detail-h1">
          Search
        </h1>
        <label className="sr-only" htmlFor="search-page-q">
          Search the site
        </label>
        <input id="search-page-q" className="lib-search" type="search" placeholder="Search methods, topics, studies" value={query} onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })} autoComplete="off" />
      </section>
      <section aria-label="Results" aria-live="polite">
        {!query.trim() && <p className="lib-empty">Type a word to search topics, mistakes, findings, methods, mechanics, recipes and case studies.</p>}
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
