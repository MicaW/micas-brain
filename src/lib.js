import playbook from './content/generated/playbook-index.json';
import site from './content/site.json';
import mechanics from './content/toolkit/mechanics.json';
import toolkitRef from './content/toolkit/toolkit-reference.json';

export { playbook, site };

export const stages = playbook.stages;
export const stageByN = (n) => stages.find((s) => s.n === Number(n));

export const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const stagePath = (n) => `/playbook/stage-${n}`;
export const stageLabel = (stage) => `Stage ${stage.n}, ${stage.name}`;

// Every topic, flat, with its stage and its address.
export const topics = stages.flatMap((stage) =>
  stage.parts.flatMap((part) =>
    part.topics.map((topic) => ({
      ...topic,
      stage,
      part,
      slug: slugify(topic.title),
      path: `${stagePath(stage.n)}/${slugify(topic.title)}`,
    })),
  ),
);
export const topicById = (id) => topics.find((t) => t.id === id);

// The full text of a stage's topics is fetched the first time one of them is opened.
const stageFiles = import.meta.glob('./content/generated/stage-*.json');
const loaded = {};
export const loadStageText = (n) =>
  (loaded[n] ??= stageFiles[`./content/generated/stage-${n}.json`]().then((m) => m.default));

// Link labels are built from the topic so they never drift from its title.
export const topicLinkLabel = (topic) => `Stage ${topic.stage.n}: ${topic.title}`;

export const numberWord = (n) => ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'][n] ?? String(n);

// The 13 delivery formats stay hidden unless the build is told to show them.
export const showFormats = import.meta.env.VITE_SHOW_FORMATS === 'true';

// Toolkit data, exported from the toolkit workbook.
// Methods and recipes live in toolkit-data.js so they load only with the Toolkit and Search pages.
export { mechanics, toolkitRef };

// "a; b; c" in the workbook becomes a list.
export const splitList = (text) => String(text || '').split(/;\s*/).map((s) => s.trim()).filter(Boolean);
export const byStage = (items) => [...items].sort((a, b) => a.stage - b.stage);
