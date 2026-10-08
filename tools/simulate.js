// Balance check: plays many games with different strategies and reports score distributions.
const E = require('../src/engine.js');

function bestEventChoice(ev) { let b = 0; ev.choices.forEach((c, i) => { if (E.impact(c.e) > E.impact(ev.choices[b].e)) b = i; }); return b; }
function worstEventChoice(ev) { let b = 0; ev.choices.forEach((c, i) => { if (E.impact(c.e) < E.impact(ev.choices[b].e)) b = i; }); return b; }

function play(companyId, strat, rnd = Math.random) {
  const s = E.newGame(companyId, 'sim', rnd);
  while (s.status === 'playing') {
    if (s.quarter === 0) { strat.plan(s, rnd); E.startYear(s); }
    const ev = E.currentEvent(s);
    E.playQuarter(s, strat.event(ev, rnd));
  }
  return { score: s.status === 'fired' ? 0 : E.avg(s.history[s.history.length - 1]), fired: s.status === 'fired', s };
}

const strategies = {
  random: {
    plan(s, rnd) {
      const n = Math.floor(rnd() * 4);
      for (const init of E.shuffle(E.INITIATIVES, rnd)) {
        if (E.fundedThisYear(s).length >= n) break;
        const opts = E.shuffle(init.opts.map((_, i) => i), rnd).filter((o) => E.canFund(s, init.id, o));
        if (opts.length) E.fund(s, init.id, opts[0]);
      }
    },
    event: (ev, rnd) => Math.floor(rnd() * 3),
  },
  smart: {
    // Value per cost, with a budget allowance per year so later years still have money.
    plan(s) {
      const allowance = s.budget / (E.YEARS - s.year + 1) + (s.year === 1 ? 10 : 0);
      let spent = 0;
      const cands = [];
      for (const init of E.INITIATIVES) init.opts.forEach((o, i) => cands.push({ id: init.id, i, v: E.impact(o.e) * (E.YEARS - s.year + 1), c: Math.max(o.c, 3) }));
      cands.sort((a, b) => b.v / b.c - a.v / a.c);
      for (const c of cands) {
        if (E.fundedThisYear(s).length >= 3) break;
        if (c.v <= 0) continue;
        const cost = E.initById(c.id).opts[c.i].c;
        if (spent + cost > allowance) continue;
        if (E.fund(s, c.id, c.i)) spent += cost;
      }
    },
    event: bestEventChoice,
  },
  bigSpenderY1: {
    // Buys the most expensive option of three initiatives in year 1, then nothing. Good events.
    plan(s) {
      if (s.year !== 1) return;
      for (const init of E.INITIATIVES) {
        const i = init.opts.map((o, i) => [o.c, i]).sort((a, b) => b[0] - a[0])[0][1];
        E.fund(s, init.id, i);
      }
    },
    event: bestEventChoice,
  },
  terrible: {
    plan(s) {
      for (const init of E.INITIATIVES) {
        let w = 0; init.opts.forEach((o, i) => { if (E.impact(o.e) < E.impact(init.opts[w].e)) w = i; });
        E.fund(s, init.id, w);
      }
    },
    event: worstEventChoice,
  },
  goodEventsNoInit: { plan() {}, event: bestEventChoice },
};

const N = 3000;
for (const co of E.COMPANIES) {
  console.log(`\n== ${co.name}  start avg ${E.avg(E.metricsFrom(co.nodes)).toFixed(1)}`);
  for (const [name, st] of Object.entries(strategies)) {
    const r = Array.from({ length: name === 'random' ? N : 300 }, () => play(co.id, st));
    const sc = r.map((x) => x.score).sort((a, b) => a - b);
    const pct = (p) => sc[Math.floor(p * (sc.length - 1))].toFixed(1);
    const elite = r.filter((x) => x.score >= 90).length / r.length;
    const fired = r.filter((x) => x.fired).length / r.length;
    const last = r[r.length - 1].s.history.at(-1);
    console.log(`${name.padEnd(17)} p10 ${pct(0.1)} p50 ${pct(0.5)} p90 ${pct(0.9)} max ${pct(1)} elite ${(elite * 100).toFixed(1)}% fired ${(fired * 100).toFixed(1)}%  last: ${Object.values(last).map((v) => v.toFixed(0)).join('/')}`);
  }
}
