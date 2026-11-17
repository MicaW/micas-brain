import { Link } from 'react-router-dom';
import { stageByN } from '../lib.js';
import { Pill, StageTag } from './ui.jsx';

export default function CaseCard({ item, labels, status }) {
  return (
    <Link className="tile dark cs s4" to={`/case-studies/${item.slug}`}>
      <div className="cs-body">
        <div className="cs-top">
          <StageTag n={item.stage} />
          <Pill className="quiet">{status}</Pill>
        </div>
        <h3>{item.name}</h3>
        <p className="cs-prog">{item.programme}</p>
        <dl className="kv">
          <dt>{labels.what}</dt>
          <dd>{item.what}</dd>
          <dt>{labels.why}</dt>
          <dd>{item.why}</dd>
        </dl>
      </div>
      <div className="cs-borrow" style={{ background: stageByN(item.stage).color }}>
        <span>{labels.borrow}</span>
        <strong>{item.borrow}</strong>
      </div>
    </Link>
  );
}
