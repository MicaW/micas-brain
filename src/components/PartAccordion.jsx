import { Link } from 'react-router-dom';
import Words from './Words.jsx';
import { slugify, stagePath } from '../lib.js';
import { Arrow, PlusMinus, TrustMark } from './ui.jsx';

/* A numbered topic row. On hover or focus it fills with the stage colour. */
export function TopicRow({ stage, topic }) {
  return (
    <Link className="st" to={`${stagePath(stage.n)}/${slugify(topic.title)}`}>
      <span className="disc">
        {stage.n}.{topic.n}
      </span>
      <span>
        <span className="sq"><Words>{topic.title}</Words></span>
        <span className="meta">{topic.theory}</span>
      </span>
      <Arrow />
    </Link>
  );
}

/* One part of a stage. Any number of parts can be open at once. */
export default function PartAccordion({ stage, part, number, open, onToggle }) {
  const id = `part-${number}`;
  return (
    <div className="grp">
      <h2>
        <button className="acc" type="button" aria-expanded={open} aria-controls={open ? id : undefined} onClick={onToggle}>
          <span className="pt"><Words>{part.title}</Words></span>
          <PlusMinus />
        </button>
      </h2>
      {open ? (
        <div className="part-body" id={id}>
          {part.topics.map((topic) => (
            <TopicRow key={topic.id} stage={stage} topic={topic} />
          ))}
        </div>
      ) : (
        <p className="sum">{part.summary}</p>
      )}
    </div>
  );
}
