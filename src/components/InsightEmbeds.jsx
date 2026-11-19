import home from '../content/home.json';
import { byStage } from '../lib.js';
import { FlipCard } from './FlipDeck.jsx';
import { CaseGrid } from './sections.jsx';
import { StageTag } from './ui.jsx';

/* Content that used to sit on the home page, laid out for a reading page.
   Each Insight that carries an `embed` field shows one of these. */

function FlipGrid({ items, front, back, label }) {
  return (
    <section className="ins-embed" aria-label={label}>
      <div className="deck-grid">
        {byStage(items).map((item) => (
          <FlipCard key={item.title} item={item} front={front} back={back} />
        ))}
      </div>
    </section>
  );
}

/* Every myth on the page at once: the claim, the verdict, why, and the source. */
function MythList() {
  const { items } = home.myths;
  return (
    <section className="ins-embed myth-list" aria-label="The myths">
      {byStage(items).map((m) => (
        <article className="myth-item" key={m.claim}>
          <div className="myth-item-top">
            <StageTag n={m.stage} />
          </div>
          <h2 className="myth-item-claim">{m.claim}</h2>
          <p className="myth-item-verdict">{m.verdict}</p>
          <p>{m.why}</p>
          {(m.sources || []).map((src) => (
            <a key={src.url} className="txt myth-item-src" href={src.url} target="_blank" rel="noreferrer">
              {src.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        </article>
      ))}
    </section>
  );
}

export default function InsightEmbed({ kind }) {
  if (kind === 'mistakes')
    return (
      <FlipGrid
        label="The mistakes"
        items={home.mistakes.items}
        front="Turn over for the fix"
        back={(item) => (
          <>
            <p className="flip-lead">{item.instead}</p>
            <p>{item.why}</p>
          </>
        )}
      />
    );
  if (kind === 'findings')
    return (
      <FlipGrid
        label="The findings"
        items={home.findings.items}
        front="Turn over to use it"
        back={(item) => (
          <>
            <p className="flip-lead">{item.use}</p>
            <p>{item.source}</p>
          </>
        )}
      />
    );
  if (kind === 'myths') return <MythList />;
  if (kind === 'cases')
    return (
      <section className="ins-embed ins-cases" id="cases" aria-labelledby="h-cases">
        <h2 id="h-cases" className="ins-h2">
          The case studies
        </h2>
        <p className="ins-intro">Open a card for how each one runs, the evidence and its limits.</p>
        <CaseGrid />
      </section>
    );
  return null;
}
