import Blocks from '../components/Blocks.jsx';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mechanics, methods, recipes, site, splitList, toolkitRef } from '../lib.js';
import { Arrow, EvidenceRating, Pill, PlusMinus } from '../components/ui.jsx';
import NotFound from './NotFound.jsx';

const tierOf = (item) => site.evidenceTiers.find((t) => t.tier === item.tier);

/* ---------- Toolkit landing ---------- */
const LIBRARIES = [
  { to: '/toolkit/methods', title: 'Method finder', text: 'Ways to teach something, from a worked example to a live simulation. Browse for ideas, or filter by what the method has to do.', tone: 'paper', span: 's7' },
  { to: '/toolkit/recipes', title: 'Session recipes', text: 'Recipes for sessions: an order of events to start from, and what to watch for.', tone: 'dark', span: 's5' },
  { to: '/toolkit/templates', title: 'Templates', text: 'Working documents to copy: a needs analysis, a session plan, an evaluation plan.', tone: 'lime', span: 's12' },
];

export function ToolkitHome() {
  return (
    <>
      <section className="pb-head" aria-labelledby="h-toolkit">
        <h1 id="h-toolkit" className="hero-h1">
          The Toolkit
        </h1>
        <p className="lead">Methods, recipes and ideas for sessions. Come here when you have a session to design.</p>
      </section>
      <section className="g" aria-label="Libraries">
        {LIBRARIES.map((lib) => (
          <Link key={lib.to} className={`tile hub-tile ${lib.tone} ${lib.span} ${lib.tone === 'dark' ? '' : 'onp'}`} to={lib.to}>
            <div>
              <h2>{lib.title}</h2>
              <p>{lib.text}</p>
            </div>
            <Arrow />
          </Link>
        ))}
      </section>
      <section className="section" aria-labelledby="h-need">
        <h2 id="h-need" className="h2">
          Start from what you need
        </h2>
        <div>
          {toolkitRef.mechanicsByNeed.map((row) => (
            <div className="need" key={row.need}>
              <h3>{row.need.replace(' after the retreat', ' afterwards')}</h3>
              <dl className="kv">
                <dt>Lean on these mechanics</dt>
                <dd>{splitList(row.mechanics).join(', ')}</dd>
                <dt>Recipes to start from</dt>
                <dd>{splitList(row.recipes).join(', ')}</dd>
                <dt>Why</dt>
                <dd>{row.why}</dd>
              </dl>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/* ---------- A library: search, filters, and a list of rows ---------- */
function Library({ title, lead, items, filters, placeholder, rated = false, crumb = false }) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [picked, setPicked] = useState({});
  const shown = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return items.filter((item) => filters.every((f) => !picked[f.key] || item[f.key] === picked[f.key]) && words.every((w) => item.text.includes(w)));
  }, [items, filters, picked, query]);
  const filtering = query.trim() || Object.values(picked).some(Boolean);
  return (
    <>
      {crumb && (
        <nav className="crumb" aria-label="Breadcrumb">
          <Link className="txt" to="/playbook">
            Playbook
          </Link>
        </nav>
      )}
      <section className="pb-head" aria-labelledby="h-lib" style={crumb ? { paddingTop: 0 } : undefined}>
        <h1 id="h-lib" className="hero-h1">
          {title}
        </h1>
        <p className="lead">{lead}</p>
      </section>
      <section className="section" aria-label="Find">
        <div className={showFilters ? 'filters open' : 'filters'}>
          <div className="filter-row">
            <label className="sr-only" htmlFor="lib-q">
              {placeholder}
            </label>
            <input id="lib-q" className="lib-search" type="search" placeholder={placeholder} value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
            {filters.length > 0 && (
              <button className="chip filter-toggle" type="button" aria-expanded={showFilters} onClick={() => setShowFilters(!showFilters)}>
                {showFilters ? 'Hide filters' : 'Filters'}
              </button>
            )}
            {filtering && (
              <button className="chip" type="button" onClick={() => { setQuery(''); setPicked({}); }}>
                Clear filters
              </button>
            )}
          </div>
          {filters.map((f) => (
            <div className="filter-row filter-group" role="group" aria-label={f.label} key={f.key}>
              <span className="filter-label">{f.label}</span>
              {f.options.map((option) => (
                <button key={option.value} className="chip" type="button" aria-pressed={picked[f.key] === option.value} onClick={() => setPicked({ ...picked, [f.key]: picked[f.key] === option.value ? null : option.value })}>
                  {option.label}
                </button>
              ))}
            </div>
          ))}
        </div>
        <p className="sr-only" role="status">
          {shown.length} shown
        </p>
        {shown.length ? (
          <ul className="lib-list">
            {shown.map((item) => (
              <li key={item.to}>
                <Link className="lib-row" to={item.to} style={rated ? undefined : { gridTemplateColumns: 'minmax(0, 1fr) 28px' }}>
                  <span>
                    <span className="lib-name">{item.name}</span>
                    <span className="meta">{item.sub}</span>
                  </span>
                  {rated && <EvidenceRating tier={item.tier} />}
                  <Arrow />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="lib-empty">Nothing matches. Remove a filter or try a different word.</p>
        )}
      </section>
    </>
  );
}

const tierFilter = (items) => ({
  key: 'tier',
  label: 'Evidence',
  options: site.evidenceTiers.filter((t) => items.some((i) => i.tier === t.tier)).map((t) => ({ value: t.tier, label: `${t.tier} ${t.word}` })),
});

export function MethodFinder() {
  const items = methods.map((m) => ({ ...m, to: `/toolkit/methods/${m.slug}`, sub: `${m.family}. ${m.bestFor}`, text: `${m.name} ${m.family} ${m.description} ${m.bestFor} ${m.variants.map((v) => v.name).join(' ')}`.toLowerCase() }));
  const families = [...new Set(methods.map((m) => m.family))];
  const phases = [...new Set(methods.map((m) => m.phase))];
  return (
    <Library
      title="Method finder"
      lead="Choose a method by what it has to do, not by what is new."
      placeholder="Search methods"
      items={items}
      filters={[
        { key: 'family', label: 'It helps people', options: families.map((f) => ({ value: f, label: f })) },
        { key: 'phase', label: 'When', options: phases.map((p) => ({ value: p, label: p.replace(' retreat experience', ' session') })) },
      ]}
    />
  );
}

export function MechanicList() {
  const items = mechanics.map((m) => ({ ...m, to: `/playbook/mechanics/${m.slug}`, sub: m.useful, text: `${m.name} ${m.description} ${m.useful}`.toLowerCase() }));
  return <Library title="Learning mechanics" lead="A method works because of what it makes the learner do. These are those things, and how to design for each." crumb placeholder="Search mechanics" items={items} filters={[]} />;
}

export function RecipeList() {
  const items = recipes.map((r) => ({ ...r, name: r.plainName || r.name, to: `/toolkit/recipes/${r.slug}`, sub: `${r.duration}. ${r.purpose}`, text: `${r.name} ${r.purpose} ${r.bestUse} ${r.methods}`.toLowerCase() }));
  return <Library title="Session recipes" lead="Recipes and ideas for sessions, each with an order of events to start from. Borrow the structure, then check the results yourself." placeholder="Search recipes" items={items} filters={[]} rated={false} />;
}

/* ---------- Detail pages ---------- */
function Crumb({ to, label, root = { to: '/toolkit', label: 'Toolkit' } }) {
  return (
    <nav className="crumb" aria-label="Breadcrumb">
      <Link className="txt" to={root.to}>
        {root.label}
      </Link>
      <span className="sep" aria-hidden="true">
        /
      </span>
      <Link className="txt" to={to}>
        {label}
      </Link>
    </nav>
  );
}
function Facts({ rows }) {
  return (
    <dl className="facts">
      {rows.filter(([, value]) => value).map(([term, value]) => (
        <div key={term}>
          <dt>{term}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
function Bullets({ text }) {
  return (
    <ul>
      {splitList(text).map((line) => (
        <li key={line}>{(line.charAt(0).toUpperCase() + line.slice(1)).replace(/\.$/, '')}</li>
      ))}
    </ul>
  );
}
const ProvisionalNote = () => <p className="status">Rating is provisional. Where the source gave a mixed rating, the more cautious letter is shown.</p>;

export function MethodDetail() {
  const { slug } = useParams();
  const m = methods.find((x) => x.slug === slug);
  if (!m) return <NotFound />;
  return (
    <>
      <section className="detail-head" aria-labelledby="h-detail">
        <Crumb to="/toolkit/methods" label="Method finder" />
        <h1 id="h-detail" className="detail-h1">
          {m.name}
        </h1>
        <p className="lead">{m.description}</p>
        <Pill>{m.family}</Pill>
      </section>
      <div className="detail-grid">
        <div className="prose">
          <h2>Use it for</h2>
          <p>{m.bestFor}</p>
          {(m.howTo || []).length > 0 && (
            <>
              <h2>How to run it</h2>
              <ol className="steps">
                {m.howTo.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </>
          )}
          {m.cautions && (
            <>
              <h2>Watch out</h2>
              <p>{m.cautions}</p>
            </>
          )}
          {m.variants.length > 0 && (
            <>
              <h2>Ways to run it</h2>
              <ul className="plain-list">
                {m.variants.map((v) => (
                  <li key={v.name}>
                    <strong>{v.name}</strong>
                    {v.description && <span style={{ flexBasis: '100%' }}>{v.description}</span>}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <aside aria-label="Key facts">
          <Facts rows={[['Time', m.time], ['Group', m.group], ['Format', m.format], ['When to use it', m.phase.replace(' retreat experience', ' session')], ['Why it works', splitList(m.mechanics).join(', ')]]} />
        </aside>
      </div>
    </>
  );
}

export function MechanicDetail() {
  const { slug } = useParams();
  const m = mechanics.find((x) => x.slug === slug);
  if (!m) return <NotFound />;
  return (
    <>
      <section className="detail-head" aria-labelledby="h-detail">
        <Crumb to="/playbook/mechanics" label="Learning mechanics" root={{ to: '/playbook', label: 'Playbook' }} />
        <h1 id="h-detail" className="detail-h1">
          {m.name}
        </h1>
        <p className="lead">{m.description}</p>
      </section>
      <div className="detail-grid">
        <div className="prose">
          <h2>What is happening</h2>
          <p>{m.what}</p>
          <h2>Try it</h2>
          <p>{m.example}</p>
          <h2>How it goes wrong</h2>
          <Bullets text={m.failures} />
          <h2>Check your design</h2>
          <p>{m.checks}</p>
        </div>
        <aside aria-label="Key facts">
          <Facts rows={[['Most useful for', m.useful], ['Methods that use it', m.methods], ['Evidence base', m.basis]]} />
        </aside>
      </div>
    </>
  );
}

export function RecipeDetail() {
  const { slug } = useParams();
  const r = recipes.find((x) => x.slug === slug);
  if (!r) return <NotFound />;
  return (
    <>
      <section className="detail-head" aria-labelledby="h-detail">
        <Crumb to="/toolkit/recipes" label="Session recipes" />
        <h1 id="h-detail" className="detail-h1">
          {r.plainName || r.name}
        </h1>
        <p className="lead">{r.purpose}</p>
        {r.plainName && <p className="meta">Also known as {r.name}</p>}
        <Pill>{r.duration}</Pill>
      </section>
      <div className="detail-grid">
        <div className="prose">
          <h2>The order of events</h2>
          <ol className="steps">
            {r.sequence.map((step) => (
              <li key={step}>{step.charAt(0).toUpperCase() + step.slice(1)}</li>
            ))}
          </ol>
          {r.runSheet && <Blocks blocks={[{ type: 'artefact', title: 'A run sheet to start from', table: r.runSheet }]} />}
          <h2>Watch out</h2>
          <p>{r.cautions}</p>
          <h2>What you come away with</h2>
          <Bullets text={r.outputs} />
        </div>
        <aside aria-label="Key facts">
          <Facts rows={[['Who it suits', r.audience], ['Best for', r.bestUse], ['Methods combined', splitList(r.methods).join(', ')], ['Mechanics at work', splitList(r.mechanics).join(', ')], ['Room and setup', r.setup], ['People you need', r.needs]]} />
        </aside>
      </div>
    </>
  );
}

export function Templates() {
  const list = site.templateData || [];
  return (
    <>
      <section className="detail-head" aria-labelledby="h-detail">
        <Crumb to="/toolkit/templates" label="Templates" />
        <h1 id="h-detail" className="detail-h1">
          Templates
        </h1>
        <p className="lead">Working documents you fill in for a real piece of work. Each one says what it is for, what goes under each heading, and shows one filled in.</p>
      </section>
      <div className="tpl-list">
        {list.map((t) => (
          <details className="tpl-item" key={t.name}>
            <summary>
              <span className="tpl-name">{t.name}</span>
              <span className="tpl-what">{t.what}</span>
              <PlusMinus />
            </summary>
            <div className="tpl-body prose">
              <p>
                <strong>When to use it.</strong> {t.when}
              </p>
              <h3>What goes in it</h3>
              <dl className="tpl-fields">
                {t.fields.map((f) => (
                  <div key={f.heading}>
                    <dt>{f.heading}</dt>
                    <dd>{f.guidance}</dd>
                  </div>
                ))}
              </dl>
              {t.example && <Blocks blocks={[{ type: 'artefact', title: t.example.title, table: { head: ['Heading', 'Filled in'], rows: t.example.rows.map((row) => row.slice(0, 2)) } }]} />}
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
