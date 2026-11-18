import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { site, stageLabel, stagePath, stages, topics } from '../lib.js';
import { PlusMinus } from './ui.jsx';

const topicsIn = (stage, part) => topics.filter((t) => t.stage.n === stage.n && t.part.title === part.title);

const Grid = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="4" width="6" height="6" />
    <rect x="14" y="4" width="6" height="6" />
    <rect x="4" y="14" width="6" height="6" />
    <rect x="14" y="14" width="6" height="6" />
  </svg>
);
const Cross = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

/* The nine stage discs. One click moves to a stage; the name shows on hover and focus. */
function StageRow({ current }) {
  return (
    <nav className="pp-stages" aria-label="Playbook stages">
      {stages.map((s) => (
        <Link key={s.n} to={stagePath(s.n)} style={{ '--c': s.color }} data-name={s.name} aria-current={s.n === current.n ? 'true' : undefined} aria-label={stageLabel(s)}>
          {s.n}
        </Link>
      ))}
    </nav>
  );
}

/* The directory: every stage, its parts and their topics, side by side. */
function Directory({ stage, topic, onClose }) {
  const [stageN, setStageN] = useState(stage.n);
  const shown = stages.find((s) => s.n === stageN);
  const startPart = topic ? Math.max(0, stage.parts.findIndex((p) => p.title === topic.part.title)) : 0;
  const [partI, setPartI] = useState(startPart);
  const part = shown.parts[Math.min(partI, shown.parts.length - 1)];
  const closeBtn = useRef(null);

  useEffect(() => {
    closeBtn.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="dir" role="dialog" aria-modal="true" aria-label="Directory of the Playbook">
      <button className="pp-round dir-close" type="button" ref={closeBtn} onClick={onClose} aria-label="Close the directory">
        <Cross />
      </button>
      <div className="dir-cols">
        <section aria-labelledby="dir-h-stage">
          <h2 id="dir-h-stage">Stage</h2>
          <ul className="dir-stages">
            {stages.map((s) => (
              <li key={s.n}>
                <button type="button" aria-pressed={s.n === stageN} onClick={() => { setStageN(s.n); setPartI(0); }}>
                  <span className="dir-disc" style={{ background: s.color }}>{s.n}</span>
                  <span className="dir-name">{s.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="dir-h-part">
          <h2 id="dir-h-part">Part</h2>
          <p className="dir-stage-name">{shown.name}</p>
          <ul className="dir-parts">
            {shown.parts.map((p, i) => (
              <li key={p.title}>
                <button type="button" aria-pressed={p === part} onClick={() => setPartI(i)}>
                  {p.title}
                </button>
              </li>
            ))}
          </ul>
          <Link className="txt dir-open" to={stagePath(shown.n)} onClick={onClose}>
            Open {stageLabel(shown)}
          </Link>
        </section>
        <section aria-labelledby="dir-h-topic" style={{ '--stage': shown.color }}>
          <h2 id="dir-h-topic">Topic</h2>
          <ul className="dir-topics">
            {topicsIn(shown, part).map((t) => (
              <li key={t.id}>
                <Link to={t.path} onClick={onClose} aria-current={topic && t.id === topic.id ? 'page' : undefined}>
                  {t.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

/* The Playbook's own panel: where you are, the parts of this stage, and the way to every other stage. */
export default function PlaybookPanel({ stage, topic, open, onClose }) {
  const currentPart = topic ? stage.parts.findIndex((p) => p.title === topic.part.title) : -1;
  const [openParts, setOpenParts] = useState(() => new Set(currentPart >= 0 ? [currentPart] : []));
  const [directory, setDirectory] = useState(false);
  const panel = useRef(null);

  // A new stage starts with only the current part open. Within a stage, the part you move into opens and the rest stay as you left them.
  useEffect(() => setOpenParts(new Set(currentPart >= 0 ? [currentPart] : [])), [stage.n]);
  const bringIntoView = useRef(true);
  useEffect(() => {
    if (currentPart >= 0) setOpenParts((was) => new Set(was).add(currentPart));
    bringIntoView.current = true;
  }, [topic?.id]);
  // Once the current part has opened, make sure the current topic can be seen in the panel.
  useEffect(() => {
    if (!bringIntoView.current) return;
    const here = panel.current?.querySelector('.pp-part [aria-current="page"]');
    if (here) {
      here.scrollIntoView({ block: 'center' });
      bringIntoView.current = false;
    }
  });

  // On a small screen the panel covers the page, so it takes the focus, closes on Escape and stops the page scrolling behind it.
  useEffect(() => {
    if (!open) return undefined;
    panel.current?.querySelector('.pp-close')?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const toggle = (i) =>
    setOpenParts((was) => {
      const next = new Set(was);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <>
      <aside className={open ? 'pp open' : 'pp'} ref={panel} aria-label="Playbook" style={{ '--stage': stage.color }}>
        <div className="pp-top">
          <Link className="wordmark" to="/">
            {site.name}
          </Link>
          <button className="pp-round pp-close" type="button" onClick={onClose} aria-label="Close the Playbook panel">
            <Cross />
          </button>
        </div>
        <StageRow current={stage} />
        <Link className="pp-stage" to={stagePath(stage.n)} aria-current={topic ? undefined : 'page'}>
          <span>Stage {stage.n}</span>
          <strong>{stage.name}</strong>
        </Link>
        <div className="pp-parts">
          {stage.parts.map((part, i) => {
            const isOpen = openParts.has(i);
            return (
              <div className="pp-part" key={part.title}>
                <button type="button" aria-expanded={isOpen} onClick={() => toggle(i)}>
                  <span>{part.title}</span>
                  <PlusMinus size={22} />
                </button>
                {isOpen && (
                  <ul>
                    {topicsIn(stage, part).map((t) => (
                      <li key={t.id}>
                        <Link to={t.path} aria-current={topic && t.id === topic.id ? 'page' : undefined}>
                          {t.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
        <div className="pp-foot">
          <button type="button" onClick={() => setDirectory(true)}>
            <Grid /> Directory
          </button>
        </div>
      </aside>
      {directory && <Directory stage={stage} topic={topic} onClose={() => setDirectory(false)} />}
    </>
  );
}
