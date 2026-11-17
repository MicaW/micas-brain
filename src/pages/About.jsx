import evidence from '../content/evidence.json';
import { stageByN, stageLabel } from '../lib.js';

const External = ({ url, children }) => (
  <a className="txt" href={url} target="_blank" rel="noreferrer">
    {children}
    <span className="sr-only"> (opens in a new tab)</span>
  </a>
);

export default function About() {
  const { made } = evidence.about;
  return (
    <>
      <section className="detail-head" aria-labelledby="h-detail">
        <h1 id="h-detail" className="detail-h1">
          About this site
        </h1>
        <p className="lead">A personal handbook on how people learn and how to train them well, built to learn the field properly.</p>
      </section>
      <div className="detail-grid">
        <div className="prose">
          {made.map((block) => (
            <section key={block.h}>
              <h2>{block.h}</h2>
              <p>{block.p}</p>
            </section>
          ))}
        </div>
        <aside className="prose" aria-labelledby="h-reading">
          <h2 id="h-reading">Reading list</h2>
          {evidence.reading.map((group) => (
            <section key={group.stage}>
              <p>
                <strong>{stageLabel(stageByN(group.stage))}</strong>
              </p>
              <ul>
                {group.items.map((item) => (
                  <li key={item.label || item}>{item.url ? <External url={item.url}>{item.label}</External> : item.label || item}</li>
                ))}
              </ul>
            </section>
          ))}
          <h2>Reports behind the figures</h2>
          <ul>
            {evidence.sources.map((source) => (
              <li key={source.url}>
                <External url={source.url}>{source.label}</External>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
