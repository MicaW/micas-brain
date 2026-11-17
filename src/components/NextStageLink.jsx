import { Link } from 'react-router-dom';
import Words from './Words.jsx';
import { stagePath } from '../lib.js';
import { Arrow } from './ui.jsx';

/* Full-width tile to the next stage, in that stage's colour. */
export default function NextStageLink({ stage, label }) {
  return (
    <Link className="nx onp" to={stagePath(stage.n)} style={{ '--next': stage.color }}>
      <span className="nx-words">
        <span className="nx-label">{label}</span>
        <span className="nx-q"><Words>{stage.question}</Words></span>
      </span>
      <Arrow size={40} />
    </Link>
  );
}
