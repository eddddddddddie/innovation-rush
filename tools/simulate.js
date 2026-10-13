// Balance check: plays many games with different strategies and reports score distributions.
// Seeded, so runs are repeatable. Usage: node tools/simulate.js [games-per-strategy]
const E = require('../src/engine.js');

let seed = 12345;
const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
E.setRng(rnd);
if (process.env.TUNE) Object.assign(E.TUNE, JSON.parse(process.env.TUNE));

const bestEventChoice = (ev) => ev.choices.reduce((b, c, i) => (E.impact(c.e) > E.impact(ev.choices[b].e) ? i : b), 0);
const worstEventChoice = (ev) => ev.choices.reduce((b, c, i) => (E.impact(c.e) < E.impact(ev.choices[b].e) ? i : b), 0);
const bestPick = (pick) => pick.options.reduce((b, o, i) => ('ABC'.indexOf(E.problemById(pick.pid).approaches[o].q) < 'ABC'.indexOf(E.problemById(pick.pid).approaches[pick.options[b]].q) ? i : b), 0);

function play(companyId, strat) {
  const s = E.newGame(companyId, 'sim');
  while (s.status === 'playing') {
    if (s.quarter === 0) { strat.plan(s); E.startYear(s); }
    const ev = E.currentEvent(s);
    E.playQuarter(s, ev ? strat.event(ev) : null);
    while (s.picks.length) E.pickSubmission(s, s.picks[0].pid, strat.pick(s.picks[0]));
  }
  return { score: s.status === 'fired' ? 0 : E.avg(E.metrics(s)), fired: s.status === 'fired', s };
}

// Fund initiatives by value per credit within a yearly allowance.
function smartInitiatives(s, allowance) {
  let spent = 0;
  const cands = [];
  for (const init of E.INITIATIVES) init.opts.forEach((o, i) => cands.push({ id: init.id, i, v: E.impact(o.e) * (E.YEARS - s.year + 1), c: Math.max(o.c, 3) }));
  cands.sort((a, b) => b.v / b.c - a.v / a.c);
  for (const c of cands) {
    if (E.fundedThisYear(s).length >= 3) break;
    if (c.v <= 0) continue;
    const cost = E.costOf(s, c.id, c.i);
    if (spent + cost > allowance) continue;
    if (E.fund(s, c.id, c.i)) spent += cost;
  }
  return spent;
}

const strategies = {
  random: {
    plan(s) {
      for (const pid of s.problems[s.year]) { const r = [null, 'vendor', 'challenge', 'inhouse'][Math.floor(rnd() * 4)]; if (r) E.source(s, pid, r); }
      const n = Math.floor(rnd() * 4);
      for (const init of E.shuffle(E.INITIATIVES, rnd)) {
        if (E.fundedThisYear(s).length >= n) break;
        const opts = E.shuffle(init.opts.map((_, i) => i), rnd).filter((o) => E.canFund(s, init.id, o));
        if (opts.length) E.fund(s, init.id, opts[0]);
      }
    },
    event: () => Math.floor(rnd() * 3),
    pick: () => Math.floor(rnd() * 3),
  },
  smart: {
    plan(s) {
      const yearsLeft = E.YEARS - s.year + 1;
      const allowance = s.budget / yearsLeft + (s.year === 1 ? E.company(s).budget * 0.1 : 0);
      for (const pid of s.problems[s.year]) E.source(s, pid, 'challenge');
      smartInitiatives(s, allowance - E.routeCost(s, 'challenge') * 2);
    },
    event: bestEventChoice,
    pick: bestPick,
  },
  vendorOnly: {
    // Same initiatives and events as smart, but always takes the usual vendor.
    plan(s) {
      const allowance = s.budget / (E.YEARS - s.year + 1) + (s.year === 1 ? E.company(s).budget * 0.1 : 0);
      for (const pid of s.problems[s.year]) E.source(s, pid, 'vendor');
      smartInitiatives(s, allowance - E.routeCost(s, 'vendor') * 2);
    },
    event: bestEventChoice,
    pick: bestPick,
  },
  noPipeline: {
    plan(s) { smartInitiatives(s, s.budget / (E.YEARS - s.year + 1) + (s.year === 1 ? E.company(s).budget * 0.1 : 0)); },
    event: bestEventChoice,
    pick: bestPick,
  },
  bigSpenderY1: {
    plan(s) {
      if (s.year !== 1) return;
      for (const init of E.INITIATIVES) {
        const i = init.opts.map((o, k) => [o.c, k]).sort((a, b) => b[0] - a[0])[0][1];
        E.fund(s, init.id, i);
      }
      for (const pid of s.problems[s.year]) E.source(s, pid, 'challenge');
    },
    event: bestEventChoice,
    pick: bestPick,
  },
  terrible: {
    plan(s) {
      for (const pid of s.problems[s.year]) E.source(s, pid, 'vendor');
      for (const init of E.INITIATIVES) {
        const w = init.opts.reduce((b, o, i) => (E.impact(o.e) < E.impact(init.opts[b].e) ? i : b), 0);
        E.fund(s, init.id, w);
      }
    },
    event: worstEventChoice,
    pick: (p) => 2 - bestPick(p),
  },
};

const N = +process.argv[2] || 2000;
for (const co of E.COMPANIES) {
  console.log(`\n== ${co.name}  start avg ${E.avg(E.metricsFrom(co.nodes)).toFixed(1)}`);
  for (const [name, st] of Object.entries(strategies)) {
    const r = Array.from({ length: name === 'random' ? N : Math.ceil(N / 4) }, () => play(co.id, st));
    const sc = r.map((x) => x.score).sort((a, b) => a - b);
    const pct = (p) => sc[Math.floor(p * (sc.length - 1))].toFixed(1);
    const elite = r.filter((x) => x.score >= 90).length / r.length;
    const fired = r.filter((x) => x.fired).length / r.length;
    const scaled = r.reduce((a, x) => a + x.s.techs.filter((t) => t.status === 'running').length, 0) / r.length;
    const tops = r.reduce((a, x) => a + x.s.boards.reduce((b, y) => b + y.pct, 0), 0) / r.length;
    console.log(`${name.padEnd(13)} p10 ${pct(0.1)} p50 ${pct(0.5)} p90 ${pct(0.9)} max ${pct(1)} elite ${(elite * 100).toFixed(0)}% fired ${(fired * 100).toFixed(0)}% scaled ${scaled.toFixed(1)} board ${tops.toFixed(0)}%`);
  }
}
