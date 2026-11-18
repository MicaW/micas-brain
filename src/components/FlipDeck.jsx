import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { byStage, stageByN, topicById } from '../lib.js';
import { Arrow, Pill, StageTag } from './ui.jsx';

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

export default function FlipDeck({ id, pill, heading, items, front, back }) {
  const scroller = useRef(null);
  const sorted = byStage(items);
  const move = (dir) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' });
  };
  return (
    <section className="deck vp" aria-labelledby={id}>
      <div className="deck-head">
        <div>
          <Pill className="start">{pill}</Pill>
          <h2 id={id} className="h2">
            {heading}
          </h2>
        </div>
        <div className="deck-nav">
          <button className="rb" type="button" aria-label="Scroll back" onClick={() => move(-1)}>
            <span style={{ display: 'inline-flex', transform: 'scaleX(-1)' }}>
              <Arrow size={20} />
            </span>
          </button>
          <button className="rb" type="button" aria-label="Scroll on" onClick={() => move(1)}>
            <Arrow size={20} />
          </button>
        </div>
      </div>
      <div className="deck-row" ref={scroller} tabIndex={0} role="group" aria-label={`${heading}: scroll sideways for more`}>
        {sorted.map((item) => (
          <FlipCard key={item.title} item={item} front={front} back={back} />
        ))}
      </div>
    </section>
  );
}
