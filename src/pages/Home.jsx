import { Link } from 'react-router-dom';
import home from '../content/home.json';
import { stages } from '../lib.js';
import MythStack from '../components/MythStack.jsx';
import { CaseGrid, FindingsCard, MistakesCard } from '../components/sections.jsx';
import { ArrowSmall, Button, Pill, StageDisc } from '../components/ui.jsx';

export default function Home() {
  const { hero, playbookTile, toolkitTile, myths, cases } = home;
  return (
    <>
      <section className="hero" aria-labelledby="h-home">
        <h1 id="h-home" className="hero-h1">
          {hero.h1}
        </h1>
        <p className="lead">{hero.intro}</p>
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

      <section className="g" aria-label="Mistakes and evidence">
        <MistakesCard />
        <FindingsCard />
      </section>

      <MythStack myths={myths} />

      <section className="cases" aria-labelledby="h-cases">
        <h2 id="h-cases" className="h2">
          {cases.heading}
        </h2>
        <CaseGrid />
      </section>
    </>
  );
}
