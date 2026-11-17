import { useEffect, useState } from 'react';
import Words from '../components/Words.jsx';
import { Link, useParams } from 'react-router-dom';
import { playbook, stageByN, stageLabel, stages } from '../lib.js';
import NextStageLink from '../components/NextStageLink.jsx';
import PartAccordion from '../components/PartAccordion.jsx';
import { StageDisc } from '../components/ui.jsx';
import NotFound from './NotFound.jsx';

/* One template for every stage. The stage colour is set once as --stage. */
export default function Stage() {
  const { stage: stageParam } = useParams();
  const stage = stageByN(String(stageParam).replace('stage-', ''));
  const partCount = stage ? stage.parts.length : 0;
  // A stage with a single part opens it straight away: there is nothing to choose between.
  const [open, setOpen] = useState(() => Array(partCount).fill(true));
  useEffect(() => setOpen(Array(partCount).fill(true)), [stageParam, partCount]);

  if (!stage) return <NotFound />;

  const copy = playbook.stagePage;
  const next = stages[stage.n % stages.length];
  const allOpen = open.every(Boolean);
  const rated = stage.parts.some((part) => part.topics.some((topic) => topic.tier));
  const draftWording = stage.wordingStatus.startsWith('Draft');
  const toggle = (i) => setOpen((was) => was.map((value, k) => (k === i ? !value : value)));

  return (
    <div className="stage-page" style={{ '--stage': stage.color, display: 'contents' }}>
      <section className="stage-top" aria-labelledby="h-stage">
        <div className="stage-bar">
          <nav className="crumb" aria-label="Breadcrumb">
            <Link className="txt" to="/playbook">
              Playbook
            </Link>
            <span className="sep" aria-hidden="true">
              /
            </span>
            <span aria-current="page">{stageLabel(stage)}</span>
          </nav>
          <nav className="stage-nav" aria-label="Playbook stages">
            {stages.map((s) => (
              <StageDisc key={s.n} stage={s} small current={s.n === stage.n} />
            ))}
          </nav>
        </div>
        <div className="stage-hero">
          <span className="big-disc" aria-hidden="true">
            {stage.n}
          </span>
          <div className="stage-words">
            <h1 id="h-stage" className="stage-h1">
              <Words>{stage.question}</Words>
            </h1>
            <div className="stage-intro">
              {stage.intro && <p className="lead">{stage.intro}</p>}
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Topics in this stage">
        {partCount > 1 && (
          <div className="split parts-head">
            <p className="parts-hint">{copy.partsHint}</p>
            <button className="all" type="button" onClick={() => setOpen(Array(partCount).fill(!allOpen))}>
              {allOpen ? copy.closeAll : copy.openAll}
            </button>
          </div>
        )}
        {stage.parts.map((part, i) => (
          <PartAccordion key={part.title} stage={stage} part={part} number={i + 1} open={Boolean(open[i])} onToggle={() => toggle(i)} />
        ))}
      </section>


      <NextStageLink stage={next} label={`${next.n === 1 ? 'Back to the start' : 'Next'}: ${stageLabel(next)}`} />
    </div>
  );
}
