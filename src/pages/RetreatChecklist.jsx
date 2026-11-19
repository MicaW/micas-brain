import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import data from '../content/retreat-checklist.json';
import { stages, topicById } from '../lib.js';

// Ticks stay on this device only. Storage can be missing or blocked, so every read and write is guarded.
const KEY = 'retreat-checklist-v1';
function loadTicks() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}
function saveTicks(ticks) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ticks));
  } catch {
    /* nothing to do: the page still works, it just forgets */
  }
}

export default function RetreatChecklist() {
  const [ticks, setTicks] = useState(loadTicks);
  const [stream, setStream] = useState('All');
  const [essentialOnly, setEssentialOnly] = useState(false);
  useEffect(() => saveTicks(ticks), [ticks]);

  const toggle = (id) => setTicks((t) => ({ ...t, [id]: !t[id] }));
  const clearAll = () => {
    if (window.confirm('Clear every tick on this checklist?')) setTicks({});
  };

  const shown = useMemo(
    () => data.tasks.filter((t) => (stream === 'All' || t.workstream === stream) && (!essentialOnly || t.essential)),
    [stream, essentialOnly],
  );

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
        <p className="lead">{data.lead}</p>
        <p className="rc-note">Your ticks are kept in this browser on this device.</p>
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
          <span className="rc-key-text">do it for every retreat</span>
          <span className="rc-tag opt">Consider</span>
          <span className="rc-key-text">depends on the retreat</span>
        </p>
      </section>

      <div className="rc-phases">
        {data.phases.map((phase, i) => {
          const tasks = shown.filter((t) => t.phase === phase.id);
          if (!tasks.length) return null;
          return (
            <section className="rc-phase" key={phase.id} aria-labelledby={`h-${phase.id}`}>
              <header className="rc-phase-head">
                <span className="sd rc-disc" style={{ background: stages[i % stages.length].color }} aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <p className="rc-when">{phase.when}</p>
                  <h2 id={`h-${phase.id}`} className="rc-h2">
                    {phase.name}
                  </h2>
                </div>
              </header>
              <ul className="rc-list">
                {tasks.map((task) => {
                  const topic = task.topic && topicById(task.topic);
                  const done = !!ticks[task.id];
                  return (
                    <li key={task.id} className={done ? 'rc-task done' : 'rc-task'}>
                      <label className="rc-check">
                        <input type="checkbox" checked={done} onChange={() => toggle(task.id)} />
                        <span className="rc-box" aria-hidden="true" />
                        <span className="rc-text">
                          <span className="rc-title">{task.title}</span>
                          <span className="rc-detail">{task.detail}</span>
                        </span>
                      </label>
                      <div className="rc-meta">
                        <span className={task.essential ? 'rc-tag ess' : 'rc-tag opt'}>{task.essential ? 'Essential' : 'Consider'}</span>
                        <span>Who: {task.owner}</span>
                        <span>{task.workstream}</span>
                        {topic && (
                          <Link className="txt rc-read" to={topic.path}>
                            Read: {topic.title}
                          </Link>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
