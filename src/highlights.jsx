import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/* Highlights: the reader marks a bold line and it stays marked on this device.
   Kept per topic, by the words of the line, so they survive content being reordered. */
const KEY = 'ttt-highlights';
const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};
const write = (all) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* Private browsing or a full store: the highlight still shows until the page is closed. */
  }
};

const Ctx = createContext(null);

export function Highlights({ topicId, children }) {
  const [all, setAll] = useState(read);
  const toggle = useCallback(
    (words) => {
      setAll((was) => {
        const mine = was[topicId] || [];
        const next = mine.includes(words) ? mine.filter((w) => w !== words) : [...mine, words];
        const now = { ...was, [topicId]: next };
        if (!next.length) delete now[topicId];
        write(now);
        return now;
      });
    },
    [topicId],
  );
  const value = useMemo(() => ({ marked: all[topicId] || [], toggle }), [all, topicId, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/* Inside controls such as the quiz, bold lines stay plain so one control never sits inside another. */
export const NoHighlights = ({ children }) => <Ctx.Provider value={null}>{children}</Ctx.Provider>;

/* A bold lead. Inside a topic it can be highlighted; anywhere else it is plain bold text. */
export function Lead({ children }) {
  const hl = useContext(Ctx);
  if (!hl || typeof children !== 'string') return <strong>{children}</strong>;
  const on = hl.marked.includes(children);
  const press = () => hl.toggle(children);
  return (
    <strong
      className="hl"
      role="button"
      tabIndex={0}
      aria-pressed={on}
      onClick={press}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          press();
        }
      }}
    >
      {children}
    </strong>
  );
}
