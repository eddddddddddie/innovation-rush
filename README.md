# Innovation Rush

A playful strategy game about leading open innovation at a mining company, by Unearthed. Inspired by [DevOps Dream](https://devops.games).

You are the new Chief Innovation Officer. Over three years you fund up to three initiatives a year from one tenure-long budget of Crib Credits (40, 300 or 1,200 depending on the company), and respond to one event each quarter. Four metrics (Ecosystem, Adoption, Value, Buy-in) are driven by eight hidden drivers. Average 90+ to win; drop below 35 and you are fired.

## Sales content

Unearthed shows up in three places during play: three **vendor checks** per tenure that grade an initiative's or event's options A/B/C (`useCheck`, `grades`), **Unearthed service** tags on options marked `u: true`, and a **Where Unearthed fits** line after every event (`fit` on each event). The **How to play** and **The approach** pages explain the rules and how Unearthed uses open innovation, challenges and market intelligence; the approach page draws on the public unearthed.solutions pages (How We Work, Challenges, Insights, Launched).

The scorecard ends with "Where Unearthed would start with you": the player's two weakest hidden drivers are mapped to Unearthed forms of work and engagement stages (`UNEARTHED.help` in `src/engine.js`), followed by headline figures and a contact panel. Options that Unearthed delivers are tagged `u: true` and labelled in the decision review.

All of this text comes from the sales master copy in the capability-statement project (`sales/capability-statement-master-copy.md`). This repository is public, so only use public-safe text here: no client names, case studies, staff emails or figures the master copy marks as needing confirmation.

## Play

Open `docs/index.html` in a browser, or visit the GitHub Pages site once it is enabled.

## Project layout

| Path | What it is |
|---|---|
| `src/engine.js` | Game content (companies, initiatives, events) and rules. Pure JS, no DOM. |
| `src/art.js` | Mascots and icons as inline SVG |
| `src/assets/` | Unearthed logo, inlined into the page at build time |
| `src/ui.js` | Screens and interaction |
| `src/template.html` | Styles and page shell |
| `build.py` | Inlines the sources into single-file pages |
| `docs/index.html` | Built standalone page, served by GitHub Pages |
| `dist/innovation-rush.html` | Built page body for publishing as a Claude artifact |
| `tools/simulate.js` | Balance check: plays thousands of games per strategy |
| `tools/autoplay.js` | Headless browser test harness |
| `DEVOPS_DREAM_TEARDOWN.md` | Notes from playing the original game |

## Editing

1. Change content or rules in `src/`.
2. Run `node tools/simulate.js` to check balance. Targets: random play median about 55-65 and never elite; strong play just over 90.
3. Run `python3 build.py` to rebuild `docs/` and `dist/`.
