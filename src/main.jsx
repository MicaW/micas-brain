import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter, MemoryRouter } from 'react-router-dom';
import '@fontsource-variable/bricolage-grotesque/opsz.css';
import '@fontsource-variable/hanken-grotesk';
import './styles/tokens.css';
import './styles/app.css';
import './styles/pages.css';
import App from './App.jsx';

// Hash routing works on any static host without server rules.
// VITE_ROUTER=browser gives clean addresses; "memory" is for the single-file preview build.
const routers = { browser: BrowserRouter, memory: MemoryRouter };
const Router = routers[import.meta.env.VITE_ROUTER] ?? HashRouter;

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
);
