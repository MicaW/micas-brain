import { useState } from 'react';
import { stageByN } from '../lib.js';
import { PlusMinus, StageTag } from './ui.jsx';

/* Closed: who, what they are known for, and the one thing to borrow. Open: the rest. */
export default function CaseCard({ item, labels }) {
  const [open, setOpen] = useState(false);
  const id = `case-${item.slug}`;
  return (
    <div className={open ? 'tile dark cs cs-x open' : 'tile dark cs cs-x s4'}>
      <button className="cs-head" type="button" aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => setOpen(!open)}>
        <span className="cs-top">
          <StageTag n={item.stage} />
          <PlusMinus />
        </span>
        <span className="cs-name">{item.name}</span>
        <span className="cs-prog">{item.programme}</span>
      </button>
      <div className="cs-borrow" style={{ background: stageByN(item.stage).color }}>
        <span>{labels.borrow}</span>
        <strong>{item.borrow}</strong>
      </div>
      {open && (
        <div className="cs-more" id={id}>
          <div>
            <h3>{labels.what}</h3>
            <p>{item.what}</p>
            <h3>{labels.why}</h3>
            <p>{item.why}</p>
            {(item.story || []).length > 0 && <h3>How it runs</h3>}
            {(item.story || []).map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
          <div>
            {item.results && (
              <>
                <h3>The evidence</h3>
                <p>{item.results}</p>
              </>
            )}
            {item.limits && (
              <>
                <h3>Where it does not carry over</h3>
                <p>{item.limits}</p>
              </>
            )}
            {(item.sources || []).length > 0 && <h3>Sources</h3>}
            <ul>
              {(item.sources || []).map((source) => (
                <li key={source.url}>
                  <a className="txt" href={source.url} target="_blank" rel="noreferrer">
                    {source.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
