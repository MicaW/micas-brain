import ErrorBoundary from './components/ErrorBoundary.jsx';
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { mechanics, site, stageByN, stageLabel, topics } from './lib.js';
import SiteFooter from './components/SiteFooter.jsx';
import SiteHeader from './components/SiteHeader.jsx';
import PlaybookPanel from './components/PlaybookPanel.jsx';
import About from './pages/About.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import { OutlinePage } from './pages/Outline.jsx';
import Playbook from './pages/Playbook.jsx';
import Stage from './pages/Stage.jsx';

// The Toolkit and Search carry the largest data, so they load when first opened.
const Search = lazy(() => import('./pages/Search.jsx'));
const toolkitPage = (name) => lazy(() => import('./pages/Toolkit.jsx').then((m) => ({ default: m[name] })));
const MechanicDetail = toolkitPage('MechanicDetail');
const MechanicList = toolkitPage('MechanicList');
const MethodDetail = toolkitPage('MethodDetail');
const MethodFinder = toolkitPage('MethodFinder');
const RecipeDetail = toolkitPage('RecipeDetail');
const RecipeList = toolkitPage('RecipeList');
const Templates = toolkitPage('Templates');
const ToolkitHome = toolkitPage('ToolkitHome');
import Topic from './pages/Topic.jsx';

// Navigation and dashboard pages sit on the dark board. Reading pages sit on the light page.
const BOARD = ['/', '/playbook', '/playbook/mechanics', '/toolkit', '/toolkit/methods', '/toolkit/recipes', '/toolkit/templates'];
const groundFor = (pathname) => (BOARD.includes(pathname) ? 'board' : 'page');
const GROUND_COLOUR = { board: '#0b0b0c', page: '#e9e9e4' };

const TITLES = {
  '/playbook': 'The Playbook', '/toolkit': 'The Toolkit', '/toolkit/methods': 'Method finder', '/playbook/mechanics': 'Learning mechanics',
  '/toolkit/recipes': 'Session recipes', '/toolkit/templates': 'Templates', '/evidence': 'Evidence', '/evidence/how-we-rate': 'What the check marks mean',
  '/evidence/numbers': 'Training today in numbers', '/evidence/studies': 'Key studies', '/evidence/reading': 'Reading list and sources',
  '/case-studies': 'Case studies', '/about': 'About', '/glossary': 'Glossary', '/search': 'Search',
};
// Method and recipe pages set their own title, because their names load with the page.
const ownTitle = (pathname) => /^\/toolkit\/(methods|recipes)\/./.test(pathname);
function titleFor(pathname) {
  const stageMatch = pathname.match(/^\/playbook\/stage-(\d)$/);
  const last = pathname.split('/').pop();
  const name =
    TITLES[pathname] ||
    (stageMatch && stageByN(stageMatch[1]) && stageLabel(stageByN(stageMatch[1]))) ||
    topics.find((t) => t.path === pathname)?.title ||
    (/^\/playbook\/mechanics\//.test(pathname) && mechanics.find((x) => x.slug === last)?.name) ||
    site.outline.find((p) => p.path === pathname)?.title;
  return name ? `${name} · ${site.name}` : site.name;
}

export default function App() {
  const { pathname } = useLocation();
  const ground = groundFor(pathname);
  const main = useRef(null);
  const firstLoad = useRef(true);
  // Inside a stage, the Playbook has its own panel down the left.
  const stageMatch = pathname.match(/^\/playbook\/stage-(\d)(\/|$)/);
  const panelStage = stageMatch ? stageByN(stageMatch[1]) : null;
  const panelTopic = panelStage ? topics.find((t) => t.path === pathname) : null;
  const [panelOpen, setPanelOpen] = useState(false);
  const closePanel = useCallback(() => setPanelOpen(false), []);
  useEffect(() => setPanelOpen(false), [pathname]);

  // The ground, the browser theme colour and the scrollbar follow the page.
  useEffect(() => {
    document.documentElement.dataset.theme = ground;
    document.documentElement.dataset.snap = pathname === '/' ? 'on' : 'off';
    document.querySelector('meta[name="theme-color"]').setAttribute('content', GROUND_COLOUR[ground]);
  }, [ground, pathname]);

  // On each new page: set the title, go to the top, and move focus to the content for keyboard and screen reader users.
  useEffect(() => {
    if (!ownTitle(pathname)) document.title = titleFor(pathname);
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className={panelStage ? 'shell has-panel' : 'shell'}>
      <a className="skip" href="#content" onClick={(e) => { e.preventDefault(); main.current?.focus(); }}>
        Skip to content
      </a>
      <SiteHeader />
      {panelStage && (
        <>
          <PlaybookPanel stage={panelStage} topic={panelTopic} open={panelOpen} onClose={closePanel} />
          <button className="pp-open" type="button" style={{ '--stage': panelStage.color }} aria-expanded={panelOpen} onClick={() => setPanelOpen(true)}>
            <span className="pp-open-disc" aria-hidden="true">{panelStage.n}</span>
            <span className="pp-open-name">{panelTopic ? panelTopic.part.title : panelStage.name}</span>
            <span className="pp-open-word">Contents</span>
          </button>
        </>
      )}
      <main id="content" ref={main} tabIndex={-1} className={pathname === '/' ? 'home' : undefined}>
        <ErrorBoundary resetKey={pathname}>
          <Suspense fallback={<p className="hurry" role="status">Loading.</p>}>
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
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          {site.outline.map((page) => (
            <Route key={page.path} path={page.path} element={<OutlinePage />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <SiteFooter />
    </div>
  );
}
