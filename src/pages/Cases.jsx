import { Link, useParams } from 'react-router-dom';
import home from '../content/home.json';
import { stageByN, stageLabel, stagePath } from '../lib.js';
import { CaseGrid } from '../components/sections.jsx';
import { Pill } from '../components/ui.jsx';
import NotFound from './NotFound.jsx';

export function CaseIndex() {
  return (
    <>
      <section className="pb-head" aria-labelledby="h-cases">
        <h1 id="h-cases" className="hero-h1">
          Who does this well
        </h1>
        <p className="lead">Providers known for excellent training, and the one thing worth borrowing from each. {home.cases.selectionRule.replace('Publicly', 'Each is publicly')}</p>
      </section>
      <CaseGrid />
    </>
  );
}

export function CaseDetail() {
  const { slug } = useParams();
  const { cases } = home;
  const item = cases.items.find((c) => c.slug === slug);
  if (!item) return <NotFound />;
  const stage = stageByN(item.stage);
  return (
    <div style={{ '--stage': stage.color, display: 'contents' }}>
      <section className="detail-head" aria-labelledby="h-detail">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link className="txt" to="/case-studies">
            Case studies
          </Link>
        </nav>
        <h1 id="h-detail" className="detail-h1">
          {item.name}
        </h1>
        <p className="lead">{item.programme}</p>
        <div className="detail-meta">
          <Link className="txt" to={stagePath(stage.n)}>
            {stageLabel(stage)}
          </Link>
          <Pill>{item.status || cases.statusPill}</Pill>
        </div>
      </section>
      <div className="detail-grid">
        <div className="prose">
          <h2>{cases.labels.what}</h2>
          <p>{item.what}</p>
          <h2>{cases.labels.why}</h2>
          <p>{item.why}</p>
          {(item.story || []).length > 0 && <h2>How it runs</h2>}
          {(item.story || []).map((para) => (
            <p key={para}>{para}</p>
          ))}
          <h2>The evidence</h2>
          {item.thin && <p className="status">Evidence is thin. {item.thinReason}</p>}
          {item.results ? <p>{item.results}</p> : <p className="unwritten">Not written yet. This section needs public sources before anything is claimed.</p>}
          {item.limits && (
            <>
              <h2>Where it does not carry over</h2>
              <p>{item.limits}</p>
            </>
          )}
          {(item.sources || []).length > 0 && (
            <>
              <h2>Sources</h2>
              <ul className="plain-list">
                {item.sources.map((source) => (
                  <li key={source.url}>
                    <strong>{source.label}</strong>
                    <a className="txt" href={source.url} target="_blank" rel="noreferrer">
                      Open the source<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div className="borrow">
          <span>{cases.labels.borrow}</span>
          <strong>{item.borrow}</strong>
        </div>
      </div>
    </div>
  );
}
