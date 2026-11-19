import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import retreatClient from '../content/checklists/retreat-client.json';
import retreatProduct from '../content/checklists/retreat-product.json';
import courseClient from '../content/checklists/course-client.json';
import courseProduct from '../content/checklists/course-product.json';
import { stages, topicById } from '../lib.js';
import NotFound from './NotFound.jsx';

export const CHECKLISTS = [retreatClient, retreatProduct, courseClient, courseProduct];
export const checklistPath = (slug) => `/toolkit/templates/checklists/${slug}`;

// Ticks stay on this device only. Storage can be missing or blocked, so every read and write is guarded.
// v3: each checklist keeps its own ticks, and the cards changed again.
const keyFor = (slug) => `checklist-${slug}-v3`;
function loadTicks(slug) {
  try {
    return JSON.parse(localStorage.getItem(keyFor(slug)) || '{}');
  } catch {
    return {};
  }
}
function saveTicks(slug, ticks) {
  try {
    localStorage.setItem(keyFor(slug), JSON.stringify(ticks));
  } catch {
    /* the page still works, it just forgets */
  }
}

function Card({ task, ticks, toggle, open, setOpen }) {
  const done = !!ticks[task.id];
  const topics = task.topics.map(topicById).filter(Boolean);
  const bodyId = `rc-body-${task.id}`;
  return (
    <li className={done ? 'rc-task done' : 'rc-task'}>
      <div className="rc-row">
        <label className="rc-check">
          <input type="checkbox" checked={done} onChange={() => toggle(task.id)} />
          <span className="rc-box" aria-hidden="true" />
          <span className="rc-text">
            <span className="rc-title">{task.title}</span>
            <span className="rc-detail">{task.why}</span>
          </span>
        </label>
        <div className="rc-meta">
          {task.checkpoint && <span className="rc-tag chk">Checkpoint</span>}
          <span className={task.essential ? 'rc-tag ess' : 'rc-tag opt'}>{task.essential ? 'Essential' : 'Consider'}</span>
          <span>Who: {task.owner}</span>
          <span>{task.workstream}</span>
          <button type="button" className="rc-more" aria-expanded={open} aria-controls={bodyId} onClick={() => setOpen(!open)}>
            {open ? 'Close card' : 'Open card'}
          </button>
        </div>
      </div>
      <div id={bodyId} className={open ? 'rc-body' : 'rc-body shut'}>
        <div>
          <h4 className="rc-h4">Steps</h4>
          <ul className="rc-steps">
            {task.steps.map((step, i) => {
              const key = `${task.id}:${i}`;
              return (
                <li key={key}>
                  <label className="rc-step">
                    <input type="checkbox" checked={!!ticks[key]} onChange={() => toggle(key)} />
                    <span className="rc-box sm" aria-hidden="true" />
                    <span className={ticks[key] ? 'rc-step-text done' : 'rc-step-text'}>{step}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
        <dl className="rc-facts">
          <dt>Done when</dt>
          <dd>{task.done}</dd>
          {task.deliverable && (
            <>
              <dt>Makes</dt>
              <dd>
                {task.deliverable}
                {task.where && <span className="rc-where">, in {task.where}</span>}
              </dd>
            </>
          )}
          {task.tools.length > 0 && (
            <>
              <dt>Tools</dt>
              <dd>{task.tools.join(', ')}</dd>
            </>
          )}
          {topics.length > 0 && (
            <>
              <dt>Read</dt>
              <dd className="rc-reads">
                {topics.map((t) => (
                  <Link key={t.id} className="txt" to={t.path}>
                    {t.title}
                  </Link>
                ))}
              </dd>
            </>
          )}
        </dl>
      </div>
    </li>
  );
}

export default function PlanningChecklist({ slug: fixedSlug }) {
  const params = useParams();
  const data = CHECKLISTS.find((c) => c.slug === (fixedSlug || params.slug));
  if (!data) return <NotFound />;
  return <Checklist key={data.slug} data={data} />;
}

function Checklist({ data }) {
  const [ticks, setTicks] = useState(() => loadTicks(data.slug));
  const [stream, setStream] = useState('All');
  const [essentialOnly, setEssentialOnly] = useState(false);
  const [checkpointsOnly, setCheckpointsOnly] = useState(false);
  const [opened, setOpened] = useState({});
  useEffect(() => saveTicks(data.slug, ticks), [data.slug, ticks]);

  const toggle = (id) => setTicks((t) => ({ ...t, [id]: !t[id] }));
  const clearAll = () => {
    if (window.confirm('Clear every tick on this checklist?')) setTicks({});
  };
  const allOpen = data.tasks.every((t) => opened[t.id]);
  const openAll = () => setOpened(allOpen ? {} : Object.fromEntries(data.tasks.map((t) => [t.id, true])));

  const shown = useMemo(
    () =>
      data.tasks.filter(
        (t) => (stream === 'All' || t.workstream === stream) && (!essentialOnly || t.essential) && (!checkpointsOnly || t.checkpoint),
      ),
    [data, stream, essentialOnly, checkpointsOnly],
  );

  // What a retreat produces, grouped by the folder it lives in.
  const byFolder = data.folders
    .map((folder) => ({ folder, items: [...new Set(data.tasks.filter((t) => t.where === folder).map((t) => t.deliverable))] }))
    .filter((g) => g.items.length);

  return (
    <>
      <section className="detail-head" aria-labelledby="h-detail">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link className="txt" to="/toolkit">
            Toolkit
          </Link>
          <span aria-hidden="true"> / </span>
          <Link className="txt" to="/toolkit/templates">
            Templates
          </Link>
        </nav>
        <h1 id="h-detail" className="detail-h1">
          {data.title}
        </h1>
        <nav className="rc-switch" aria-label="Other planning checklists">
          {CHECKLISTS.map((c) => (
            <Link key={c.slug} className="chip" to={checklistPath(c.slug)} aria-current={c.slug === data.slug ? 'page' : undefined}>
              {c.short}
            </Link>
          ))}
        </nav>
        <p className="lead">{data.lead}</p>
        <p className="rc-note">Your ticks are kept in this browser on this device. Print shows the cards you have open, so open all cards first for the full version.</p>
        <div className="rc-tools" role="group" aria-label="Filter the checklist">
          <div className="rc-chips">
            {['All', ...data.workstreams].map((w) => (
              <button key={w} type="button" className="chip" aria-pressed={stream === w} onClick={() => setStream(w)}>
                {w}
              </button>
            ))}
          </div>
          <div className="rc-actions">
            <button type="button" className="chip" aria-pressed={essentialOnly} onClick={() => setEssentialOnly((v) => !v)}>
              Essentials only
            </button>
            <button type="button" className="chip" aria-pressed={checkpointsOnly} onClick={() => setCheckpointsOnly((v) => !v)}>
              Checkpoints only
            </button>
            <button type="button" className="chip" onClick={openAll}>
              {allOpen ? 'Close all cards' : 'Open all cards'}
            </button>
            <button type="button" className="chip" onClick={() => window.print()}>
              Print
            </button>
            <button type="button" className="rc-clear" onClick={clearAll}>
              Clear ticks
            </button>
          </div>
        </div>
        <p className="rc-key" aria-label="Key">
          <span className="rc-tag ess">Essential</span>
          <span className="rc-key-text">do it every time</span>
          <span className="rc-tag opt">Consider</span>
          <span className="rc-key-text">depends on the event</span>
          <span className="rc-tag chk">Checkpoint</span>
          <span className="rc-key-text">a sign-off or decision before you move on</span>
        </p>
      </section>

      <div className="rc-phases">
        {data.phases.map((phase, i) => {
          const tasks = shown.filter((t) => t.phase === phase.id);
          if (!tasks.length) return null;
          const setup = phase.id === 'setup';
          return (
            <section className={setup ? 'rc-phase setup' : 'rc-phase'} key={phase.id} aria-labelledby={`h-${phase.id}`}>
              <header className="rc-phase-head">
                <span className="sd rc-disc" style={{ background: setup ? 'var(--surface-2)' : stages[(i - 1) % stages.length].color }} aria-hidden="true">
                  {i}
                </span>
                <div>
                  <p className="rc-when">{phase.when}</p>
                  <h2 id={`h-${phase.id}`} className="rc-h2">
                    {phase.name}
                  </h2>
                  {phase.note && <p className="rc-phase-note">{phase.note}</p>}
                </div>
              </header>
              <ul className="rc-list">
                {tasks.map((task) => (
                  <Card key={task.id} task={task} ticks={ticks} toggle={toggle} open={!!opened[task.id]} setOpen={(v) => setOpened((o) => ({ ...o, [task.id]: v }))} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <section className="rc-deliverables" aria-labelledby="h-deliv">
        <h2 id="h-deliv" className="rc-h2">
          What you end up with, and where it lives
        </h2>
        <p className="rc-phase-note">One shared folder for each event, with these numbered folders inside. Keep the restricted folder to yourself.</p>
        <div className="rc-folders">
          {byFolder.map(({ folder, items }) => (
            <div key={folder} className="rc-folder">
              <h3 className="rc-folder-h">{folder}</h3>
              <ul>
                {items.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
