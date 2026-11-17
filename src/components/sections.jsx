import home from '../content/home.json';
import { byStage } from '../lib.js';
import AccordionCard, { FindingItem, MistakeItem } from './AccordionCard.jsx';
import CaseCard from './CaseCard.jsx';
import { Pill } from './ui.jsx';

/* The Home sections that also appear on Evidence and Case studies. Lists run in stage order, 1 to 8. */
export function MistakesCard() {
  const { mistakes } = home;
  return (
    <AccordionCard
      pill={mistakes.pill}
      heading={mistakes.heading}
      items={byStage(mistakes.items)}
      regionLabel="Common mistakes, scrollable list"
      renderBody={(item) => <MistakeItem item={item} labels={mistakes.labels} />}
    />
  );
}

export function FindingsCard() {
  const { findings } = home;
  return (
    <AccordionCard
      pill={findings.pill}
      heading={findings.heading}
      link={{ label: findings.guideLink, to: '/evidence/how-we-rate' }}
      items={byStage(findings.items)}
      regionLabel="Evidence findings, scrollable list"
      renderBody={(item) => <FindingItem item={item} labels={findings.labels} />}
    />
  );
}

// "The US Army (after-action review)" becomes a name and what they are known for.
const candidate = (text) => {
  const match = text.match(/^(.*?)\s*\((.*)\)$/);
  return match ? { name: match[1], known: match[2].charAt(0).toUpperCase() + match[2].slice(1) } : { name: text, known: '' };
};

/* Every case study: the drafts as full cards, then the ones still to research. */
export function CaseGrid() {
  const { cases } = home;
  return (
    <div className="g">
      {cases.items.map((item) => (
        <CaseCard key={item.slug} item={item} labels={cases.labels} status={item.status || cases.statusPill} />
      ))}
      {cases.candidatesToResearch.map(candidate).map((item) => (
        <div className="tile cs todo s4" key={item.name}>
          <Pill className="quiet start">{cases.candidatePill}</Pill>
          <div>
            <h3>{item.name}</h3>
            {item.known && <p>{item.known}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
