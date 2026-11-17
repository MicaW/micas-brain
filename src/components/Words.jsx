/* Keeps hyphenated words such as "e-learning" on one line, so balanced headings never break at the hyphen. */
export default function Words({ children }) {
  return String(children)
    .split(/(\S+-\S+)/)
    .map((piece, i) => (i % 2 ? <span key={i} style={{ whiteSpace: 'nowrap' }}>{piece}</span> : piece));
}
