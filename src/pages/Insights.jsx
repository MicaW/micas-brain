import { Link, useParams } from 'react-router-dom';
import insights from '../content/insights.json';
import { Inline } from '../components/Blocks.jsx';
import { ArrowSmall, Pill } from '../components/ui.jsx';
import { Highlights } from '../highlights.jsx';
import { topicLinkLabel, topics } from '../lib.js';
import NotFound from './NotFound.jsx';

const T = (text) => <Inline text={text} />;
const levelOf = (n) => insights.strength.find((s) => s.level === n);
const topicByTitle = (title) => topics.find((t) => t.title === title);

// Reading time from every string in the piece, at about 220 words a minute.
const words = (value) =>
  typeof value === 'string' ? value.split(/\s+/).length : value && typeof value === 'object' ? Object.values(value).reduce((n, v) => n + words(v), 0) : 0;
const minutes = (idea) => Math.max(1, Math.round(words({ ...idea, sources: [] }) / 220));

export const insightBySlug = (slug) => insights.ideas.find((i) => i.slug === slug);

/* Four bars for the strength of the evidence. Craft shows four empty bars and says so in words. */
function Meter({ level }) {
  const s = levelOf(level);
  return (
    <span className={level < 0 ? 'ins-meter no' : 'ins-meter'} title={s.means}>
      <span className="ins-bars" aria-hidden="true">
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={n <= level ? 'on' : undefined} />
        ))}
      </span>
      <span className="ins-word">
        <span className="sr-only">Evidence: </span>
        {s.word}
      </span>
    </span>
  );
}

function Scale() {
  return (
    <dl className="ins-scale">
      {insights.strength.map((s) => (
        <div key={s.level}>
          <dt>
            <Meter level={s.level} />
          </dt>
          <dd>{s.means}</dd>
        </div>
      ))}
    </dl>
  );
}

