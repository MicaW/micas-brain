import { useState } from 'react';
import { Pill, StageTag } from './ui.jsx';

function Chevron({ back = false }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={back ? 'M16 10H4M9 5l-5 5 5 5' : 'M4 10h12M11 5l5 5-5 5'} />
    </svg>
  );
}

/* One pale card over two rotated colour layers. Previous and next wrap around.
   Every claim in the file is here: the written ones first, then the ones still to trace. */
export default function MythStack({ myths }) {
  const [index, setIndex] = useState(0);
  const all = [
    ...myths.items,
    ...myths.stillToWrite.map((claim) => ({ claim: `"${claim}"`, verdict: myths.unwrittenVerdict, why: myths.unwrittenWhy, unwritten: true })),
  ];
  const total = all.length;
  const myth = all[index];
  const counter = myths.counter.replace('{n}', index + 1).replace('{total}', total);
  return (
    <section className="g myths vp" aria-labelledby="h-myths">
      <div className="s5 myth-side">
        <Pill className="start">{myths.pill}</Pill>
        <h2 id="h-myths" className="h2">
          {myths.heading}
        </h2>
        <p>{myths.intro}</p>
        <div className="myth-ctl">
          <button className="rb" type="button" aria-label="Previous myth" onClick={() => setIndex((index + total - 1) % total)}>
            <Chevron back />
          </button>
          <button className="rb" type="button" aria-label="Next myth" onClick={() => setIndex((index + 1) % total)}>
            <Chevron />
          </button>
        </div>
      </div>
      <div className="s7 myth-stack">
        <div className="myth-layer back" aria-hidden="true" />
        <div className="myth-layer mid" aria-hidden="true" />
        <div className={myth.unwritten ? 'tile myth-card unwritten' : 'tile myth-card'} aria-live="polite" aria-atomic="true">
          <div className="myth-top">
            <Pill>{myth.unwritten ? 'Myth, not written yet' : 'Myth'}</Pill>
            {myth.stage && <StageTag n={myth.stage} />}
          </div>
          <p className="myth-claim">{myth.claim}</p>
          <div>
            <p className="myth-verdict">{myth.verdict}</p>
            <p className="note">{myth.why}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
