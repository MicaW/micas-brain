import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { loadStageText, playbook, stageLabel, stagePath, topicById, topics } from '../lib.js';
import Blocks from '../components/Blocks.jsx';
import { Arrow } from '../components/ui.jsx';
import Words from '../components/Words.jsx';
import NotFound from './NotFound.jsx';

const KEYS = ['situation', 'do', 'why', 'try', 'watch', 'deeper'];

/* The situation and the practice fill the first screen. The reasons, examples and sources follow underneath. */
export default function Topic() {
  const { stage: stageParam, topic: topicSlug } = useParams();
  const topic = topics.find((t) => t.stage.slug === stageParam && t.slug === topicSlug);
  const stageN = topic?.stage.n;
  const [text, setText] = useState({});
  useEffect(() => {
    if (!stageN) return undefined;
    let live = true;
    loadStageText(stageN).then(
      (all) => live && setText((t) => ({ ...t, [stageN]: all })),
      () => live && setText((t) => ({ ...t, [stageN]: 'failed' })),
    );
    return () => {
      live = false;
    };
  }, [stageN]);
  if (!topic) return <NotFound />;

  const { stage } = topic;
  const stageText = text[stage.n];
  const failed = stageText === 'failed';
  const full = stageText && !failed ? stageText[topic.id] : null;
  const body = full?.body;
  const quiz = full?.quiz;
  const parts = playbook.topicFormat.map((part, i) => ({ ...part, key: KEYS[i], content: body ? body[KEYS[i]] : null }));
  const [situation, doThis, ...rest] = parts;
  const inStage = topics.filter((t) => t.stage.n === stage.n);
  const next = inStage[inStage.indexOf(topic) + 1];
  const previous = inStage[inStage.indexOf(topic) - 1];
  const related = (topic.related || []).map(topicById).filter(Boolean);

  return (
    <div style={{ '--stage': stage.color, display: 'contents' }}>
      <section className="stage-top" aria-labelledby="h-topic">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link className="txt" to="/playbook">
            Playbook
          </Link>
          <span className="sep" aria-hidden="true">
            /
          </span>
          <Link className="txt" to={stagePath(stage.n)}>
            {stageLabel(stage)}
          </Link>
          <span className="sep" aria-hidden="true">
            /
          </span>
          <span>{topic.part.title}</span>
        </nav>
        <div className="topic-hero">
          <span className="topic-disc">
            <span className="sr-only">Topic </span>
            {stage.n}.{topic.n}
          </span>
          <div className="topic-words">
            <h1 id="h-topic" className="detail-h1">
              <Words>{topic.title}</Words>
            </h1>
            <p className="lead">{topic.theory}</p>
          </div>
        </div>
      </section>

      {!full && (
        <p className="hurry" role="status">
          {failed ? 'This topic did not load. Check your connection and reload the page.' : 'Loading this topic.'}
        </p>
      )}
      {full && (
      <>
      <div className="g tp-b-top">
        <section className="tile paper prose s5">
          <h2 className="part-h">{situation.name}</h2>
          <Blocks blocks={situation.content} />
        </section>
        <section className="do-tile s7">
          <h2 className="part-h">{doThis.name}</h2>
          <Blocks blocks={doThis.content} />
        </section>
      </div>

      <div>
        <p className="hurry">In a hurry? You can stop here. The reasons, an example and the sources are underneath.</p>
        {rest.map((part) => (
          <section className="tp-row" key={part.key} aria-labelledby={`h-${part.key}`}>
            <div>
              <h2 id={`h-${part.key}`}>{part.name}</h2>
              <p className="status">{part.what}</p>
            </div>
            <div className="prose">
              <Blocks blocks={part.content} />
            </div>
          </section>
        ))}
        {quiz && (
          <section className="tp-row" aria-labelledby="h-quiz">
            <div>
              <h2 id="h-quiz">Test yourself</h2>
              <p className="status">Answer from memory first, then open each one to check.</p>
            </div>
            <div className="prose">
              <Blocks blocks={[{ type: 'quiz', items: quiz }]} />
            </div>
          </section>
        )}
        {related.length > 0 && (
          <section className="tp-row" aria-labelledby="h-related">
            <div>
              <h2 id="h-related">Related topics</h2>
              <p className="status">Where this idea comes up again.</p>
            </div>
            <ul className="related">
              {related.map((r) => (
                <li key={r.id}>
                  <Link to={r.path} style={{ '--stage': r.stage.color }}>
                    <span className="rel-n">
                      {r.stage.n}.{r.n}
                    </span>
                    <span>{r.title}</span>
                    <Arrow size={24} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      </>
      )}

      {previous && (
        <p className="prev-link">
          <Link className="txt" to={previous.path}>
            Previous: {stage.n}.{previous.n} {previous.title}
          </Link>
        </p>
      )}
      {next ? (
        <Link className="nx onp" to={next.path} style={{ '--next': stage.color }}>
          <span className="nx-words">
            <span className="nx-label">Next in {stageLabel(stage)}</span>
            <span className="nx-q">
              <Words>{next.title}</Words>
            </span>
          </span>
          <Arrow size={40} />
        </Link>
      ) : (
        <Link className="nx onp" to={stagePath(stage.n)} style={{ '--next': stage.color }}>
          <span className="nx-words">
            <span className="nx-label">End of this stage</span>
            <span className="nx-q">Back to {stageLabel(stage)}</span>
          </span>
          <Arrow size={40} />
        </Link>
      )}
    </div>
  );
}
