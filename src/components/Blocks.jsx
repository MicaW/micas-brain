import { Link } from 'react-router-dom';
import { Lead } from '../highlights.jsx';
import { mechanics, topicByNumber } from '../lib.js';
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

/* Topic text carries two marks: **a bold lead** and [linked words](t:9.34) that open another topic in a new tab. */
const MARK = /\*\*(.+?)\*\*|\[([^\]]+)\]\(t:(\d\.\d{1,2})\)/g;
export function Inline({ text }) {
  if (typeof text !== 'string' || (!text.includes('**') && !text.includes('](t:'))) return text;
  const out = [];
  let last = 0;
  for (const m of text.matchAll(MARK)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<Lead key={m.index}>{m[1]}</Lead>);
    else {
      const topic = topicByNumber(m[3]);
      out.push(
        topic ? (
          <a key={m.index} className="txt" href={`#${topic.path}`} target="_blank" rel="noopener">
            {m[2]}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          m[2]
        ),
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
const T = (text) => <Inline text={text} />;

/* The pieces a topic can be written from: text, steps, a diagram, a study, an example, cards to remember, mechanics, links out. */
function Block({ block }) {
  switch (block.type) {
    case 'p':
      return <p>{T(block.text)}</p>;
    case 'steps':
      return (
        <ol className="steps">
          {block.items.map((item) => (
            <li key={item}>
              <span className="step-t">{T(item)}</span>
            </li>
          ))}
        </ol>
      );
    case 'list':
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{T(item)}</li>
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
            <dd>{T(block.found)}</dd>
            <dt>What it means for you</dt>
            <dd>{T(block.means)}</dd>
          </dl>
          {block.url && <External url={block.url}>Read the paper's summary</External>}
        </aside>
      );
    case 'example':
      return (
        <aside className="b-example" aria-label={`Example: ${block.title}`}>
          <Pill>Example</Pill>
          <p className="b-title">{block.title}</p>
          <p>{T(block.text)}</p>
        </aside>
      );
    case 'artefact':
      return (
        <figure className="b-artefact" aria-label={block.title}>
          <figcaption>
            <Pill>Worked example</Pill>
            <span className="b-title">{block.title}</span>
          </figcaption>
          {block.table && (
            <div className="b-scroll" tabIndex={0}>
              <table>
                <thead>
                  <tr>
                    {block.table.head.map((cell) => (
                      <th key={cell} scope="col">
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.table.rows.map((row, r) => (
                    <tr key={r}>
                      {row.map((cell, c) => (
                        <td key={c} data-label={block.table.head[c]}>
                          {T(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {block.lines && (
            <ul className="b-lines">
              {block.lines.map((line) => (
                <li key={line}>{T(line)}</li>
              ))}
            </ul>
          )}
        </figure>
      );
    case 'remember':
      return (
        <div className="b-cards" role="group" aria-label="Worth remembering">
          {block.items.map((card) => (
            <div className="b-card" key={card.title}>
              <p className="b-title">{card.title}</p>
              <p>{T(card.text)}</p>
            </div>
          ))}
        </div>
      );
    case 'mechanics': {
      const found = block.slugs.map((slug) => mechanics.find((m) => m.slug === slug)).filter(Boolean);
      if (!found.length) return null;
      return (
        <div className="b-mech">
          <p className="b-mech-h">Learning mechanics behind this</p>
          <ul className="b-mech-list">
            {found.map((m) => (
              <li key={m.slug}>
                <a className="pill mech-pill" href={`#/playbook/mechanics/${m.slug}`} target="_blank" rel="noopener">
                  {m.name}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    case 'links':
      return (
        <ul className="plain-list b-sources">
          {block.items.map((item) => (
            <li key={item.label}>
              <span className="b-source">{item.label}</span>
              <span className="b-check">{item.url ? <External url={item.url}>Open the source</External> : item.note}</span>
            </li>
          ))}
        </ul>
      );
    case 'quiz':
      return (
        <div className="b-quiz">
          {block.items.map((item) => (
            <details key={item.q}>
              <summary>{T(item.q)}</summary>
              <p>{T(item.a)}</p>
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
