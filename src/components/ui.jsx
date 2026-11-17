import { Link } from 'react-router-dom';
import { site, stageByN, stageLabel, stagePath } from '../lib.js';

/* Icons: inline SVG, 1.5 to 1.75px stroke, round caps, in the current text colour. */
export function ArrowSmall() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}
export function Arrow({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 14h18M16 7l7 7-7 7" />
    </svg>
  );
}
/* Plus that becomes a minus: the vertical stroke is hidden when the parent button is expanded. */
export function PlusMinus({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
      <path d="M6 14h16" />
      <path className="v" d="M14 6v16" />
    </svg>
  );
}

export function Pill({ children, className = '' }) {
  return <span className={`pill ${className}`}>{children}</span>;
}

/* Button: dark, lime, or a plain text link. Always a link, because every one on the site navigates. */
export function Button({ to, variant = 'dk', className = '', children }) {
  if (variant === 'text') {
    return (
      <Link className={`txt ${className}`} to={to}>
        {children}
      </Link>
    );
  }
  return (
    <Link className={`btn ${variant} ${className}`} to={to}>
      <span>{children}</span>
      <ArrowSmall />
    </Link>
  );
}

/* Small stage mark used inside lists and cards. Not a link. */
export function StageMark({ n }) {
  const stage = stageByN(n);
  return (
    <span className="rd" style={{ background: stage.color }}>
      <span className="sr-only">Stage </span>
      {n}
    </span>
  );
}

/* Stage disc with the stage's name beside it, for cards where a bare number would read as a count. */
export function StageTag({ n }) {
  const stage = stageByN(n);
  return (
    <span className="stage-tag">
      <StageMark n={n} />
      {stage.name}
    </span>
  );
}

/* Linked stage disc, 48px or 44px. */
export function StageDisc({ stage, small = false, current = false }) {
  return (
    <Link
      className={small ? 'sd sm' : 'sd'}
      to={stagePath(stage.n)}
      style={{ background: stage.color }}
      aria-label={current ? `${stageLabel(stage)}, current` : stageLabel(stage)}
      aria-current={current ? 'page' : undefined}
    >
      {stage.n}
    </Link>
  );
}

/* Evidence rating: letter, five bars, word. An unrated topic shows empty bars and says so. */
export function EvidenceRating({ tier }) {
  const found = site.evidenceTiers.find((t) => t.tier === tier);
  const bars = found ? found.bars : 0;
  return (
    <span className={found ? 'ev' : 'ev unrated'}>
      <span className="sr-only">Evidence rating: </span>
      {found && <b>{found.tier}</b>}
      <span className="bars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((k) => (
          <i key={k} className={k <= bars ? 'f' : undefined} />
        ))}
      </span>
      {found ? found.word : 'Not yet rated'}
    </span>
  );
}

/* A plain trust mark: what a page rests on. No score. */
const TRUST = {
  research: 'Sources checked',
  law: 'Official guidance checked',
  tool: 'Checked against product help',
  craft: 'Practitioner craft',
};
export function TrustMark({ kind, checked = true }) {
  const label = checked ? TRUST[kind] || TRUST.research : 'Not checked yet';
  const ticked = checked && kind !== 'craft';
  return (
    <span className={ticked ? 'ev trust' : 'ev trust plain'}>
      {ticked && (
        <b aria-hidden="true">
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8.5l3.2 3L13 4.5" />
          </svg>
        </b>
      )}
      {label}
    </span>
  );
}