function TopicLinks({ titles }) {
  const found = titles.map(topicByTitle).filter(Boolean);
  if (!found.length) return null;
  return (
    <ul className="ins-links">
      {found.map((t) => (
        <li key={t.id}>
          <Link className="txt" to={t.path}>
            {topicLinkLabel(t)}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Dashboard({ dash }) {
  const ranked = [...dash.items].sort((a, b) => b.strength - a.strength);
  return (
    <section className="ins-dash" aria-labelledby="h-dash">
      <h2 id="h-dash" className="ins-h2">
        {dash.heading}
      </h2>
      <p className="ins-intro">{dash.intro}</p>
      <div className="ins-overview">
        <div>
          <h3 className="ins-h3">How strong the evidence is</h3>
          <Scale />
        </div>
        <div>
          <h3 className="ins-h3">Ranked by the strength of the research</h3>
          <ol className="ins-rank">
            {ranked.map((item) => (
              <li key={item.name}>
                <span className="ins-rank-name">{item.name}</span>
                <Meter level={item.strength} />
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="ins-cards">
        {dash.items.map((item) => (
          <article className="ins-card" key={item.name}>
            <div className="ins-card-top">
              <h3 className="ins-card-h">{item.name}</h3>
              <Meter level={item.strength} />
            </div>
            <p className="ins-offers">{item.offers}</p>
            <p className="ins-figure">{item.figure}</p>
            <p className="ins-note">{item.note}</p>
            <p className="ins-mind">
              <strong>Bear in mind.</strong> {item.mind}
            </p>
            <TopicLinks titles={item.links} />
          </article>
        ))}
      </div>
    </section>
  );
}

function Compare({ compare }) {
  return (
    <section className="ins-compare" aria-labelledby="h-compare">
      <h2 id="h-compare" className="ins-h2">
        {compare.heading}
      </h2>
      <p className="ins-intro">{compare.intro}</p>
      <div className="ins-table-wrap">
        <table className="ins-table">
          <thead>
            <tr>
              <td />
              {compare.cols.map((c, i) => (
                <th key={c} scope="col" className={i === compare.cols.length - 1 ? 'mark' : undefined}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compare.rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {row.values.map((v, i) => (
                  <td key={i} className={i === row.values.length - 1 ? 'mark' : undefined}>
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function InsightsIndex() {
  return (
    <>
      <section className="detail-head" aria-labelledby="h-insights">
        <h1 id="h-insights" className="detail-h1">
          {insights.heading}
        </h1>
        <p className="lead">{insights.intro}</p>
      </section>
      <section className="ins-list" aria-label="All pieces">
        {insights.ideas.map((idea) => (
          <Link key={idea.slug} className="tile ins-tile" to={`/insights/${idea.slug}`} style={{ background: idea.color }}>
            <span className="ins-tile-meta">
              <Pill>{idea.kind}</Pill>
              <span>
                {idea.date} · {minutes(idea)} min read
              </span>
            </span>
            <h2 className="ins-tile-h">{idea.title}</h2>
            <p>{idea.standfirst}</p>
            <span className="ins-tile-go">
              Read it <ArrowSmall />
            </span>
          </Link>
        ))}
      </section>
      <section className="ins-key" aria-labelledby="h-key">
        <h2 id="h-key" className="ins-h2">
          How the evidence is rated
        </h2>
        <p className="ins-intro">Every piece rates the research behind each claim on the same scale. The rating is about the evidence, not about whether a practice is worth doing.</p>
        <Scale />
      </section>
    </>
  );
}

export function InsightPage() {
  const { slug } = useParams();
  const idea = insightBySlug(slug);
  if (!idea) return <NotFound />;
  const others = insights.ideas.filter((i) => i.slug !== slug);
  return (
    <Highlights topicId={`insight:${idea.slug}`}>
      <article className="ins" style={{ '--ins': idea.color }}>
        <header className="detail-head">
          <p className="detail-meta">
            <Link className="txt" to="/insights">
              Insights
            </Link>
            <Pill>{idea.kind}</Pill>
            <span>{idea.date}</span>
            <span>{minutes(idea)} min read</span>
          </p>
          <h1 className="detail-h1 ins-h1">{idea.title}</h1>
          <p className="lead">{idea.standfirst}</p>
        </header>

        <section className="ins-short" aria-labelledby="h-short">
          <h2 id="h-short" className="ins-h3">
            {idea.short.heading}
          </h2>
          <ul>
            {idea.short.items.map((item) => (
              <li key={item}>{T(item)}</li>
            ))}
          </ul>
        </section>

        <div className="prose ins-body">
          {idea.sections.map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              {s.p.map((p) => (
                <p key={p}>{T(p)}</p>
              ))}
            </section>
          ))}
        </div>

        <Dashboard dash={idea.dashboard} />
        {idea.compare && <Compare compare={idea.compare} />}

        <div className="prose ins-body">
          <section>
            <h2>{idea.mind.heading}</h2>
            <ol className="ins-mind-list">
              {idea.mind.items.map((item) => (
                <li key={item}>{T(item)}</li>
              ))}
            </ol>
          </section>
          <section>
            <h2>{idea.business.heading}</h2>
            {idea.business.p.map((p) => (
              <p key={p}>{T(p)}</p>
            ))}
          </section>
          {idea.watch && (
            <section>
              <h2>{idea.watch.heading}</h2>
              <ul>
                {idea.watch.items.map(([label, when, url]) => (
                  <li key={url}>
                    <a className="txt" href={url} target="_blank" rel="noreferrer">
                      {label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                    . {when}.
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section>
            <h2>Sources</h2>
            <ul className="ins-sources">
              {idea.sources.map(([label, url]) => (
                <li key={url}>
                  <a className="txt" href={url} target="_blank" rel="noreferrer">
                    {label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {others.length > 0 && (
          <nav className="ins-more" aria-label="More insights">
            <h2 className="ins-h3">More insights</h2>
            {others.map((o) => (
              <Link key={o.slug} className="tile ins-tile small" to={`/insights/${o.slug}`} style={{ background: o.color }}>
                <Pill>{o.kind}</Pill>
                <span className="ins-tile-h">{o.title}</span>
                <span className="ins-tile-go">
                  Read it <ArrowSmall />
                </span>
              </Link>
            ))}
          </nav>
        )}
      </article>
    </Highlights>
  );
}
