import { Link } from 'react-router-dom';
import { playbook, stages } from '../lib.js';
import { Arrow } from '../components/ui.jsx';
import FormatSteps from '../components/FormatSteps.jsx';
import StageTile from '../components/StageTile.jsx';

// Column spans for the nine tiles, in stage order. The first eight are as on the board; Stage 9 shares the last row with Learning mechanics.
const SPANS = ['s5', 's4', 's3', 's3', 's4', 's3', 's5', 's4', 's7'];

export default function Playbook() {
  const { landing, topicFormat } = playbook;
  return (
    <>
      <section className="pb-head" aria-labelledby="h-playbook">
        <h1 id="h-playbook" className="hero-h1">
          {landing.h1}
        </h1>
        <p className="lead">{landing.intro}</p>
      </section>

      <section className="g" aria-label="The nine stages">
        {stages.map((stage, i) => (
          <StageTile key={stage.n} stage={stage} span={SPANS[i]} first={i === 0} />
        ))}
        <Link className="tile hub-tile dark mech-tile s5" to={landing.mechanics.to}>
          <div>
            <h2>{landing.mechanics.heading}</h2>
            <p>{landing.mechanics.text}</p>
          </div>
          <Arrow />
        </Link>
      </section>

      <FormatSteps heading={landing.formatHeading} hint={landing.formatHint} steps={topicFormat} />
    </>
  );
}
