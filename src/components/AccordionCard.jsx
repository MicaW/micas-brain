import { useId, useState } from 'react';
import Words from './Words.jsx';
import { Link } from 'react-router-dom';
import { topicById, topicLinkLabel } from '../lib.js';
import { Button, EvidenceRating, Pill, PlusMinus, StageTag } from './ui.jsx';

/* A dark card holding a long list as accordions inside a scroll area, grouped by stage.
   One item open at a time; the first is open on load; clicking the open one closes it. */
export default function AccordionCard({ pill, heading, link, items, regionLabel, renderBody }) {
  const [open, setOpen] = useState(0);
  const base = useId();
  return (
    <div className="tile dark card s6">
      <div className="card-top">
        <Pill>{pill}</Pill>
        {link && (
          <Button variant="text" to={link.to}>
            {link.label}
          </Button>
        )}
      </div>
      <h2 className="card-h">{heading}</h2>
      <div className="scr" tabIndex={0} role="region" aria-label={regionLabel}>
        {items.map((item, i) => {
          const isOpen = i === open;
          const newStage = i === 0 || items[i - 1].stage !== item.stage;
          return (
            <div className="ac" key={item.title}>
              {newStage && (
                <p className="ac-stage">
                  <StageTag n={item.stage} />
                </p>
              )}
              <h3>
                <button className="ab" type="button" aria-expanded={isOpen} aria-controls={isOpen ? `${base}-${i}` : undefined} onClick={() => setOpen(isOpen ? -1 : i)}>
                  <span className="an"><Words>{item.title}</Words></span>
                  <PlusMinus size={24} />
                </button>
              </h3>
              {isOpen && (
                <div className="ad" id={`${base}-${i}`}>
                  {renderBody(item)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopicLink({ topicId }) {
  const topic = topicById(topicId);
  if (!topic) return null;
  return (
    <Link className="txt" to={topic.path}>
      {topicLinkLabel(topic)}
    </Link>
  );
}

export function MistakeItem({ item, labels }) {
  return (
    <>
      <p>
        <strong>{labels.why}</strong> {item.why}
      </p>
      <p>
        <strong>{labels.instead}</strong> {item.instead}
      </p>
      <TopicLink topicId={item.topicId} />
    </>
  );
}

export function FindingItem({ item, labels }) {
  return (
    <>
      <p>
        <EvidenceRating tier={item.tier} />
      </p>
      <p>
        <strong>{labels.use}</strong> {item.use}
      </p>
      <p className="src">{item.source}</p>
      <TopicLink topicId={item.topicId} />
    </>
  );
}
