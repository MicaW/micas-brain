// The Playbook is written in one file. For the site it is split so a reader only downloads the stage they open.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const src = new URL('../src/content/playbook.json', import.meta.url);
const out = new URL('../src/content/generated/', import.meta.url);
const playbook = JSON.parse(readFileSync(src, 'utf8'));

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

for (const stage of playbook.stages) {
  const bodies = {};
  for (const part of stage.parts) {
    for (const topic of part.topics) {
      bodies[topic.id] = { body: topic.body ?? null, quiz: topic.quiz ?? null };
      delete topic.body;
      delete topic.quiz;
    }
  }
  writeFileSync(new URL(`stage-${stage.n}.json`, out), JSON.stringify(bodies));
}
writeFileSync(new URL('playbook-index.json', out), JSON.stringify(playbook));
console.log('Playbook split into an index and one file per stage.');
