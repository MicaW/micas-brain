import { InsightsGrid } from '../pages/Insights.jsx';
import { Pill } from './ui.jsx';

/* The home page feed: every Insight, newest first. */
export default function InsightsFeed() {
  return (
    <section className="feed vp" aria-labelledby="h-feed">
      <div className="feed-head">
        <Pill className="start">Insights</Pill>
        <h2 id="h-feed" className="h2">
          Latest research and ideas
        </h2>
      </div>
      <InsightsGrid />
    </section>
  );
}
