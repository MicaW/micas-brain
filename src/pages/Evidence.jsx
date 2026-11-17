import { Link } from 'react-router-dom';
import evidence from '../content/evidence.json';
import home from '../content/home.json';
import { byStage, stageByN, stageLabel, toolkitRef, topicById, topics } from '../lib.js';
import MythStack from '../components/MythStack.jsx';
import { FindingsCard, MistakesCard } from '../components/sections.jsx';
import { Arrow, EvidenceRating } from '../components/ui.jsx';

const PAGES = [
  { to: '/evidence/how-we-rate', title: 'How we rate evidence, A to E', text: 'What each rating means and how to use it.', tone: 'paper', span: 's7' },
  { to: '/evidence/studies', title: 'Key studies', text: 'The studies the site leans on most.', tone: 'dark', span: 's5' },
  { to: '/evidence/numbers', title: 'Training today in numbers', text: 'Every figure used on the site, with its source and whether it has been checked.', tone: 'dark', span: 's5' },
  { to: '/evidence/reading', title: 'Reading list and sources', text: 'The reports and papers behind the checked figures, with links.', tone: 'dark', span: 's4' },
  { to: '/evidence/glossary', title: 'Glossary', text: 'The terms the site uses, in plain words.', tone: 'dark', span: 's3' },
];

export function EvidenceHome() {
  return (
    <>
      <section className="pb-head" aria-labelledby="h-evidence">
        <h1 id="h-evidence" className="hero-h1">
          Evidence
        </h1>
        <p className="lead">What holds up, what does not, and where each claim comes from.</p>
      </section>
      <section className="g" aria-label="Evidence pages">
        {PAGES.map((page) => (
          <Link key={page.to} className={`tile hub-tile ${page.tone} ${page.span} ${page.tone === 'dark' ? '' : 'onp'}`} to={page.to}>
            <div>
              <h2>{page.title}</h2>
              <p>{page.text}</p>
            </div>
            <Arrow />
          </Link>
        ))}
      </section>
      <section className="g" aria-label="Mistakes and evidence">
        <MistakesCard />
        <FindingsCard />
      </section>
      <MythStack myths={home.myths} />
    </>
  );
}

function Head({ title, lead }) {
  return (
    <section className="detail-head" aria-labelledby="h-detail">
      <nav className="crumb" aria-label="Breadcrumb">
        <Link className="txt" to="/evidence">
          Evidence
        </Link>
      </nav>
      <h1 id="h-detail" className="detail-h1">
        {title}
      </h1>
      <p className="lead">{lead}</p>
    </section>
  );
}

export function HowWeRate() {
  return (
    <>
      <Head title="How we rate evidence, A to E" lead="Practices on the site carry a rating from A to E. It is shown as a letter, five bars and a word, never as a colour, so it reads the same for everyone." />
      <div>
        {toolkitRef.evidenceGuide.map((tier) => (
          <div className="tier-row" key={tier.tier}>
            <EvidenceRating tier={tier.tier} />
            <div>
              <h2 className="sr-only">
                {tier.tier}, {tier.word}
              </h2>
              <p className="tier-meaning">{tier.meaning}</p>
              <p>{tier.use}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="status">Ratings on the site are provisional until each topic is written and its citations have been opened and read.</p>
    </>
  );
}

export function Numbers() {
  return (
    <>
      <Head title="Training today in numbers" lead="Each figure with its source. Figures were checked on 17 November 2026 unless a line says otherwise." />
      <div>
        {evidence.numbers.map((row) => (
          <div className="num-row" key={row.figure + row.what}>
            <span className="num-fig">{row.figure}</span>
            <div>
              <p>{row.what}</p>
              <p className="status">
                {row.source}. {row.checked ? 'Checked.' : 'Not yet verified against the report. Do not quote it.'} Used in {stageLabel(stageByN(row.stage))}.
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const checkedSources = topics.flatMap((topic) =>
  ((topic.body && topic.body.deeper) || [])
    .filter((block) => block.type === 'links')
    .flatMap((block) => block.items.filter((item) => item.url).map((item) => ({ label: item.label, topic }))),
);

export function Studies() {
  const rows = byStage(home.findings.items);
  return (
    <>
      <Head title="Key studies" lead="The studies behind the findings on Home. Each links to the topic where it is used." />
      <p className="status">{home.findings.status}</p>
      <ul className="lib-list">
        {rows.map((row) => {
          const topic = topicById(row.topicId);
          return (
            <li key={row.title}>
              <Link className="lib-row" to={topic.path}>
                <span>
                  <span className="lib-name">{row.source.replace(/\.$/, '')}</span>
                  <span className="meta">
                    {row.title} {stageLabel(stageByN(row.stage))}.
                  </span>
                </span>
                <EvidenceRating tier={row.tier} />
                <Arrow />
              </Link>
            </li>
          );
        })}
      </ul>
      <h2 className="sub-h">Sources checked for the Playbook</h2>
      <p className="status">Each paper's published summary was read and supports the topic that cites it. The full papers have not been read.</p>
      <ul className="lib-list">
        {checkedSources.map((row) => (
          <li key={row.label + row.topic.id}>
            <Link className="lib-row" to={row.topic.path}>
              <span>
                <span className="lib-name">{row.label.replace(/\.$/, '')}</span>
                <span className="meta">
                  Used in {row.topic.stage.n}.{row.topic.n} {row.topic.title}.
                </span>
              </span>
              <span />
              <Arrow />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export function Reading() {
  return (
    <>
      <Head title="Reading list and sources" lead="The reports and papers behind the checked figures and corrections. Each link opens the source." />
      <div className="prose">
        <ul className="plain-list">
          {evidence.sources.map((source) => (
            <li key={source.url}>
              <strong>{source.label}</strong>
              <a className="txt" href={source.url} target="_blank" rel="noreferrer">
                Open the source<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <h2 className="sub-h">Where to start, by stage</h2>
      <p className="status">Books and papers the curriculum outline recommends. None has been opened and checked for this site.</p>
      <div className="prose">
        {evidence.reading.map((group) => (
          <div key={group.stage}>
            <p>
              <strong>{stageLabel(stageByN(group.stage))}</strong>
            </p>
            <ul>
              {group.items.map((item) => (
                <li key={item.label || item}>
                  {item.url ? (
                    <a className="txt" href={item.url} target="_blank" rel="noreferrer">
                      {item.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    item.label || item
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
