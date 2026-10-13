# CLAUDE.md

Guidance for Claude Code when working in this repository.

# Innovation Rush

A single-page strategy game by Unearthed, inspired by DevOps Dream (devops.games). The player is a mining company's Chief Innovation Officer for three years (about 10 minutes of play). Each year they source technology for two site problems (usual vendor, Unearthed open challenge or in-house) and fund up to three initiatives from one tenure-long budget of Crib Credits. Technologies move through Evaluate, Pilot and Scale with odds set by eight hidden drivers; scaled technology permanently lifts the metrics. Events land in 8 of 12 quarters, a year-end board meeting tops up or cuts credits based on results and a random-walk copper price, and the scorecard shows achievements, a share button and a personalised "Where Unearthed would start with you" plan.

- Live site: https://eddddddddddie.github.io/innovation-rush/ (GitHub Pages, served from `docs/` on `main`)
- Repo: https://github.com/eddddddddddie/innovation-rush (public)

## Layout

| Path | What it is |
|---|---|
| `src/engine.js` | All game content and rules, pure JS with no DOM: `COMPANIES`, `INITIATIVES`, `EVENTS`, `PROBLEMS` (site problems and their innovator approaches), `ROUTES`, `STAGES`, `ACHIEVEMENTS`, `EVENT_QUARTERS`, `UNEARTHED` (services, figures, driver-to-service mapping, contact, HubSpot), `METRICS` weights, `TUNE` (balance settings), and the rules: pipeline odds, copper price, board review, scoring, vendor checks |
| `src/ui.js` | Every screen, including How to play, The approach and the scorecard. Renders the whole app from state on each change |
| `src/art.js` | Company mascots (echidna, wombat, saltwater croc, all in hard hats and hi-vis), six player avatars (`PEOPLE`, `person()`), line icons, the open-pit scene and the Unearthed U mark, as inline SVG |
| `src/template.html` | Page shell and all CSS (design tokens in `:root`) |
| `src/assets/unearthed-logo.png` | Logo, inlined as a data URI at build time |
| `build.py` | Inlines the sources into `docs/index.html` (standalone, for Pages) and `dist/innovation-rush.html` (body only, for the Claude artifact) |
| `tools/simulate.js` | Balance check: plays thousands of games per strategy and company |
| `tools/autoplay.js` | Headless browser harness that plays to a stop point (`?stop=title|name|company|welcome|modal|plan1|plan2|plan3|event|pick|outcome|board|end|howto|approach|ingame-howto|lead|leadform`) |
| `DEVOPS_DREAM_TEARDOWN.md` | Notes from playing the original game |

`docs/` and `dist/` are generated. Never edit them by hand; edit `src/` and rebuild.

## Making a change

1. Edit `src/`.
2. If costs, effects, events, problems, odds, companies, metric weights or `TUNE` changed, run the balance check (seeded, so repeatable) and keep these targets:
   ```bash
   node tools/simulate.js
   TUNE='{"initScale":0.65}' node tools/simulate.js 600   # try settings without editing the engine
   ```
   - random play: median about 55 to 65, never elite
   - strong ("smart") play with challenges: about 94 for Lucky Strike and Copper Canyon, about 90 for Big Rocks (the bot always backs the best submission, so humans land lower)
   - ignoring the pipeline ("noPipeline") stays below 90, and usual-vendor-only below strong play, so the pipeline and Unearthed challenges matter
   - spending everything in Year 1: clearly below 90
   - Big Rocks fires the "terrible" strategy most of the time; Lucky Strike never does
3. Rebuild and syntax-check:
   ```bash
   python3 build.py
   node -e "const h=require('fs').readFileSync('docs/index.html','utf8');[...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach((m,i)=>{try{new Function(m[1])}catch(e){console.log('ERR',i,e.message)}});console.log('scripts ok')"
   ```
4. Test in headless Chrome. Wrap the build with the harness, then dump the DOM (it reports `ERRORS:[]` on success) or take screenshots. Chrome may not exit on its own, so cap each run with `perl -e 'alarm 30; exec @ARGV'`:
   ```bash
   python3 -c "from pathlib import Path; h=Path('docs/index.html').read_text(); j=Path('tools/autoplay.js').read_text(); Path('<scratchpad>/test.html').write_text(h.replace('</body>','<script>'+j+'</script></body>'))"
   perl -e 'alarm 30; exec @ARGV' "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --no-sandbox --user-data-dir=<scratchpad>/chrome --dump-dom "file://<scratchpad>/test.html?stop=end"
   ```
   Use `--screenshot=<file> --window-size=1280,1500` instead of `--dump-dom` to look at a screen. Headless Chrome's minimum window is about 500px wide, so narrow screenshots are not true phone width.
5. Commit and push to `main`. GitHub Pages republishes within a minute or two. End commit messages with the attribution line the session asks for.
6. Only if Ed asks: republish the Claude artifact copy from `dist/innovation-rush.html` (https://claude.ai/artifact/3ynZQYXKHeuRXCaed38D8L).

## Rules

- **The repo and site are public.** Unearthed text in the game may only come from public sources: the general sections of the sales master copy (`~/capability-statement/sales/capability-statement-master-copy.md`: forms of work, stages, Why Unearthed, headline figures) and the public unearthed.solutions pages. Never use client names, client capability statements, the case study library, staff email addresses, or figures the master copy marks as needing confirmation (for example the BHP Think & Act Differently $1:$11 figure). The only contact address is industry@unearthed.solutions.
- Never invent Unearthed services, figures, case studies or clients. New "Where Unearthed fits" lines (`fit` on each event) and `UNEARTHED.help` text must paraphrase the master copy or the website.
- Style follows the real unearthed.solutions site, not a generic AI look: light-weight near-black headlines (Helvetica Neue stack, standing in for Saans), small sentence-case text, outlined pill buttons with an orange arrow, hairline cards, numbered sections on alternating full-width grey bands, orange as an accent only. Avoid bold orange headings, uppercase eyebrow labels and tinted card fills. No element should use all four brand oranges except the logo and U mark.
- Copy is Australian English, plain and direct, with no em dashes. Keep the tone playful in the game and plain on the info pages.
- Site problem approaches in `PROBLEMS` are fictional innovators described only by sector and country, never by a company name. Keep one A-grade approach per problem (challenges always include it) and mark outside-mining ones `outside: true`.
- Costs in `INITIATIVES` are percentages of the company budget; `costOf` converts them to whole Crib Credits (budgets 40 / 300 / 1,200). Options tagged `u: true` are things Unearthed delivers and get the "Unearthed service" badge.
- **HubSpot lead capture.** The scorecard's contact panel shows a lead form when `UNEARTHED.hubspot.formGuid` in `src/engine.js` is set (portal 44410384, form "Innovation Rush"). It posts to the HubSpot Forms API v3 (`api.hsforms.com/submissions/v3/integration/submit/<portal>/<guid>`) with `firstname`, `lastname`, `email`, `company`, `jobtitle` and a plain-text game summary in `message` (`resultSummary()` in `src/ui.js`). Empty `formGuid` hides the form. The form works on GitHub Pages only; the Claude artifact's sandbox blocks the request and the player sees the email fallback. Never submit the real form while testing: `tools/autoplay.js?stop=lead` replaces `fetch` and prints the request body instead. A real test submission creates a HubSpot contact, so only do one when Ed asks.
- Avoid class-name collisions in CSS: `.copy` is the hero and welcome text container; the email copy button is `.copy-btn`.
- Python uses the system `python3` (standard library only). No npm dependencies.
