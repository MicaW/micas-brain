import evidence from '../content/evidence.json';

export default function About() {
  const { made, log } = evidence.about;
  return (
    <>
      <section className="detail-head" aria-labelledby="h-detail">
        <h1 id="h-detail" className="detail-h1">
          How this site was made and checked
        </h1>
        <p className="lead">The site asks trainers to rate their evidence and show their sources. It holds itself to the same rule.</p>
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
        <aside className="prose" aria-labelledby="h-log" id="learning-log">
          <h2 id="h-log">Learning log</h2>
          {log.map((entry) => (
            <section key={entry.date}>
              <p className="status">{entry.date}</p>
              <ul>
                {entry.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </aside>
      </div>
    </>
  );
}
