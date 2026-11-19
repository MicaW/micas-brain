// Copies the BRAIN homepage into the root of the built site and builds its facts.json.
// The Training the Trainer app is built into dist/training/ (see vite.config.js).
import { copyFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
mkdirSync('dist', { recursive: true });
copyFileSync('home/index.html', 'dist/index.html');
console.log('BRAIN homepage copied to dist/index.html');
execFileSync(process.execPath, ['scripts/build-facts.mjs', 'dist/facts.json'], { stdio: 'inherit' });
