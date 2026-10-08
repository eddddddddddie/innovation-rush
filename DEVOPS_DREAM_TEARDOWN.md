# DevOps Dream: game teardown

Reference notes from a full playthrough of https://devops.games (Mechanical Rock), captured 2026-10-08 as the basis for an Unearthed open-innovation-in-mining version.

## Premise

You are a newly hired CIO with a 3-year tenure. Each year you fund initiatives, then respond to one event per quarter. Four metrics measure performance. The model is based on the DORA 2019 State of DevOps report plus the authors' own opinions.

## Game loop

1. Name entry, then an optional tutorial.
2. Choose one of three companies (carousel). Size sets budget and difficulty:
   - Blockchain Bagels: small startup, $5M
   - Networked Gnomes: mid-tier tech, $25M
   - Elephant Enterprises: large legacy enterprise (budget not checked)
3. Welcome briefing from the company, written in its voice.
4. Starting report: all four metrics start at 60.
5. **Each year (x3):**
   - Initiatives screen: grid of 20 cards. Fund **up to 3 per year**.
   - Then 4 quarters. Each quarter: 1 event (3 choices, no cost), followed by a quarterly report.
6. CIO Scorecard at the end: performance tier, final score %, award, percentile vs other players ("top 5% of Networked Gnomes players in the last 30 days"), and links to learning content.

## Budget mechanics

- **The budget covers the whole 3-year tenure, not one year.** A single bar shows what is left. Overspending in Year 1 leaves almost nothing for Years 2-3. This is the main strategic trap.
- Each initiative has 4-5 options. Selecting one previews the cost on the bar before you confirm.
- Costs rise with option order, but **cost does not equal quality**:
  - Some free options are best practice (e.g. "Specification by example").
  - Some expensive options are traps (e.g. "Individual Offices", "Build in-house proprietary deployment tools").
- Some options **return** budget. "Outsource to vendors" added about 20% (trading people/capability for money).
- If you can't afford an option, it shows "Sorry! You don't have enough budget" and Confirm stays disabled.
- Funded initiatives lock for the rest of the game (shown greyed out with a trash icon until the year starts).
- Card icons show relative cost as $ to $$$$.

## Metrics and scoring

| Metric | Meaning |
|---|---|
| People | Team health and capability |
| Customer Satisfaction | How happy customers are |
| Productivity | Organisational performance, speed of change |
| Stability | Availability and reliability of service |

- Range 0-100, starting at 60. Each metric is labelled Low / Medium / High / Elite and shows a trend arrow.
- A line chart tracks all four across 12 quarters (Q0 to Y3).
- **Win:** average above 90% (Elite). **Fired:** average below 30%.
- They say random play has under a 1% chance of winning.
- Effects pass through a hidden causal model. Choices move internal nodes (e.g. psychological safety, technical debt, flow), and those nodes feed into the four metrics. Initiative effects build up over later quarters rather than landing all at once.

## Feedback

- The tutorial shows a "What happened?" screen after an event explaining the causal chain ("negative effect on psychological safety, which flows to Productivity and People"). In the main game, events go straight to the quarterly report with no explanation.
- Tone is playful, with mascot characters (bagel, gnome, elephant) and a satirical "You're Fired!" screen. Awards are tongue-in-cheek ("Second Place Sadness").

## Playthrough log (Networked Gnomes, $25M)

**Y1 initiatives (97% of total budget spent):** DevOps Transformation: blended pilot teams (37%), Automate testing: test-first (40%), Pay down technical debt: 10% allocated (20%).

| Q | Event | Choice | People / Sat / Prod / Stab after |
|---|---|---|---|
| Y1Q1 | Code management (branching) | Trunk based development | 74 / 71 / 67 / 64 |
| Y1Q2 | CRM replacement (CMO wants custom build) | Push to SaaS | 74 / 71 / 67 / 64 |
| Y1Q3 | Slow feature delivery | Automated testing on every commit | 76 / 73 / 68 / 65 |
| Y1Q4 | Custom code for customers | Per-customer configurable options | 76 / 72 / 68 / 65 |

**Y2 initiatives:** Specification by example (free), Shared document repository (free), Outsource to vendors (+20% budget).

| Q | Event | Choice | After |
|---|---|---|---|
| Y2Q1 | Global pandemic: contact tracing app | Modern cloud web app | 86 / 81 / 72 / 68 |
| Y2Q2 | Automated testing slowing us down | Merge QA and Dev | 86 / 83 / 73 / 70 |
| Y2Q3 | Open source policy | Mix including open source | 87 / 84 / 73 / 70 |
| Y2Q4 | InfoSec posture | Ease restrictions plus automated guardrails | 88 / 84 / 74 / 70 |

