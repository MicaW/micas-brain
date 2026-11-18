/* The six parts every topic is written in. */
export default function FormatSteps({ heading, steps }) {
  return (
    <section className="fmt" aria-labelledby="h-fmt">
      <div className="split">
        <h2 id="h-fmt" className="h2">
          {heading}
        </h2>
      </div>
      <ul className="g">
        {steps.map((step) => (
          <li className="stp s2" key={step.n}>
            <strong>{step.name}</strong>
            <span>{step.what}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
