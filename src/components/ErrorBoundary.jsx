import { Component } from 'react';

/* If a page fails to draw, show a way out, not a blank screen. */
export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidUpdate(prev) {
    if (prev.resetKey !== this.props.resetKey && this.state.failed) this.setState({ failed: false });
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section className="detail-head">
        <h1 className="detail-h1">This page did not load</h1>
        <p className="lead">Something went wrong drawing this page. Try the Playbook or the search.</p>
        <p>
          <a className="txt" href="#/playbook">
            Go to the Playbook
          </a>
        </p>
      </section>
    );
  }
}
