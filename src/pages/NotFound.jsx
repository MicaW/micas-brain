import { Button, Pill } from '../components/ui.jsx';

export default function NotFound() {
  return (
    <section className="outline" aria-labelledby="h-missing">
      <Pill>Page not found</Pill>
      <h1 id="h-missing">There is no page at this address.</h1>
      <p className="lead">The link may be out of date. Start again from Home or the Playbook.</p>
      <div className="outline-links">
        <Button variant="text" to="/">
          Go to Home
        </Button>
        <Button variant="text" to="/playbook">
          Open the Playbook
        </Button>
      </div>
    </section>
  );
}
