import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { showFormats, site } from '../lib.js';
import evidence from '../content/evidence.json';
import { Button, Pill } from '../components/ui.jsx';
import NotFound from './NotFound.jsx';

/* The few pages that still exist only as outline. They are reachable and say plainly what they are. */
export function OutlinePage() {
  const { pathname } = useLocation();
  const page = site.outline.find((p) => p.path === pathname);
  const [query, setQuery] = useState('');
  if (!page || (page.private && !showFormats)) return <NotFound />;
  if (page.title === 'Glossary') {
    return (
      <section className="outline" aria-labelledby="h-outline">
        <h1 id="h-outline">{page.title}</h1>
        <p className="lead">The terms the site uses, in plain words.</p>
        <label className="sr-only" htmlFor="glossary-q">
          Filter the glossary
        </label>
        <input id="glossary-q" className="lib-search glossary-q" type="search" placeholder="Filter terms" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
        {(() => {
          const q = query.trim().toLowerCase();
          const shown = evidence.glossary.filter((entry) => !q || `${entry.term} ${entry.def}`.toLowerCase().includes(q));
          return (
            <>
              <p className="sr-only" role="status">
                {q ? (shown.length ? 'Showing matching terms.' : 'No terms match.') : ''}
              </p>
              {shown.length === 0 && <p className="lib-empty">No term matches that. Try a shorter word.</p>}
              <dl className="glossary">
                {shown.map((entry) => (
                  <div key={entry.term}>
                    <dt>{entry.term}</dt>
                    <dd>{entry.def}</dd>
                  </div>
                ))}
              </dl>
            </>
          );
        })()}
      </section>
    );
  }
  return (
    <section className="outline" aria-labelledby="h-outline">
      <Pill>Outline only. Not designed or written yet.</Pill>
      <h1 id="h-outline">{page.title}</h1>
      <p className="lead">This page will hold: {page.holds}</p>
      <div className="outline-links">
        <Button variant="text" to={page.up}>
          Back
        </Button>
      </div>
    </section>
  );
}
