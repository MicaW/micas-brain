import { Link } from 'react-router-dom';
import { site } from '../lib.js';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>{site.footer.checked}</span>
      <nav aria-label="About this site">
        {site.footer.links.map((link) => (
          <Link key={link.label} className="txt" to={link.to}>
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