**Y3 initiatives:** Monitoring: common infra alerting (10%), Activity Based Working (free), EAP hotline (free).

| Q | Event | Choice | After |
|---|---|---|---|
| Y3Q1 | Test coverage targets | Discuss in focus groups | 98 / 92 / 78 / 74 |
| Y3Q2 | Cloud sourcing | Single cloud | 99 / 94 / 79 / 75 |
| Y3Q3 | Security incident (leaked keys) | Blameless post mortem | 100 / 95 / 80 / 75 |
| Y3Q4 | Budget cut | Cut contractors and vendors | 98 / 94 / 79 / 75 |

**Result:** High, 86%, "Second Place Sadness", top 5%. Productivity and Stability lagged because I had no budget left for cloud, deployment automation, DR or observability.

## Full initiative catalogue (cost = % of total tenure budget, mid-tier company)

1. **DevOps Transformation:** Rename Ops to DevOps (0) / Buy Ops automation tools (12.5) / Temporary Dev+Ops teams for incidents (25) / Blended pilot teams (37.5) / You build it, you run it (50)
2. **Migrate to the Cloud:** Proof-of-concept (~40) / Cloud-first for new systems (~53) / Steady migration 10%/yr (~67) / Aggressive 25%/yr (~80) *(costs capped by remaining budget when read)*
3. **Restructure software teams:** By job function (0) / Project teams plus support (3) / Product teams by business unit (27) / Two-pizza teams (50)
4. **Improve Disaster Recovery:** More capacity (20) / Warm standby (33) / Single-region failover (47) / Multi-region hot/hot (60)
5. **Test Disaster Recovery:** Annual desktop review (10) / Rotation testing (23) / Widespread failover testing (37) / Chaos engineering (50)
6. **Automate testing:** Buy 3rd-party tool (10) / Test CoE (20) / Automated testing in all teams (30) / Test-first in all teams (40)
7. **Automate application deployment:** In-house proprietary tools (0) / COTS tool for all (10) / Several options (20) / Teams choose their own (30)
8. **Automate infrastructure deployment:** Ops playbooks (0) / Common tools (10) / Infrastructure-as-code (20) / Pre-approved patterns (30)
9. **Flexible working:** 9-5 (0) / Flexible hours (17) / WFH (33) / Fully mobile (50)
10. **Share knowledge:** Shared doc repo (0) / Wiki (12.5) / Promote external search (25) / Internal search engine (37.5) / Communities of practice (50)
11. **Monitoring and observability:** Infra alerting (10) / APM per team (23) / Observability tools (37) / SRE principles (50)
12. **Uplift skills:** Pay for own courses (0) / Central training budget (10) / Online subscriptions (20) / Conferences and events (30)
13. **Uplift capability:** Outsource to vendors (returns budget) / Staff augmentation (3) / Selected expert advice (27) / Trusted partner (50)
14. **Code maintainability:** Package managers (0) / Static analysis (10) / Code quality tools (20) / Full dev tool suite (30)
15. **Pay down technical debt:** Opportunity based (0) / 5% (10) / 10% (20) / 15% (30)
16. **Employee assistance:** EAP hotline (0) / Staff surveys (10) / External EAP (20) / On/offsite counselling (30)
17. **Alternative coding approaches:** CASE tools (10) / Low-code (17) / Model based (23) / No-code (30)
18. **Better requirements:** Specification by example (0) / Agile user stories (10) / Written specs (20) / Requirements tools (30)
19. **Workplace reorganisation:** Activity Based Working (0) / Hotdesking (12.5) / High density (25) / Low density (37.5) / Individual offices (50)
20. **Customer focus:** Seconded SMEs (10) / Product owner in every team (23) / UX CoE (37) / UX specialist in every team (50)

## Event catalogue seen

Security incident (leaked keys), Code management (branching strategy), CRM replacement, Slow feature delivery, Custom code for customers, Global pandemic (contact tracing), Automated testing slowing us down, Open source policy, InfoSec posture, Test coverage, Cloud sourcing, Budget cut.

Every event has 3 choices: usually one modern best practice, one traditional/command-and-control response, and one plausible middle option.

## Design takeaways for the mining version

- Keep the small surface: 3 years x (≤3 initiatives + 4 events), 4 metrics, 1 tenure budget. A run takes about 10 minutes.
- The fun comes from: (a) the tenure-wide budget trap, (b) cheap options that are best practice and expensive ones that are traps, (c) delayed, compounding effects through hidden nodes, (d) real-world events whose "obvious" answer is wrong.
- The tutorial's "What happened?" explanation is the strongest teaching moment, and the main game drops it. Keeping a short explanation after every event (or in the final debrief) would improve on the original.
- End with a debrief linking to the underlying framework (for them DORA; for Unearthed, its own open innovation methodology and case studies).
