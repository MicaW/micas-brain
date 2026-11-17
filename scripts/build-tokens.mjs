// Turns src/content/tokens.json into CSS variables for both themes.
// Run with: npm run tokens
import { readFileSync, writeFileSync } from 'node:fs';
const t = JSON.parse(readFileSync(new URL('../src/content/tokens.json', import.meta.url)));
const shared = [];
const themed = Object.fromEntries(t.themes.map((id) => [id, []]));
for (const [name, value] of Object.entries(t.color)) {
  if (typeof value === 'string') shared.push(`  --${name}: ${value};`);
  else for (const id of t.themes) themed[id].push(`  --${name}: ${value[id]};`);
}
for (const [name, value] of Object.entries(t.font)) shared.push(`  --font-${name}: ${value};`);
for (const group of [t.space, t.radius]) for (const [name, value] of Object.entries(group)) shared.push(`  --${name}: ${value};`);
let css = '/* Generated from src/content/tokens.json by scripts/build-tokens.mjs. Do not edit by hand. */\n';
css += `:root {\n${shared.join('\n')}\n}\n`;
for (const id of t.themes) css += `[data-theme="${id}"] {\n${themed[id].join('\n')}\n}\n`;
writeFileSync(new URL('../src/styles/tokens.css', import.meta.url), css);
console.log('tokens.css written');
