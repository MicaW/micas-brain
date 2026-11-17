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
          <Pill>{cases.statusPill}</Pill>
        </div>
      </section>
      <div className="detail-grid">
        <div className="prose">
          <h2>{cases.labels.what}</h2>
          <p>{item.what}</p>
          <h2>{cases.labels.why}</h2>
          <p>{item.why}</p>
          <h2>The evidence</h2>
          <p className="unwritten">Not written yet. This section needs public sources before anything is claimed.</p>
        </div>
        <div className="borrow">
          <span>{cases.labels.borrow}</span>
          <strong>{item.borrow}</strong>
        </div>
      </div>
    </div>
  );
}
