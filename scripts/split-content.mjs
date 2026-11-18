// The Playbook is written in one file. For the site it is split so a reader only downloads the stage they open.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const src = new URL('../src/content/playbook.json', import.meta.url);
const out = new URL('../src/content/generated/', import.meta.url);
const playbook = JSON.parse(readFileSync(src, 'utf8'));

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// Every string inside a topic, flattened, so search can look inside topics without loading them all.
const strings = (value) =>
  typeof value === 'string' ? [value] : value && typeof value === 'object' ? Object.values(value).flatMap(strings) : [];
const words = {};

for (const stage of playbook.stages) {
  const bodies = {};
  for (const part of stage.parts) {
    for (const topic of part.topics) {
      bodies[topic.id] = { body: topic.body ?? null, quiz: topic.quiz ?? null };
      const unique = new Set(strings(topic.body).join(' ').replace(/\]\(t:[\d.]+\)/g, ' ').toLowerCase().match(/[a-z0-9][a-z0-9'-]{2,}/g) || []);
      words[topic.id] = [...unique].join(' ');
      delete topic.body;
      delete topic.quiz;
    }
  }
  writeFileSync(new URL(`stage-${stage.n}.json`, out), JSON.stringify(bodies));
}
writeFileSync(new URL('playbook-index.json', out), JSON.stringify(playbook));
writeFileSync(new URL('search-words.json', out), JSON.stringify(words));
console.log('Playbook split into an index and one file per stage.');
