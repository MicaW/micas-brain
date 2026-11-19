import { useRef } from 'react';
import { Link } from 'react-router-dom';
import insights from '../content/insights.json';
import { Arrow, ArrowSmall, Button, Pill } from './ui.jsx';

/* The newsfeed on the home page: the latest Insights pieces, newest first, in a sideways row. */
export default function InsightsFeed() {
  const scroller = useRef(null);
  const move = (dir) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' });
  };
  return (
    <section className="deck vp feed" aria-labelledby="h-feed">
      <div className="deck-head feed-head">
        <div>
          <Pill className="start">Insights</Pill>
          <h2 id="h-feed" className="h2">
            Latest research and ideas
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
      <div className="deck-row" ref={scroller} tabIndex={0} role="group" aria-label="Latest insights: scroll sideways for more">
        {insights.ideas.map((idea) => (
          <Link key={idea.slug} className="tile ins-tile feed-card" to={`/insights/${idea.slug}`} style={{ background: idea.color }}>
            <span className="ins-tile-meta">
              <Pill>{idea.kind}</Pill>
              <span>{idea.date}</span>
            </span>
            <span className="ins-tile-h">{idea.title}</span>
            <span className="ins-tile-go">
              Read it <ArrowSmall />
            </span>
          </Link>
        ))}
      </div>
      <Button variant="lm" to="/insights">
        All insights
      </Button>
    </section>
  );
}
