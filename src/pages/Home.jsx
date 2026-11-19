import { useState } from 'react';
import InsightsFeed from '../components/InsightsFeed.jsx';
import { Link } from 'react-router-dom';
import home from '../content/home.json';
import { stages } from '../lib.js';
import { ArrowSmall, Button, Pill, StageDisc } from '../components/ui.jsx';

export default function Home() {
  // The headline arrives once a visit, not every time you come back to this page.
  const [arrive] = useState(() => {
    try {
      if (sessionStorage.getItem('ttt-arrived')) return false;
      sessionStorage.setItem('ttt-arrived', '1');
    } catch {
      /* No storage: the entrance simply plays. */
    }
    return true;
  });
  const { hero, playbookTile, toolkitTile } = home;
  return (
    <>
      <div className="vp vp-first">
      <section className={arrive ? 'hero arrive' : 'hero'} aria-labelledby="h-home">
        <h1 id="h-home" className="hero-h1">
          {hero.h1}
        </h1>
        {hero.intro && <p className="lead">{hero.intro}</p>}
      </section>

      <section className="g" aria-label="Where to go">
        <div className="tile entry paper onp s7">
          <Pill className="start">{playbookTile.pill}</Pill>
          <div>
            <h2 className="entry-h">{playbookTile.heading}</h2>
            {playbookTile.body && <p className="lead">{playbookTile.body}</p>}
          </div>
          <div className="entry-foot">
            <nav className="stage-nav" aria-label="Playbook stages">
              {stages.map((stage) => (
                <StageDisc key={stage.n} stage={stage} />
              ))}
            </nav>
            <Button to="/playbook">{playbookTile.button}</Button>
          </div>
        </div>
        <div className="tile entry dark s5">
          <Pill className="start">{toolkitTile.pill}</Pill>
          <h2 className="entry-h">{toolkitTile.heading}</h2>
          <nav className="tk-links" aria-label="Toolkit libraries">
            {toolkitTile.links.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
                <ArrowSmall />
              </Link>
            ))}
          </nav>
          <Button variant="lm" className="end" to="/toolkit">
            {toolkitTile.button}
          </Button>
        </div>
      </section>

      </div>

      <InsightsFeed />
    </>
  );
}
