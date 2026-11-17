import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { site } from '../lib.js';

export default function SiteHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isCurrent = (to) => (to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`));

  // The small-screen menu closes whenever the page changes.
  useEffect(() => setOpen(false), [pathname]);

  const onSearch = (event) => {
    event.preventDefault();
    const q = new FormData(event.currentTarget).get('q').trim();
    setOpen(false);
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  return (
    <header className={open ? 'site-header open' : 'site-header'}>
      <Link className="wordmark" to="/">
        {site.name}
      </Link>
      <button className="menu-btn" type="button" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(!open)}>
        {open ? 'Close' : 'Menu'}
      </button>
      <nav className="nav" id="site-menu" aria-label="Main">
        {site.nav.map((item) => (
          <Link key={item.to} to={item.to} aria-current={isCurrent(item.to) ? 'page' : undefined}>
            {item.label}
          </Link>
        ))}
      </nav>
      <form className="search" role="search" onSubmit={onSearch}>
        <label className="sr-only" htmlFor="site-search">
          {site.searchLabel}
        </label>
        <input id="site-search" name="q" type="search" placeholder={site.searchPlaceholder} autoComplete="off" />
      </form>
    </header>
  );
}
