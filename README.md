# Training the Trainer

A personal handbook on the science of learning and how to deliver training. It is written practice first: each topic says what to do, then why it works and where that comes from.

Live site: https://micaw.github.io/micas-brain/training/

This repository also holds **BRAIN**, the homepage at https://micaw.github.io/micas-brain/. It links out to each hyperfixation (Training, AI Ethics, Facilitation) and shows a Brain nugget of the day drawn from the Training content.

- `home/index.html` is the BRAIN homepage, one self-contained file.
- `scripts/build-facts.mjs` builds `facts.json` for the Brain nugget of the day from findings, myths, mistakes, learning mechanics, case studies and Insights. Facts from other sites can be added by hand in `home/facts-extra.json` (an array of `{ kind, site, title, body, source, href }`).
- The Training app builds into `dist/training/`; `scripts/add-home.mjs` then copies the homepage and facts into `dist/`.
- Old Training links (`/micas-brain/#/...`) are forwarded to `/micas-brain/training/#/...`.

Built with React, Vite and React Router. No UI framework. Styles are plain CSS on variables generated from the design tokens. Both typefaces (Bricolage Grotesque, Hanken Grotesk) are self-hosted through Fontsource.

## Run it

```
npm install
npm run dev        # local development
npm run build      # production build in dist/
npm run preview    # serve the production build
npm run tokens     # regenerate src/styles/tokens.css after editing src/content/tokens.json
```

`npm run dev` and `npm run build` first run `npm run content`, which splits the Playbook for the site (see below).

## Publish it

Every push to `main` is built and published by GitHub Actions (`.github/workflows/deploy.yml`). In the repository settings, Pages must have its Source set to "GitHub Actions". A deploy takes about a minute. Nothing else is needed.

Routing uses hash addresses (`/#/playbook`) so the build works on any static host.

## What is on the site

| Page | Address |
|---|---|
| Home | `/` — common mistakes and findings as flip cards in sideways rows, myths, case studies |
| Playbook | `/playbook`, with a Start here route |
| Stage pages, 1 to 9 | `/playbook/stage-n` — parts are closed until opened |
| Topic pages | `/playbook/stage-n/topic-title` — the situation and the practice first, then why it works, a task, what to watch for, sources and three questions |
| Learning mechanics | `/playbook/mechanics` and detail pages |
| Toolkit | `/toolkit`, `/toolkit/methods`, `/toolkit/recipes`, `/toolkit/templates` and detail pages |
| Insights | `/insights` and `/insights/slug` — features and research digests, each with an evidence dashboard |
| Glossary, About, Search | `/glossary`, `/about`, `/search` |

## Where things are

```
src/content/playbook.json     every stage, part and topic. The one file to edit for Playbook content
src/content/home.json         Home: mistakes, findings, myths, case studies
src/content/site.json         navigation, footer, templates
src/content/evidence.json     About text, reading list, numbers, glossary
src/content/insights.json     Insights pieces. Topic links use [words](t:S.N); links between pieces use [words](insight:slug)
src/content/toolkit/          methods, recipes, mechanics
src/content/generated/        made by the build. Do not edit, not in git
src/styles/                   tokens.css (generated), app.css, pages.css
src/components/, src/pages/   the React code
src/lib.js                    loads content and builds topic addresses
src/toolkit-data.js           methods and recipes, loaded only with the Toolkit and Search
scripts/split-content.mjs     splits the Playbook for the site
```

### How content loads

`scripts/split-content.mjs` turns `playbook.json` into an index (titles and summaries), one file of full text per stage, and a word list for search. The site loads the index first. A stage's text loads when one of its topics is opened. The Toolkit and Search pages load when first visited.

### A topic

```
{ id, n, title, theory, tier, legal?, body: { situation, do, why, try, watch, deeper }, quiz: [3] }
```

Each part of `body` is a list of blocks: `p`, `steps`, `list`, `study`, `example`, `artefact` (a worked example as a table or lines), `mechanics`, `links`, `diagram`. `src/components/Blocks.jsx` draws them.

`legal: true` shows a notice telling the reader to check with a qualified legal or tax professional. Set it on any topic that states law, tax or insurance.

## Rules the site follows

1. Topic numbers never change. New topics go in a new part added to the end of a stage.
2. Colour means a Playbook stage.
3. No counts of items are shown anywhere.
4. Status, review notes and ratings of the work are kept off the site. They live in the project's status documents.
5. Nothing is shown as checked unless a source was opened. No invented evidence, quotes, client names or results.
6. Plain UK English. Practice first, reasons second.
7. Topics on law, tax or insurance carry the `legal` flag.

## Checking a change

Build, run `npm run preview`, and open the pages you changed at desktop and phone widths. Before a large change is pushed, open every address once and watch for errors: a single missing field can stop a page drawing. A page that fails now shows "This page did not load" and not a blank screen.
