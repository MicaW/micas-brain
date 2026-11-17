import { Link } from 'react-router-dom';
import { mechanics } from '../lib.js';
import { Arrow, Pill } from './ui.jsx';

/* Diagrams are drawn as inline SVG in the current text colour, with the stage colour as the one fill. */
const DIAGRAMS = {
  memory: {
    label: 'Three boxes joined by arrows. What people see and hear leads to working memory, which has four slots, which leads to long-term memory.',
    svg: (
      <svg viewBox="0 0 720 220" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="50" width="190" height="120" rx="16" />
        <rect x="265" y="50" width="190" height="120" rx="16" />
        <rect x="529" y="20" width="190" height="180" rx="16" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={283 + i * 40} y="112" width="32" height="40" rx="8" fill="var(--stage)" />
        ))}
        <path d="M199 110h56M245 100l10 10-10 10M463 110h56M509 100l10 10-10 10" />
        <g stroke="none" fill="currentColor" fontFamily="var(--font-sans)" fontSize="15" fontWeight="600" textAnchor="middle">
          <text x="96" y="106">What people</text>
          <text x="96" y="126">see and hear</text>
          <text x="360" y="88">Working memory</text>
          <text x="624" y="106">Long-term</text>
          <text x="624" y="126">memory</text>
        </g>
      </svg>
    ),
  },
};

const External = ({ url, children }) => (
  <a className="txt" href={url} target="_blank" rel="noreferrer">
    {children}
    <span className="sr-only"> (opens in a new tab)</span>
  </a>
);

/* The pieces a topic can be written from: text, steps, a diagram, a study, an example, cards to remember, mechanics, links out. */
function Block({ block }) {
  switch (block.type) {
    case 'p':
      return <p>{block.text}</p>;
    case 'steps':
      return (
        <ol className="steps">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case 'list':
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case 'diagram': {
      const diagram = DIAGRAMS[block.id];
      return (
        <figure className="b-figure">
          <div className="b-scroll" role="img" aria-label={diagram.label} tabIndex={0}>
            {diagram.svg}
          </div>
          <figcaption>{block.caption}</figcaption>
        </figure>
      );
    }
    case 'study':
      return (
        <aside className="b-study" aria-label={`Research: ${block.cite}`}>
          <Pill>The research</Pill>
          <p className="b-cite">
            <strong>{block.cite}</strong> {block.title}
          </p>
          <dl className="kv">
            <dt>What it found</dt>
            <dd>{block.found}</dd>
            <dt>What it means for you</dt>
            <dd>{block.means}</dd>
          </dl>
          {block.url && <External url={block.url}>Read the paper's summary</External>}
        </aside>
      );
    case 'example':
      return (
        <aside className="b-example" aria-label={`Example: ${block.title}`}>
          <Pill>Example</Pill>
          <p className="b-title">{block.title}</p>
          <p>{block.text}</p>
        </aside>
      );
    case 'remember':
      return (
        <div className="b-cards" role="group" aria-label="Worth remembering">
          {block.items.map((card) => (
            <div className="b-card" key={card.title}>
              <p className="b-title">{card.title}</p>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      );
    case 'mechanics':
      return (
        <div className="b-cards two" role="group" aria-label="Learning mechanics behind this">
          {block.slugs.map((slug) => mechanics.find((m) => m.slug === slug)).filter(Boolean).map((m) => (
            <Link className="b-card link" key={m.slug} to={`/playbook/mechanics/${m.slug}`}>
              <Pill>Learning mechanic</Pill>
              <p className="b-title">{m.name}</p>
              <p>{m.description.split('. ')[0].replace(/\.+$/, '')}.</p>
              <Arrow size={24} />
            </Link>
          ))}
        </div>
      );
    case 'links':
      return (
        <ul className="plain-list b-sources">
          {block.items.map((item) => (
            <li key={item.label}>
              <span className="b-source">{item.label}</span>
              <span className="b-check">
                {item.note}
                {item.url && <> <External url={item.url}>Open the source</External></>}
              </span>
            </li>
          ))}
        </ul>
      );
    case 'quiz':
      return (
        <div className="b-quiz">
          {block.items.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export default function Blocks({ blocks }) {
  if (!blocks) return <p className="unwritten">Not written yet.</p>;
  return blocks.map((block, i) => <Block key={i} block={block} />);
}
