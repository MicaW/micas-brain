import { useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { mechanics, methods, recipes, site, stageByN, stageLabel, topics } from './lib.js';
import SiteFooter from './components/SiteFooter.jsx';
import SiteHeader from './components/SiteHeader.jsx';
import About from './pages/About.jsx';
import { CaseDetail, CaseIndex } from './pages/Cases.jsx';
import { EvidenceHome, HowWeRate, Numbers, Reading, Studies } from './pages/Evidence.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import { OutlinePage } from './pages/Outline.jsx';
import Playbook from './pages/Playbook.jsx';
import Search from './pages/Search.jsx';
import Stage from './pages/Stage.jsx';
import { MechanicDetail, MechanicList, MethodDetail, MethodFinder, RecipeDetail, RecipeList, Templates, ToolkitHome } from './pages/Toolkit.jsx';
import Topic from './pages/Topic.jsx';

// Navigation and dashboard pages sit on the dark board. Reading pages sit on the light page.
const BOARD = ['/', '/playbook', '/playbook/mechanics', '/toolkit', '/toolkit/methods', '/toolkit/recipes', '/evidence', '/case-studies'];
const groundFor = (pathname) => (BOARD.includes(pathname) ? 'board' : 'page');
const GROUND_COLOUR = { board: '#0b0b0c', page: '#e9e9e4' };

const TITLES = {
  '/playbook': 'The Playbook', '/toolkit': 'The Toolkit', '/toolkit/methods': 'Method finder', '/playbook/mechanics': 'Learning mechanics',
  '/toolkit/recipes': 'Session recipes', '/toolkit/templates': 'Templates', '/evidence': 'Evidence', '/evidence/how-we-rate': 'What the check marks mean',
  '/evidence/numbers': 'Training today in numbers', '/evidence/studies': 'Key studies', '/evidence/reading': 'Reading list and sources',
  '/case-studies': 'Case studies', '/about': 'About', '/glossary': 'Glossary', '/search': 'Search',
};
function titleFor(pathname) {
  const stageMatch = pathname.match(/^\/playbook\/stage-(\d)$/);
  const last = pathname.split('/').pop();
  const name =
    TITLES[pathname] ||
    (stageMatch && stageByN(stageMatch[1]) && stageLabel(stageByN(stageMatch[1]))) ||
    topics.find((t) => t.path === pathname)?.title ||
    (/^\/(toolkit|playbook\/mechanics)\//.test(pathname) && [...methods, ...mechanics, ...recipes].find((x) => x.slug === last)?.name) ||
    site.outline.find((p) => p.path === pathname)?.title;
  return name ? `${name} · ${site.name}` : site.name;
}

export default function App() {
  const { pathname } = useLocation();
  const ground = groundFor(pathname);
  const main = useRef(null);
  const firstLoad = useRef(true);

  // The ground, the browser theme colour and the scrollbar follow the page.
  useEffect(() => {
    document.documentElement.dataset.theme = ground;
    document.querySelector('meta[name="theme-color"]').setAttribute('content', GROUND_COLOUR[ground]);
  }, [ground]);

  // On each new page: set the title, go to the top, and move focus to the content for keyboard and screen reader users.
  useEffect(() => {
    document.title = titleFor(pathname);
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="shell">
      <a className="skip" href="#content" onClick={(e) => { e.preventDefault(); main.current?.focus(); }}>
        Skip to content
      </a>
      <SiteHeader />
      <main id="content" ref={main} tabIndex={-1} className={pathname === '/' ? 'home' : undefined}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playbook" element={<Playbook />} />
          <Route path="/playbook/mechanics" element={<MechanicList />} />
          <Route path="/playbook/mechanics/:slug" element={<MechanicDetail />} />
          <Route path="/playbook/:stage" element={<Stage />} />
          <Route path="/playbook/:stage/:topic" element={<Topic />} />
          <Route path="/toolkit" element={<ToolkitHome />} />
          <Route path="/toolkit/methods" element={<MethodFinder />} />
          <Route path="/toolkit/methods/:slug" element={<MethodDetail />} />
          <Route path="/toolkit/recipes" element={<RecipeList />} />
          <Route path="/toolkit/recipes/:slug" element={<RecipeDetail />} />
          <Route path="/toolkit/templates" element={<Templates />} />
          <Route path="/evidence" element={<EvidenceHome />} />
          <Route path="/evidence/how-we-rate" element={<HowWeRate />} />
          <Route path="/evidence/numbers" element={<Numbers />} />
          <Route path="/evidence/studies" element={<Studies />} />
          <Route path="/evidence/reading" element={<Reading />} />
          <Route path="/case-studies" element={<CaseIndex />} />
          <Route path="/case-studies/:slug" element={<CaseDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/learning-log" element={<About />} />
          <Route path="/search" element={<Search />} />
          {site.outline.map((page) => (
            <Route key={page.path} path={page.path} element={<OutlinePage />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
}
