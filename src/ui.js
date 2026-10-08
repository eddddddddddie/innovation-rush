// Innovation Rush: screens and interaction. Renders the whole app from state on every change.
(() => {
  const E = ENGINE, A = ART, U = ENGINE.UNEARTHED;
  const app = document.getElementById('app');
  const BEST_KEY = 'innovation-rush-best';
  const MCOL = { eco: 'var(--m-eco)', adopt: 'var(--m-adopt)', value: 'var(--m-value)', buyin: 'var(--m-buyin)' };
  const MHEX = { eco: '#FF6600', adopt: '#282726', value: '#FFA627', buyin: '#8C8986' };
  const GRADE = {
    A: { name: 'Proven', note: 'Strongest evidence of the options' },
    B: { name: 'Some evidence', note: 'Helps, but there is a stronger option' },
    C: { name: 'Weak evidence', note: 'Little benefit, or likely to backfire' },
  };

  let S = null; // engine game state
  let V = { view: 'title', name: '', companyId: null, modal: null, pending: null, order: null, outcome: null };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const coById = (id) => E.COMPANIES.find((c) => c.id === id);
  const co = () => coById(S ? S.companyId : V.companyId);
  const mascot = (id, mood) => A.MASCOTS[coById(id).mascot](mood);
  const latest = () => S.history[S.history.length - 1];
  const num = (n) => Math.abs(n).toLocaleString('en-AU');
  const coin = '<span class="coin" aria-hidden="true"></span>';
  const cc = (n) => `<span class="cc">${coin}${num(n)}</span>`; // compact credits, for prices
  const ccText = (n) => `${num(n)} Crib Credit${Math.abs(n) === 1 ? '' : 's'}`; // credits in a sentence
  const sign = (d) => {
    const r = Math.round(d);
    if (r === 0) return `<span class="d flat">no change</span>`;
    return `<span class="d ${r > 0 ? 'up' : 'down'}">${r > 0 ? '+' : '−'}${Math.abs(r)}</span>`;
  };

  const store = {
    get() { try { return JSON.parse(localStorage.getItem(BEST_KEY)) || {}; } catch { return {}; } },
    set(companyId, score) {
      try {
        const b = store.get();
        if (!(b[companyId] >= score)) { b[companyId] = score; localStorage.setItem(BEST_KEY, JSON.stringify(b)); }
      } catch { /* storage unavailable */ }
    },
  };

  // ---------- shared pieces ----------

  const LOGO = '__LOGO__';
  const brandline = () => `<header class="brandline"><a class="logo" href="${U.contact.web}" target="_blank" rel="noopener"><img src="${LOGO}" alt="Unearthed"></a>
    <nav class="topnav" aria-label="Game pages"><button data-a="home" class="${V.view === 'title' ? 'on' : ''}">Innovation Rush</button><button data-a="page" data-p="howto" class="${V.view === 'howto' ? 'on' : ''}">How to play</button><button data-a="page" data-p="approach" class="${V.view === 'approach' ? 'on' : ''}">The approach</button></nav></header>`;
  const inGame = () => S && S.status === 'playing' && ['plan', 'event', 'outcome'].includes(V.back);
  const backBar = () => (inGame() ? `<div class="backbar"><button class="btn ghost" data-a="back">Back to your game</button></div>` : '');

  // A numbered section. Banded sections get a full-width grey background so neighbouring sections are easy to tell apart.
  const sec = ({ id, n, title, intro, band, body, cls = '' }) => `<section class="sec ${band ? 'band' : ''} ${cls}" ${id ? `id="${id}"` : ''}>
      <div class="sec-head"><span class="sec-n">${n}</span><div class="stack"><h2>${title}</h2>${intro ? `<p>${intro}</p>` : ''}</div></div>
      ${body}
    </section>`;

  const uBadge = (text = 'Unearthed service') => `<span class="ubadge">${A.umark()}${text}</span>`;

  function hud() {
    const c = co();
    const played = S.log.length;
    const years = [1, 2, 3].map((y) => {
      const qs = [1, 2, 3, 4].map((q) => {
        const i = (y - 1) * 4 + (q - 1);
        const cls = i < played ? 'done' : i === played && S.quarter > 0 && V.view === 'event' ? 'now' : '';
        return `<span class="bench ${cls}" style="margin-top:${(q - 1) * 3}px"></span>`;
      }).join('');
      return `<div class="bench-year"><div class="ql">${qs}</div><span class="yl">Y${y}</span></div>`;
    }).join('');
    let fill = S.budget, ghost = S.budget;
    if (V.modal && V.pending != null) {
      const cur = S.funded.find((f) => f.id === V.modal && f.year === S.year);
      const after = S.budget + (cur ? E.costOf(S, V.modal, cur.opt) : 0) - E.costOf(S, V.modal, V.pending);
      fill = Math.min(after, S.budget); ghost = Math.max(after, S.budget);
    }
    const pct = (v) => Math.min(100, Math.max(0, (v / c.budget) * 100));
    const m = latest();
    const where = S.quarter === 0 ? `Year ${S.year}, planning` : `Year ${S.year}, quarter ${S.quarter}`;
    const dots = Array.from({ length: E.VENDOR_CHECKS }, (_, i) => `<i class="${i < S.checks ? 'on' : ''}"></i>`).join('');
    return `<div class="hud"><div class="hud-inner">
      <div class="who">${mascot(S.companyId)}<div style="min-width:0"><div class="name">${esc(S.player)}</div><div class="co">Chief Innovation Officer, ${c.name}</div></div></div>
      <div class="benches" role="img" aria-label="${where}. ${played} of 12 quarters played.">${years}</div>
      <div class="hud-right">
        <div class="budget"><div class="amt">${cc(S.budget)} <small>Crib Credits left of ${num(c.budget)}</small></div>
          <div class="track"><div class="ghost" style="width:${pct(ghost)}%"></div><div class="fill" style="width:${pct(fill)}%"></div></div></div>
        <div class="checks" title="Unearthed vendor checks grade the options for one initiative or event">${A.umark()}<span>${S.checks} vendor check${S.checks === 1 ? '' : 's'}</span><span class="dots" aria-hidden="true">${dots}</span></div>
        <div class="hudlinks"><button data-a="page" data-p="howto">How to play</button><button data-a="page" data-p="approach">The approach</button></div>
      </div>
      <div class="minimetrics">${E.METRICS.map((mt) => `<div class="mm" style="--c:${MCOL[mt.id]}"><div class="top"><span>${mt.name}</span><span>${Math.round(m[mt.id])}</span></div><div class="track"><div class="fill" style="width:${m[mt.id]}%"></div></div></div>`).join('')}</div>
    </div></div>`;
  }

  // The vendor check panel shown in the initiative modal and on events.
  function checkPanel(key, gradedNow) {
    if (gradedNow) {
      return `<div class="vcheck done">${A.umark()}<div><b>Unearthed vendor check complete</b><p>Each option is graded on the evidence behind it: <b>A</b> proven, <b>B</b> some evidence, <b>C</b> weak. In real life a vendor check gives you a short written view on deployment history, evidence and fit, usually within days.</p></div></div>`;
    }
    if (S.checks <= 0) {
      return `<div class="vcheck empty">${A.umark()}<div><b>No vendor checks left</b><p>You have used all ${E.VENDOR_CHECKS} Unearthed vendor checks for this tenure. Trust your judgement.</p></div></div>`;
    }
    return `<div class="vcheck">${A.umark()}<div><b>Not sure? Ask Unearthed.</b><p>A vendor check grades every option on the evidence behind it. You have ${S.checks} left for your whole tenure.</p></div>
      <button class="btn small" id="use-check" data-a="useCheck" data-key="${key}">Use a vendor check</button></div>`;
  }

  const gradeChip = (g) => `<span class="grade g${g}" title="${GRADE[g].note}">${g}<span>${GRADE[g].name}</span></span>`;

  function chart(hist) {
    const W = 1000, H = 330, L = 34, R = W - 12, T = 14, B = H - 30;
    const x = (i) => L + ((R - L) * i) / 12;
    const y = (v) => B - ((B - T) * v) / 100;
    let g = '';
    for (const v of [0, 25, 50, 75, 100]) g += `<line x1="${L}" x2="${R}" y1="${y(v)}" y2="${y(v)}" stroke="#ECE9E5"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${v}</text>`;
    for (const q of [4, 8]) g += `<line x1="${x(q)}" x2="${x(q)}" y1="${T}" y2="${B}" stroke="#E2DFDB"/>`;
    for (let q = 0; q <= 12; q++) g += `<line x1="${x(q)}" x2="${x(q)}" y1="${B}" y2="${B + 4}" stroke="#CFCAC5"/>`;
    [['Year 1', 2], ['Year 2', 6], ['Year 3', 10]].forEach(([t, q]) => { g += `<text x="${x(q)}" y="${B + 20}" text-anchor="middle">${t}</text>`; });
    g += `<line x1="${L}" x2="${R}" y1="${y(90)}" y2="${y(90)}" stroke="#FF6600" stroke-dasharray="5 4" opacity=".7"/><text x="${R - 4}" y="${y(90) - 6}" text-anchor="end" style="fill:#B84A00">Win: average 90+</text>`;
    g += `<line x1="${L}" x2="${R}" y1="${y(E.FIRE_BELOW)}" y2="${y(E.FIRE_BELOW)}" stroke="#C0392B" stroke-dasharray="5 4" opacity=".6"/><text x="${R - 4}" y="${y(E.FIRE_BELOW) + 15}" text-anchor="end" style="fill:#C0392B">Fired: average below ${E.FIRE_BELOW}</text>`;
    for (const mt of E.METRICS) {
      const pts = hist.map((h, i) => `${x(i).toFixed(1)},${y(h[mt.id]).toFixed(1)}`).join(' ');
      const dash = mt.id === 'buyin' ? ' stroke-dasharray="6 4"' : '';
      g += `<polyline points="${pts}" fill="none" stroke="${MHEX[mt.id]}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"${dash}/>`;
      hist.forEach((h, i) => {
        const last = i === hist.length - 1;
        g += `<circle cx="${x(i).toFixed(1)}" cy="${y(h[mt.id]).toFixed(1)}" r="${last ? 4.5 : 2.6}" fill="${last ? MHEX[mt.id] : '#fff'}" stroke="${MHEX[mt.id]}" stroke-width="2"/>`;
      });
    }
    const lastM = hist[hist.length - 1];
    const label = E.METRICS.map((mt) => `${mt.name} ${Math.round(lastM[mt.id])}`).join(', ');
    return `<div class="chart-card"><svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Metrics by quarter. Latest: ${label}.">${g}</svg>
      <div class="legend">${E.METRICS.map((mt) => `<span><i class="${mt.id === 'buyin' ? 'dash' : ''}" style="--c:${MHEX[mt.id]}"></i>${mt.name}</span>`).join('')}</div></div>`;
  }

  // ---------- screens ----------

  const views = {
    title() {
      const best = store.get();
      const bestAny = Math.max(0, ...Object.values(best));
      return `<div class="wrap">${brandline()}
        <main class="screen">
          <div class="hero">
            <div class="copy">
              <div class="stack">
                <h1>Innovation Rush</h1>
                <p class="lede">You are the new Chief Innovation Officer at a mining company. Unearth new technology, get it running on your sites and keep the board on side. You have three years and one budget of Crib Credits.</p>
              </div>
              <div class="stack">
                <div class="cta-row"><button class="btn" data-a="start">Start your tenure</button></div>
                <span class="hint">${bestAny ? `Your best score so far: ${Math.round(bestAny)}%.` : 'Takes about 10 minutes.'} Built by Unearthed from more than 200 innovation challenges run for mining and metals companies.</span>
              </div>
            </div>
            <div class="photo">
              <div class="float"><h3>Three companies are hiring</h3><p>A junior explorer, a mid-tier copper miner and a global major. Pick your pit.</p></div>
              <div class="scene">${A.pit()}
                <div class="m m-nugget">${A.MASCOTS.nugget()}</div>
                <div class="m m-rock">${A.MASCOTS.rock()}</div>
                <div class="m m-truck">${A.MASCOTS.truck()}</div>
              </div>
            </div>
          </div>
          ${sec({ n: '01', title: 'How the game works', band: true, body: `<div class="statrow">
            <div><span class="stat">3</span><span>years to prove your value</span></div>
            <div><span class="stat">${E.INITIATIVES.length}</span><span>initiatives to fund with Crib Credits</span></div>
            <div><span class="stat">${E.EVENTS.length}</span><span>real-world events to respond to</span></div>
            <div><span class="stat">4</span><span>metrics the board watches</span></div>
          </div>` })}
          ${sec({ n: '02', title: 'Unearthed is on your side', intro: 'The game is built on how Unearthed runs open innovation for mining companies. You will see it as you play.', body: `<div class="ufeatures">
            <div>${A.umark()}<b>Vendor checks</b><p>Three per tenure. Use one to have Unearthed grade every option on the evidence behind it.</p></div>
            <div>${A.umark()}<b>Unearthed services</b><p>Options Unearthed delivers for real mining companies are marked, so you can see where we fit.</p></div>
            <div>${A.umark()}<b>Your plan at the end</b><p>Your scorecard shows where Unearthed would start with you, based on how you played.</p></div>
          </div>` })}
        </main></div>`;
    },

    name() {
      return `<div class="wrap">${brandline()}
        <main class="screen">
          ${sec({ n: '01', title: 'First, what should we call you?', body: `<form class="field" id="nameform" novalidate>
            <label for="player">Your name</label>
            <input id="player" maxlength="24" autocomplete="nickname" value="${esc(V.name)}" placeholder="e.g. Alex">
            <span class="hint">Only used on your scorecard.</span>
          </form>
          <div><button class="btn" id="name-next" data-a="name" ${V.name.trim() ? '' : 'disabled'}>Next</button></div>` })}
        </main></div>`;
    },

    company() {
      const best = store.get();
      return `<div class="wrap">${brandline()}
        <main class="screen">
          ${sec({ n: '02', title: 'Which mining company will you join?', band: true, intro: 'Three companies are competing for you. Bigger companies have more Crib Credits, and bigger problems.', body: `
          <div class="companies">${E.COMPANIES.map((c) => `
            <button class="company" data-a="company" data-id="${c.id}" aria-pressed="${V.companyId === c.id}">
              <div class="portrait">${A.MASCOTS[c.mascot]()}</div>
              <div class="body">
                <h3>${c.name}</h3>
                <div class="facts"><span class="chip">${c.size}</span><span class="chip orange">${coin}${num(c.budget)} Crib Credits</span><span class="chip ${c.difficulty === 'Brutal' ? 'bad' : c.difficulty === 'Gentle' ? 'good' : ''}">${c.difficulty}</span></div>
                <p>${c.blurb}</p>
                ${best[c.id] ? `<span class="hint">Your best here: ${Math.round(best[c.id])}%</span>` : ''}
              </div>
            </button>`).join('')}
          </div>
          <div class="row"><button class="btn" data-a="accept" ${V.companyId ? '' : 'disabled'}>${V.companyId ? `Join ${coById(V.companyId).name}` : 'Pick a company'}</button></div>` })}
        </main></div>`;
    },

    welcome() {
      const c = co();
      return `<div class="wrap">${brandline()}
        <main class="screen">
          <div class="letter">
            <div class="portrait">${mascot(c.id)}</div>
            <div class="copy">
              <span class="label">A message from the board</span>
              <h2>Welcome to ${c.name}, ${esc(S.player)}!</h2>
              ${c.welcome.map((p) => `<p>${p}</p>`).join('')}
            </div>
          </div>
          ${sec({ n: '01', title: 'How it works', band: true, body: `<div class="steps">
            <div class="step"><span class="n">Step 1</span><b>Fund initiatives</b><span>At the start of each year, fund up to three. They keep working until you leave.</span></div>
            <div class="step"><span class="n">Step 2</span><b>Make ${ccText(c.budget)} last</b><span>Crib Credits are your innovation budget for all three years. Spend them all in Year 1 and Years 2 and 3 run dry.</span></div>
            <div class="step"><span class="n">Step 3</span><b>Respond to events</b><span>Something happens every quarter. Your call moves the metrics.</span></div>
            <div class="step"><span class="n">Step 4</span><b>Average 90 to win</b><span>Below ${E.FIRE_BELOW} at any point and the board asks for your hard hat back.</span></div>
          </div>` })}
          ${sec({ n: '02', title: 'Your four metrics', intro: `Average <b>90 or more</b> across all four when your three years are up to win.`, body: `<div class="metric-legend">${E.METRICS.map((m) => `<div style="--c:${MHEX[m.id]}"><b>${m.name}</b><span>${m.desc}</span></div>`).join('')}</div>` })}
          ${sec({ n: '03', title: 'Unearthed is on your side', band: true, body: `<div class="ufeatures">
            <div>${A.umark()}<b>${E.VENDOR_CHECKS} vendor checks</b><p>Stuck on an initiative or an event? Use a vendor check and Unearthed grades every option A, B or C on the evidence behind it, the same way we grade technology for mining companies.</p></div>
            <div>${A.umark()}<b>Unearthed services</b><p>${uBadge()} marks options that Unearthed delivers for real mining companies, such as open innovation challenges and problem framing with site teams.</p></div>
            <div>${A.umark()}<b>Where Unearthed fits</b><p>After every event you will see how Unearthed handles that situation in real life.</p></div>
          </div>
          <div><button class="btn" data-a="plan">Plan Year 1</button></div>` })}
        </main></div>`;
    },

    plan() {
      const y = S.year;
      const mine = E.fundedThisYear(S);
      const full = mine.length >= E.MAX_PER_YEAR;
      const notice = y === 1
        ? `Your ${ccText(co().budget)} have to last all three years. Initiatives start paying off in the first quarter after you fund them and keep working until your tenure ends, so early bets have longer to pay back.`
        : `Year ${y - 1} is done. You have ${ccText(S.budget)} left to cover ${y === 3 ? 'your final year' : 'the next two years'}. Initiatives you already funded keep running.`;
      const cards = E.INITIATIVES.map((init) => {
        const f = S.funded.find((x) => x.id === init.id);
        const costs = init.opts.map((o, i) => E.costOf(S, init.id, i));
        const lo = Math.min(...costs), hi = Math.max(...costs);
        const range = `<span class="range">${lo <= 0 ? 'Free' : cc(lo)} to ${cc(hi)}</span>`;
        const hasU = init.opts.some((o) => o.u);
        const checked = S.checked.includes(init.id) ? '<span class="state">Vendor check done</span>' : '';
        if (f && f.year < y) {
          return `<button class="card locked" disabled><span class="ic">${A.icon(init.icon)}</span><span class="txt"><span class="nm">${init.name}</span><span class="pick">${init.opts[f.opt].t}</span><span class="state">Running since Year ${f.year}</span></span></button>`;
        }
        if (f) {
          return `<button class="card funded" data-a="card" data-id="${init.id}"><span class="ic">${A.icon(init.icon)}</span><span class="txt"><span class="nm">${init.name}</span><span class="pick">${init.opts[f.opt].t}</span><span class="state">Funded for Year ${y}. Tap to change.</span></span></button>`;
        }
        return `<button class="card ${full ? 'dim' : ''}" data-a="card" data-id="${init.id}" ${full ? 'disabled' : ''}><span class="ic">${A.icon(init.icon)}</span><span class="txt"><span class="nm">${init.name}</span>${range}${hasU ? uBadge() : ''}${checked}</span></button>`;
      }).join('');
      const slots = [0, 1, 2].map((i) => `<span class="slot ${i < mine.length ? 'on' : ''}"></span>`).join('');
      return `${hud()}
        <div class="wrap"><main class="screen">
          ${sec({ n: `Year ${y}`, title: `Choose up to three initiatives for Year ${y}`, intro: notice, band: true, body: `<div class="grid">${cards}</div>` })}
        </main></div>
        <div class="dock"><div class="dock-inner">
          <div class="row"><div class="slots" aria-hidden="true">${slots}</div><span>${mine.length} of 3 picked${full ? '. That is your limit for this year.' : ''}</span></div>
          <button class="btn" data-a="startYear">Start Year ${y}</button>
        </div></div>
        ${V.modal ? modal() : ''}`;
    },

    event() {
      const ev = E.currentEvent(S);
      const key = `ev:${ev.id}`;
      const graded = S.checked.includes(key);
      const g = graded ? E.grades(ev.choices) : null;
      return `${hud()}
        <div class="wrap"><main class="screen">
          ${sec({ n: `Y${S.year} Q${S.quarter}`, title: ev.title, intro: ev.body, band: true, body: `
            <div class="choices" role="group" aria-label="Your response">
              ${V.order.map((i) => `<button class="choice" id="choice-${i}" data-a="choose" data-i="${i}" aria-pressed="${V.pending === i}"><span>${ev.choices[i].t}</span><span class="tags">${ev.choices[i].u ? uBadge() : ''}${g ? gradeChip(g[i]) : ''}</span></button>`).join('')}
            </div>
            ${checkPanel(key, graded)}
            <div><button class="btn" data-a="lock" ${V.pending == null ? 'disabled' : ''}>Lock it in</button></div>` })}
        </main></div>`;
    },

    outcome() {
      const o = V.outcome;
      const ev = E.eventById(o.ev);
      const ch = ev.choices[o.choice];
      const running = S.funded.length;
      const next = S.status === 'fired' ? 'Face the board' : S.status === 'done' ? 'See your scorecard' : S.quarter === 0 ? `Plan Year ${S.year}` : 'Next quarter';
      const budgetChange = ch.b ? E.credits(S, ch.b) : 0;
      return `${hud()}
        <div class="wrap"><main class="screen">
          ${sec({ n: `Y${o.year} Q${o.quarter}`, title: ev.title, band: true, body: `
            <p><b>You chose:</b> ${ch.t}</p>
            <p class="quote">${ch.r}</p>
            ${budgetChange ? `<p><span class="chip ${budgetChange < 0 ? 'bad' : 'good'}">${budgetChange < 0 ? '−' : '+'}${ccText(budgetChange)}</span></p>` : ''}
            <div class="deltas">${E.METRICS.map((m) => `<div class="delta" style="--c:${MHEX[m.id]}"><span class="t">${m.name}</span><span class="v">${Math.round(o.after[m.id])}</span>${sign(o.after[m.id] - o.before[m.id])}</div>`).join('')}</div>
            <p class="hint">${running ? `These changes include the ${running} initiative${running > 1 ? 's' : ''} you have running.` : 'You have no initiatives running, so only your decision moved the metrics this quarter.'}</p>
            <div class="fit">${A.umark()}<div><span class="label">Where Unearthed fits</span><p>${ev.fit}</p></div></div>` })}
          ${sec({ n: 'So far', title: 'Your metrics', body: `${chart(S.history)}<div><button class="btn" data-a="next">${next}</button></div>` })}
        </main></div>`;
    },

    end() {
      const fired = S.status === 'fired';
      const last = latest();
      const score = E.avg(last);
      const t = E.tier(score);
      const best = store.get()[S.companyId] || 0;
      const verdicts = {
        elite: 'Your sites are adopting new technology, innovators want to work with you and the board can see the value. That is open innovation working.',
        high: 'Solid work. Your pipeline is flowing and some technology is sticking on site. A few weak spots kept you from the top.',
        medium: 'Some wins, but too much of your work stayed in pilots and slide decks. The drivers below show what held you back.',
        low: 'The board is not convinced. Innovation stayed a side show. The drivers below show where it went wrong.',
      };
      const headlines = { elite: 'You struck the mother lode.', high: 'You struck a rich vein.', medium: 'You found low-grade ore.', low: 'Your tenure went straight to tailings.' };
      const lastLog = S.log[S.log.length - 1];
      const nodes = Object.keys(E.NODES).map((k) => ({ k, v: S.nodes[k] })).sort((a, b) => b.v - a.v);
      const strong = nodes[nodes.length - 1].v >= 80;
      const picks = [];
      for (const n of nodes.slice().reverse()) {
        if (picks.length === 2) break;
        const h = U.help[n.k];
        if (!picks.some((p) => p.h.form === h.form)) picks.push({ ...n, h });
      }
      const hurtMost = (k) => {
        let worst = null;
        for (const f of S.funded) {
          const o = E.initById(f.id).opts[f.opt];
          const d = (o.e[k] || 0) * (E.YEARS - f.year + 1) * 4 * 0.85;
          if (d < 0 && (!worst || d < worst.d)) worst = { d, text: `${E.initById(f.id).name}: ${o.t}`, when: `Year ${f.year}` };
        }
        for (const l of S.log) {
          const c = E.eventById(l.event).choices[l.choice];
          const d = c.e[k] || 0;
          if (d < 0 && (!worst || d < worst.d)) worst = { d, text: `${E.eventById(l.event).title}: ${c.t}`, when: `Y${l.year} Q${l.quarter}` };
        }
        return worst;
      };
      const usedStages = new Set(picks.flatMap((p) => p.h.stages));
      if (strong) usedStages.add('scout');
      const firstForm = strong ? U.forms.review : U.forms[picks[0].h.form];
      const planIntro = fired
        ? 'The board let you go, but these are the two areas we would fix first at a real mining company.'
        : strong
          ? 'You ran a strong program. This is how we help mining companies stay ahead of the field.'
          : `Your weakest areas were ${E.NODES[picks[0].k].toLowerCase()} and ${E.NODES[picks[1].k].toLowerCase()}. This is how we would work on them with a real mining company.`;
      const helpCards = (strong
        ? [{ k: null, v: null, h: { form: 'review', how: 'We review relevant developments against your priorities at an agreed interval, so you see technologies as they emerge rather than when a competitor announces them.' } },
           { k: null, v: null, h: { form: 'challenge', how: 'When a new problem comes up, we put it to a global network of more than 10,000 innovators, including technology proven outside mining.' } }]
        : picks).map((p) => {
          const f = U.forms[p.h.form];
          const hurt = p.k ? hurtMost(p.k) : null;
          return `<div class="help">
            <div class="help-top">${p.k ? `<span class="label">You scored ${Math.round(p.v)} on</span><h3>${E.NODES[p.k]}</h3>` : `<span class="label">To stay ahead</span><h3>${f.name}</h3>`}
              ${hurt ? `<p class="hurt">Cost you here: <b>${hurt.text}</b> <span class="when">${hurt.when}</span></p>` : p.k ? `<p class="hurt">${E.NODE_TIPS[p.k]}</p>` : ''}</div>
            <div class="help-body">
              ${uBadge('How Unearthed helps')}
              <b class="form">${f.name}</b>
              <p>${p.h.how}</p>
              <dl><div><dt>What it involves</dt><dd>${f.what}</dd></div><div><dt>Outcome</dt><dd>${f.outcome}</dd></div><div><dt>Typical timing</dt><dd>${f.timing}</dd></div></dl>
            </div>
          </div>`;
        }).join('');
      const uTag = (x) => (x.u ? ` ${uBadge()}` : '');
      const verdict = (chosenImpact, impacts) => {
        const max = Math.max(...impacts);
        if (chosenImpact >= max - 1e-9) return '<span class="chip good">Strong call</span>';
        if (chosenImpact > 0) return '<span class="chip orange">Partial credit</span>';
        return '<span class="chip bad">Backfired</span>';
      };
      const bestOf = (items) => items.reduce((b, it) => (E.impact(it.e) > E.impact(b.e) ? it : b));
      const inits = S.funded.slice().sort((a, b) => a.year - b.year).map((f) => {
        const init = E.initById(f.id);
        const opt = init.opts[f.opt];
        const b = bestOf(init.opts);
        return `<div class="dec"><span class="what">${init.name}: ${opt.t} <span class="when">Year ${f.year}</span>${uTag(opt)}</span>${verdict(E.impact(opt.e), init.opts.map((o) => E.impact(o.e)))}
          <span class="why">${opt.n}${b !== opt ? ` Stronger choice: <b>${b.t}</b>.` : ''}</span></div>`;
      }).join('') || '<p>You did not fund any initiatives. Events alone cannot move a company.</p>';
      const events = S.log.map((l) => {
        const ev = E.eventById(l.event);
        const ch = ev.choices[l.choice];
        const b = bestOf(ev.choices);
        return `<div class="dec"><span class="what">${ev.title}: ${ch.t} <span class="when">Y${l.year} Q${l.quarter}</span>${uTag(ch)}</span>${verdict(E.impact(ch.e), ev.choices.map((c) => E.impact(c.e)))}
          <span class="why">${ch.r}${b !== ch ? ` Stronger choice: <b>${b.t}</b>.` : ''}</span></div>`;
      }).join('');
      const used = E.VENDOR_CHECKS - S.checks;
      const navItems = [['s-years', 'Your three years'], ['s-drivers', 'What drove your score'], ['s-plan', 'Where Unearthed would start'], ['s-contact', 'Talk to us'], ['s-decisions', 'Every decision']];
      return `<div class="wrap">${brandline()}
        <main class="screen">
          <div class="score-hero">
            <div class="portrait">${mascot(S.companyId, fired || t.id === 'low' ? 'sad' : 'happy')}</div>
            <div class="stack">
              <span class="label">${fired ? `Board meeting · Year ${lastLog.year}, quarter ${lastLog.quarter}` : `${esc(S.player)} · Chief Innovation Officer scorecard`}</span>
              <h2>${fired ? 'Please hand back your hard hat.' : headlines[t.id]}</h2>
              <p>${fired ? 'Your metrics fell below what the board will accept and they have asked you to step aside. Luckily this was only a game. See what went wrong, then try again.' : verdicts[t.id]}</p>
              <div class="stats">
                <div><span class="label">${fired ? 'Average when fired' : 'Final score'}</span><span class="big">${Math.round(score)}<small>%</small></span></div>
                <div><span class="label">Performance</span><span class="v">${fired ? 'Fired' : t.name}</span></div>
                <div><span class="label">Award</span><span class="v">${fired ? 'The Empty Core Tray' : t.award}</span></div>
                <div><span class="label">Vendor checks used</span><span class="v">${used} of ${E.VENDOR_CHECKS}</span></div>
                ${best ? `<div><span class="label">Your best at ${co().name}</span><span class="v">${Math.round(best)}%</span></div>` : ''}
              </div>
            </div>
          </div>
          <nav class="secnav" aria-label="Scorecard sections">${navItems.map(([id, label], i) => `<button data-a="jump" data-to="${id}"><span>0${i + 1}</span>${label}</button>`).join('')}</nav>
          ${sec({ id: 's-years', n: '01', title: `Your ${fired ? 'tenure' : 'three years'}`, band: true, body: chart(S.history) })}
          ${sec({ id: 's-drivers', n: '02', title: 'What drove your score', intro: 'Eight hidden drivers sit behind the four metrics. Every initiative and decision moved some of them.', body: `<div class="drivers">${nodes.map((n) => `<div class="drv" style="--c:${n.v >= 75 ? 'var(--orange)' : n.v >= 50 ? 'var(--amber)' : 'var(--m-buyin)'}"><span class="nm">${E.NODES[n.k]}</span><span class="num">${Math.round(n.v)}</span><div class="track"><div class="fill" style="width:${n.v}%"></div></div></div>`).join('')}</div>` })}
          ${sec({ id: 's-plan', n: '03', title: `Where Unearthed would start with you: ${fired ? 'what we would fix first' : strong ? 'keep your lead' : 'from game to real sites'}`, intro: planIntro, band: true, cls: 'plan', body: `
            <ol class="stages">${U.stages.map((st) => `<li class="${usedStages.has(st.id) ? 'on' : ''}"><span class="n">${st.n}</span><b>${st.name}</b><span>${st.title}</span></li>`).join('')}</ol>
            <div class="helps">${helpCards}</div>
            <div class="statrow">${U.stats.map((x) => `<div><span class="stat">${x.n}</span><span>${x.label}. ${x.why}</span></div>`).join('')}</div>` })}
          <section class="sec" id="s-contact">
            <div class="cta">
              <div class="stack">
                <img src="${LOGO}" alt="Unearthed">
                <h2>${firstForm.cta}.</h2>
                <p>Unearthed is a specialist mining and metals technology advisory firm in Perth, Western Australia. We find, assess and pilot technology from across mining and adjacent industries, so trials progress to deployment.</p>
              </div>
              <div class="actions">
                <a class="btn" href="${U.contact.web}" target="_blank" rel="noopener">Talk to Unearthed</a>
                <div class="email"><span>Or email</span> <span id="u-email" class="addr">${U.contact.email}</span> <button class="copy-btn" id="copy-email" data-a="copyEmail">Copy</button></div>
              </div>
            </div>
          </section>
          ${sec({ id: 's-decisions', n: '05', title: 'Every decision you made', intro: `${S.funded.length} initiatives and ${S.log.length} event calls, each with how it played out.`, band: true, body: `
            <details class="more">
              <summary>Show all ${S.funded.length + S.log.length} decisions</summary>
              <div class="stack-lg">
                <div class="stack"><h3>Your initiatives</h3><div class="decisions">${inits}</div></div>
                <div class="stack"><h3>Your calls</h3><div class="decisions">${events}</div></div>
              </div>
            </details>
            <div class="row"><button class="btn" data-a="again">Play again</button><button class="btn ghost" data-a="other">Try another company</button></div>` })}
        </main></div>`;
    },

    howto() {
      const rows = E.COMPANIES.map((c) => `<tr><td><b>${c.name}</b></td><td>${c.size}</td><td>${cc(c.budget)}</td><td>${c.difficulty}</td></tr>`).join('');
      return `<div class="wrap">${brandline()}
        <main class="screen">
          ${backBar()}
          <div class="pagehead"><span class="label">How to play</span><h1>Lead open innovation for three years. Keep the board happy.</h1>
            <p class="lede">You are the new Chief Innovation Officer at a mining company. Fund initiatives, respond to events and use Unearthed's help to get new technology running on your sites. A game takes about 10 minutes.</p></div>
          ${sec({ n: '01', title: 'Pick a company', band: true, intro: 'Each company has a different budget of Crib Credits for your whole tenure, and a different starting position.', body: `<div class="tablewrap"><table class="tbl"><thead><tr><th>Company</th><th>Type</th><th>Crib Credits</th><th>Difficulty</th></tr></thead><tbody>${rows}</tbody></table></div>
            <p>Bigger companies have more credits, but they start with more bureaucracy, and some of their drivers slip every quarter unless you act.</p>` })}
          ${sec({ n: '02', title: 'Each year: fund up to three initiatives', body: `<div class="steps">
            <div class="step"><span class="n">Cost</span><b>Paid in Crib Credits</b><span>Each initiative has four or five approaches at different prices. Some are free and one gives credits back.</span></div>
            <div class="step"><span class="n">Timing</span><b>Effects build every quarter</b><span>An initiative starts working the quarter after you fund it and keeps working until you leave. Year 1 bets get 12 quarters; Year 3 bets get 4.</span></div>
            <div class="step"><span class="n">Budget</span><b>Credits last all tenure</b><span>There is no top-up each year. Spend everything in Year 1 and you will watch Years 2 and 3 from the sidelines.</span></div>
            <div class="step"><span class="n">Trap</span><b>Price is not quality</b><span>The most expensive approach is often not the best. Some of the strongest moves are cheap.</span></div>
          </div>` })}
          ${sec({ n: '03', title: 'Each quarter: respond to an event', band: true, body: `<div class="steps three">
            <div class="step"><span class="n">Choose</span><b>Three ways to respond</b><span>A site GM blocks a pilot, a startup runs out of cash, the copper price crashes. Each event has three responses and no cost.</span></div>
            <div class="step"><span class="n">See</span><b>What happened and why</b><span>After you choose, you see the result and how your four metrics moved, including the effect of your running initiatives.</span></div>
            <div class="step"><span class="n">Learn</span><b>Where Unearthed fits</b><span>Every outcome ends with how Unearthed handles that situation for real mining companies.</span></div>
          </div>` })}
          ${sec({ n: '04', title: 'Use Unearthed', body: `<div class="ufeatures">
            <div>${A.umark()}<b>${E.VENDOR_CHECKS} vendor checks per tenure</b><p>Use one on an initiative or an event and every option is graded on the evidence behind it: ${gradeChip('A')} ${gradeChip('B')} ${gradeChip('C')}</p></div>
            <div>${A.umark()}<b>Unearthed services</b><p>${uBadge()} marks the options Unearthed delivers for real mining companies. They are worth a close look.</p></div>
            <div>${A.umark()}<b>Your plan at the end</b><p>Your scorecard maps your weakest areas to the Unearthed services that address them.</p></div>
          </div>` })}
          ${sec({ n: '05', title: 'How you are scored', band: true, intro: 'Four metrics, each from 0 to 100, start near 60. Behind them sit eight hidden drivers that your decisions move.', body: `
            <div class="metric-legend">${E.METRICS.map((m) => `<div style="--c:${MHEX[m.id]}"><b>${m.name}</b><span>${m.desc}</span></div>`).join('')}</div>
            <div class="tablewrap"><table class="tbl"><thead><tr><th>Average of the four metrics</th><th>Result</th></tr></thead><tbody>
              <tr><td>90 or more at the end</td><td><b>Elite.</b> You win: The Mother Lode</td></tr>
              <tr><td>75 to 89</td><td><b>High.</b> A Rich Vein</td></tr>
              <tr><td>55 to 74</td><td><b>Medium.</b> Low-Grade Ore</td></tr>
              <tr><td>Below 55</td><td><b>Low.</b> Straight to Tailings</td></tr>
              <tr><td>Below ${E.FIRE_BELOW} at any point</td><td><b>Fired.</b> Hand back your hard hat</td></tr>
            </tbody></table></div>
            <p>Random choices almost never win. Good players spread their credits across the three years, fix the basics early and treat innovators and site teams well.</p>` })}
          ${sec({ n: '06', title: 'Ready?', body: `<div class="row">${inGame() ? '<button class="btn" data-a="back">Back to your game</button>' : '<button class="btn" data-a="start">Start your tenure</button>'}<button class="btn ghost" data-a="page" data-p="approach">Read the approach behind the game</button></div>` })}
        </main></div>`;
    },

    approach() {
      const W = {};
      for (const m of E.METRICS) for (const k in m.w) (W[k] = W[k] || []).push(`${m.name} ${Math.round(m.w[k] * 100)}%`);
      const driverRows = Object.keys(E.NODES).map((k) => `<tr><td><b>${E.NODES[k]}</b></td><td>${W[k].join(', ')}</td><td>${E.NODE_TIPS[k]}</td></tr>`).join('');
      return `<div class="wrap">${brandline()}
        <main class="screen">
          ${backBar()}
          <div class="pagehead"><span class="label">The approach behind the game</span><h1>How Unearthed improves innovation portfolio outcomes.</h1>
            <p class="lede">Innovation Rush is built on how Unearthed runs open innovation for mining and metals companies. Portfolios underperform for familiar reasons: the problem is vague, the search stops at known suppliers, claims are hard to check and pilots never scale. We address these with three practices: open innovation, open assessment through challenges, and market intelligence.</p></div>
          ${sec({ n: '01', title: 'Open innovation: search beyond the usual suppliers', band: true, body: `<div class="split">
            <div class="stack"><p>Open innovation extends your search beyond internal teams and known vendors to ideas, technologies and practices from a global ecosystem: universities, research institutions, startups, scale-ups, established vendors and even competitors.</p>
              <p>Unearthed has built that network over more than a decade of challenges. Our commercial relationships are with industrial companies only, so technology developers share performance and cost data with us that is not published. We work alongside internal R&D teams, extending their search rather than duplicating it.</p></div>
            <div class="facts-card"><span class="stat">50%+</span><span>of challenge submissions come from outside the mining sector, which widens the pool of possible solutions.</span>
              <span class="label">In the game</span><p>Ecosystem reach and Innovator trust. Fair IP terms, fast payment and replying to every submission keep the best innovators coming back.</p></div>
          </div>` })}
          ${sec({ n: '02', title: 'Open assessment through challenges', intro: 'A challenge puts one defined problem to the global network, then assesses the responses side by side with your teams. You see many approaches against the same problem before committing to one.', body: `
            <ol class="stages four">
              <li><span class="n">01</span><b>Impactful problems</b><span>A verified problem, defined with the people who live it</span></li>
              <li><span class="n">02</span><b>Global capability</b><span>Demonstrated capability sourced from inside and outside mining</span></li>
              <li><span class="n">03</span><b>Open to solutions</b><span>An open, transparent process anyone in the world can submit to</span></li>
              <li><span class="n">04</span><b>Support to move forward</b><span>Each challenge ends with tangible action on the right solutions</span></li>
            </ol>
            <div class="case"><span class="label">Published case study</span><h3>OZ Minerals Explorer Challenge</h3>
              <p>OZ Minerals opened its exploration data to a global challenge with a $1 million prize. The crowdsourced approaches cut the time to generate quality targets by more than 75%, with 120 new data science approaches to exploration developed, while increasing confidence in the targets.</p>
              <span class="hint">Source: unearthed.solutions, Challenges.</span></div>
            <p class="ingame"><b>In the game:</b> Problem clarity, Site champions and Data and site access. A challenge with a real site problem and real data beats an ideas portal every time.</p>` })}
          ${sec({ n: '03', title: 'Market intelligence: know what exists before you commit', band: true, intro: 'Not every problem needs a challenge. Often the technology already exists, and the job is to find it, check it and decide fast.', body: `
            <div class="steps">
              <div class="step"><span class="n">01</span><b>Build understanding</b><span>Domain knowledge applied to the complexities of your specific problem.</span></div>
              <div class="step"><span class="n">02</span><b>Tailor and deep dive</b><span>A scan tailored to your strategic needs, using curated data and the global ecosystem.</span></div>
              <div class="step"><span class="n">03</span><b>Insights and impacts</b><span>The most relevant, high-value findings, with the impact of each opportunity measured.</span></div>
              <div class="step"><span class="n">04</span><b>Deliver and embed</b><span>Findings reviewed with your teams, with support for further questions.</span></div>
            </div>
            <div class="forms">${['vendor', 'options', 'review'].map((k) => { const f = U.forms[k]; return `<div class="form-card">${uBadge(f.name)}<p>${f.what}</p><dl><div><dt>Outcome</dt><dd>${f.outcome}</dd></div><div><dt>Timing</dt><dd>${f.timing}</dd></div></dl></div>`; }).join('')}</div>
            <p>Every claim is graded by source: <b>A</b> independently verified, <b>B</b> operator-reported, <b>C</b> company-supplied. You see what has been proven, and at what scale, before committing time to a trial. Unearthed's Launched list also profiles five new mining technologies every week.</p>
            <p class="ingame"><b>In the game:</b> vendor checks and Portfolio focus. Fund fewer things, on better evidence, with clear kill criteria.</p>` })}
          ${sec({ n: '04', title: 'From pilot to production', intro: 'The portfolio only creates value when technology runs on site. Technical, commercial and adoption diligence happens upfront, so trials progress to deployment.', body: `
            <ol class="stages">${U.stages.map((st) => `<li class="on"><span class="n">${st.n}</span><b>${st.name}</b><span>${st.title}</span></li>`).join('')}</ol>
            <p class="ingame"><b>In the game:</b> Pilot-to-production pathway and Safety to experiment. Light procurement, a scale-up budget, an executive owner and permission to fail move pilots out of purgatory.</p>` })}
          ${sec({ n: '05', title: 'How the game turns this into a score', band: true, intro: 'Eight hidden drivers stand for the practices above. Each metric is a weighted mix of drivers; the table shows where each driver counts.', body: `
            <div class="tablewrap"><table class="tbl"><thead><tr><th>Driver</th><th>Feeds</th><th>What moves it</th></tr></thead><tbody>${driverRows}</tbody></table></div>
            <p class="hint">The model is a simplification built from Unearthed's experience running challenges, assessments and pilots with mining companies. The weights are our judgement, not a statistical study. Like any good game, it is meant to make you think about the decisions you make in real life.</p>` })}
          ${sec({ n: '06', title: 'Put it to work', body: `<div class="cta">
              <div class="stack"><img src="${LOGO}" alt="Unearthed"><h2>Talk to us about your innovation portfolio.</h2>
                <p>Unearthed is a specialist mining and metals technology advisory firm in Perth, Western Australia. We find, assess and pilot technology from across mining and adjacent industries.</p></div>
              <div class="actions"><a class="btn" href="${U.contact.web}" target="_blank" rel="noopener">Talk to Unearthed</a>
                <div class="email"><span>Or email</span> <span id="u-email" class="addr">${U.contact.email}</span> <button class="copy-btn" id="copy-email" data-a="copyEmail">Copy</button></div></div>
            </div>
            <div class="row">${inGame() ? '<button class="btn" data-a="back">Back to your game</button>' : '<button class="btn" data-a="start">Play Innovation Rush</button>'}<button class="btn ghost" data-a="page" data-p="howto">How to play</button></div>` })}
        </main></div>`;
    },
  };

  function modal() {
    const init = E.initById(V.modal);
    const cur = S.funded.find((f) => f.id === init.id && f.year === S.year);
    const avail = S.budget + (cur ? E.costOf(S, init.id, cur.opt) : 0);
    const order = init.opts.map((o, i) => ({ o, i, c: E.costOf(S, init.id, i) })).sort((a, b) => a.c - b.c);
    const sel = V.pending;
    const tooDear = sel != null && E.costOf(S, init.id, sel) > avail;
    const ok = sel != null && !tooDear && !(cur && cur.opt === sel);
    const graded = S.checked.includes(init.id);
    const g = graded ? E.grades(init.opts) : null;
    return `<div class="overlay" data-a="closeBg"><div class="modal" data-a="noop" role="dialog" aria-modal="true" aria-labelledby="mtitle">
      <div class="modal-head"><span class="ic">${A.icon(init.icon)}</span><h2 id="mtitle">${init.name}</h2><button class="x" id="modal-close" data-a="close" aria-label="Close">×</button></div>
      <p>${init.desc}</p>
      <fieldset class="opts"><legend class="label">Choose your approach</legend>
        ${order.map(({ o, i, c }) => {
          const afford = c <= avail;
          const cost = c < 0 ? `<span class="back">+${cc(c)} back</span>` : c === 0 ? 'Free' : cc(c);
          return `<label class="opt ${sel === i ? 'sel' : ''} ${afford ? '' : 'no'}" for="opt-${init.id}-${i}"><input type="radio" name="opt" id="opt-${init.id}-${i}" value="${i}" ${sel === i ? 'checked' : ''}><span class="otext">${o.t}<span class="tags">${o.u ? uBadge() : ''}${g ? gradeChip(g[i]) : ''}</span></span><span class="cost">${cost}</span></label>`;
        }).join('')}
      </fieldset>
      ${tooDear ? `<p class="warn">Not enough Crib Credits for this option. You have ${ccText(avail)} to spend.</p>` : ''}
      ${checkPanel(init.id, graded)}
      <div class="row" style="justify-content:flex-end">
        ${cur ? '<button class="btn ghost" data-a="remove">Remove</button>' : ''}
        <button class="btn" data-a="confirm" ${ok ? '' : 'disabled'}>${cur ? 'Change approach' : 'Fund this'}</button>
      </div>
    </div></div>`;
  }

  // ---------- rendering and actions ----------

  function render(scroll) {
    const focusId = document.activeElement && document.activeElement.id;
    app.innerHTML = views[V.view]();
    if (scroll) window.scrollTo(0, 0);
    if (focusId && document.getElementById(focusId)) document.getElementById(focusId).focus({ preventScroll: true });
    else if (V.modal) {
      const first = app.querySelector('.modal input:checked') || app.querySelector('.modal input');
      if (first) first.focus({ preventScroll: true });
    }
  }

  function toEvent() {
    V.view = 'event';
    V.pending = null;
    V.order = E.shuffle([0, 1, 2]);
  }

  function newRun(companyId) {
    S = E.newGame(companyId, V.name.trim() || 'Explorer');
    V = { ...V, companyId, modal: null, pending: null, outcome: null, view: 'welcome' };
  }

  const actions = {
    start() { V.view = 'name'; V.back = null; return 'scroll'; },
    home() { V.view = 'title'; V.back = null; return 'scroll'; },
    page(el) {
      if (!['howto', 'approach'].includes(V.view)) V.back = V.view;
      V.modal = null; V.pending = null;
      V.view = el.dataset.p;
      return 'scroll';
    },
    back() { V.view = V.back || 'title'; V.back = null; return 'scroll'; },
    name() { if (!V.name.trim()) return false; V.view = 'company'; return 'scroll'; },
    company(el) { V.companyId = el.dataset.id; },
    accept() { if (!V.companyId) return false; newRun(V.companyId); return 'scroll'; },
    plan() { V.view = 'plan'; return 'scroll'; },
    card(el) {
      V.modal = el.dataset.id;
      const cur = S.funded.find((f) => f.id === V.modal && f.year === S.year);
      V.pending = cur ? cur.opt : null;
    },
    close() { V.modal = null; V.pending = null; },
    closeBg(el, e) { if (e.target !== el) return false; V.modal = null; V.pending = null; },
    noop() { return false; },
    useCheck(el) { if (!E.useCheck(S, el.dataset.key)) return false; },
    confirm() {
      const id = V.modal;
      const cur = S.funded.find((f) => f.id === id && f.year === S.year);
      if (cur) E.unfund(S, id);
      if (!E.fund(S, id, V.pending) && cur) E.fund(S, id, cur.opt);
      V.modal = null; V.pending = null;
    },
    remove() { E.unfund(S, V.modal); V.modal = null; V.pending = null; },
    startYear() { E.startYear(S); toEvent(); return 'scroll'; },
    choose(el) { V.pending = +el.dataset.i; },
    lock() {
      if (V.pending == null) return false;
      const year = S.year, quarter = S.quarter;
      const r = E.playQuarter(S, V.pending);
      V.outcome = { ev: r.ev.id, choice: V.pending, before: r.before, after: r.after, year, quarter };
      V.view = 'outcome';
      if (S.status === 'done') store.set(S.companyId, E.avg(latest()));
      return 'scroll';
    },
    next() {
      if (S.status !== 'playing') V.view = 'end';
      else if (S.quarter === 0) V.view = 'plan';
      else toEvent();
      return 'scroll';
    },
    jump(el) {
      const target = document.getElementById(el.dataset.to);
      if (target) target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      return false;
    },
    again() { newRun(S.companyId); return 'scroll'; },
    copyEmail(el) {
      const addr = U.contact.email;
      const done = () => { el.textContent = 'Copied'; };
      const fallback = () => { const r = document.createRange(); r.selectNodeContents(document.getElementById('u-email')); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); el.textContent = 'Selected'; };
      try { navigator.clipboard.writeText(addr).then(done, fallback); } catch { fallback(); }
      return false;
    },
    other() { S = null; V.companyId = null; V.view = 'company'; return 'scroll'; },
  };

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-a]');
    if (!el || !app.contains(el) || el.disabled) return;
    const res = actions[el.dataset.a]?.(el, e);
    if (res === false) return;
    render(res === 'scroll');
  });

  document.addEventListener('change', (e) => {
    if (e.target.name === 'opt') { V.pending = +e.target.value; render(); }
  });

  document.addEventListener('input', (e) => {
    if (e.target.id === 'player') {
      V.name = e.target.value;
      const b = document.getElementById('name-next');
      if (b) b.disabled = !V.name.trim();
    }
  });

  document.addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.target.id === 'nameform' && actions.name() !== false) render(true);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && V.modal) { V.modal = null; V.pending = null; render(); }
  });

  // Keep a game in progress across live updates of the page. Older saved games (before Crib Credits) start fresh.
  try { window.claude?.hot?.snapshot?.(() => ({ S, V })); } catch { /* not in a viewer */ }
  const boot = (data) => {
    if (data && data.V && data.V.view && (!data.S || Array.isArray(data.S.checked))) { S = data.S; V = data.V; }
    render();
  };
  if (window.claude?.hot?.ready) window.claude.hot.ready(boot);
  else boot(window.claude?.hot?.data ?? {});
})();
