import { useState } from 'react';
import { Link } from 'react-router-dom';
import { byStage, stageByN, topicById } from '../lib.js';
import { Pill, StageTag } from './ui.jsx';

/* A card that turns over. Front: the claim. Back: what to do about it, in the stage's colour. */
function FlipCard({ item, front, back }) {
  const [turned, setTurned] = useState(false);
  const topic = topicById(item.topicId);
  const stage = stageByN(item.stage);
  return (
    <div className={turned ? 'flip turned' : 'flip'} style={{ '--stage': stage.color }}>
      <button className="flip-face flip-front" type="button" aria-expanded={turned} onClick={() => setTurned(!turned)}>
        <StageTag n={item.stage} />
        <span className="flip-title">{item.title}</span>
        <span className="flip-hint">{turned ? 'Turn back' : front}</span>
      </button>
      {turned && (
        <div className="flip-face flip-back">
          {back(item)}
          {topic && (
            <Link className="txt" to={topic.path}>
              Read {topic.stage.n}.{topic.n} {topic.title}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function FlipDeck({ id, pill, heading, items, front, back, first = 6 }) {
  const [all, setAll] = useState(false);
  const sorted = byStage(items);
  // Closed, show a spread across the stages, not the first few of stage 1.
  const seen = new Set();
  const spread = sorted.filter((item) => !seen.has(item.stage) && seen.add(item.stage)).slice(0, first);
  const shown = all ? sorted : spread;
  return (
    <section className="deck vp" aria-labelledby={id}>
      <div className="deck-head">
        <Pill className="start">{pill}</Pill>
        <h2 id={id} className="h2">
          {heading}
        </h2>
      </div>
      <div className="deck-grid">
        {shown.map((item) => (
          <FlipCard key={item.title} item={item} front={front} back={back} />
        ))}
      </div>
      {sorted.length > first && (
        <button className="deck-more" type="button" aria-expanded={all} onClick={() => setAll(!all)}>
          {all ? 'Show fewer' : 'Show all'}
        </button>
      )}
    </section>
  );
}
