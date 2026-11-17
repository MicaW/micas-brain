import { Link } from 'react-router-dom';
import Words from './Words.jsx';
import { stagePath } from '../lib.js';

/* A stage as a colour tile. The whole tile is the link. */
export default function StageTile({ stage, span, first = false }) {
  return (
    <Link className={`tile stage-tile onp ${span} ${first ? 'first r2' : ''}`} to={stagePath(stage.n)} style={{ background: stage.color }}>
      <div className="hd">
        <span className="tile-disc" style={{ color: stage.color }}>
          <span className="sr-only">Stage </span>
          {stage.n}
        </span>
      </div>
      <div className="tile-words">
        <p className="sn">{stage.name}</p>
        <p className={first ? 'q q1' : 'q'}><Words>{stage.question}</Words></p>
        {first && stage.tileNote && <p className="note">{stage.tileNote}</p>}
      </div>
    </Link>
  );
}
