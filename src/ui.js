// Innovation Rush: screens and interaction. Renders the whole app from state on every change.
(() => {
  const E = ENGINE, A = ART;
  const app = document.getElementById('app');
  const BEST_KEY = 'innovation-rush-best';
  const MCOL = { eco: 'var(--m-eco)', adopt: 'var(--m-adopt)', value: 'var(--m-value)', buyin: 'var(--m-buyin)' };
  const MHEX = { eco: '#FF6600', adopt: '#333333', value: '#FFA627', buyin: '#656565' };

  let S = null; // engine game state
  let V = { view: 'title', name: '', companyId: null, modal: null, pending: null, order: null, outcome: null };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const coById = (id) => E.COMPANIES.find((c) => c.id === id);
  const co = () => coById(S ? S.companyId : V.companyId);
  const mascot = (id, mood) => A.MASCOTS[coById(id).mascot](mood);
  const latest = () => S.history[S.history.length - 1];
  const money = (pct) => {
    const m = (Math.abs(pct) / 100) * co().budget;
    if (m >= 1) return `$${m >= 10 ? Math.round(m) : m.toFixed(1).replace(/\.0$/, '')}M`;
    return `$${Math.round(m * 1000)}K`;
  };
  const pips = (init) => {
    const max = Math.max(...init.opts.map((o) => o.c));
    const n = max <= 10 ? 1 : max <= 25 ? 2 : max <= 40 ? 3 : 4;
    return `<span class="pips" aria-label="Cost level ${n} of 4">${'$'.repeat(n)}<i>${'$'.repeat(4 - n)}</i></span>`;
  };
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
  const LOGO_WHITE = '__LOGO_WHITE__';
  const brandline = () => `<header class="brandline"><a class="logo" href="https://unearthed.solutions" target="_blank" rel="noopener"><img src="${LOGO}" alt="Unearthed"></a><span class="gamename"><b>Innovation Rush</b> · A game by Unearthed</span></header>`;

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
      const init = E.initById(V.modal);
      const cur = S.funded.find((f) => f.id === V.modal && f.year === S.year);
      const after = S.budget + (cur ? init.opts[cur.opt].c : 0) - init.opts[V.pending].c;
      fill = Math.min(after, S.budget); ghost = Math.max(after, S.budget);
    }
    const m = latest();
    const where = S.quarter === 0 ? `Year ${S.year}, planning` : `Year ${S.year}, quarter ${S.quarter}`;
    return `<div class="hud"><div class="hud-inner">
      <div class="who">${mascot(S.companyId)}<div style="min-width:0"><div class="name">${esc(S.player)}</div><div class="co">Chief Innovation Officer, ${c.name}</div></div></div>
      <div class="benches" role="img" aria-label="${where}. ${played} of 12 quarters played.">${years}</div>
      <div class="budget"><div class="amt">${money(S.budget)} <small>left of $${c.budget}M</small></div>
        <div class="track"><div class="ghost" style="width:${Math.min(100, Math.max(0, ghost))}%"></div><div class="fill" style="width:${Math.min(100, Math.max(0, fill))}%"></div></div></div>
      <div class="minimetrics">${E.METRICS.map((mt) => `<div class="mm" style="--c:${MCOL[mt.id]}"><div class="top"><span>${mt.name}</span><span>${Math.round(m[mt.id])}</span></div><div class="track"><div class="fill" style="width:${m[mt.id]}%"></div></div></div>`).join('')}</div>
    </div></div>`;
  }

  function chart(hist) {
    const W = 600, H = 250, L = 34, R = W - 12, T = 14, B = H - 30;
    const x = (i) => L + ((R - L) * i) / 12;
    const y = (v) => B - ((B - T) * v) / 100;
    let g = '';
    for (const v of [0, 25, 50, 75, 100]) g += `<line x1="${L}" x2="${R}" y1="${y(v)}" y2="${y(v)}" stroke="#EFE9E3"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${v}</text>`;
    for (const q of [4, 8]) g += `<line x1="${x(q)}" x2="${x(q)}" y1="${T}" y2="${B}" stroke="#E8E1DA"/>`;
    for (let q = 0; q <= 12; q++) g += `<line x1="${x(q)}" x2="${x(q)}" y1="${B}" y2="${B + 4}" stroke="#C9C0B8"/>`;
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
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Metrics by quarter. Latest: ${label}.">${g}</svg>
      <div class="legend">${E.METRICS.map((mt) => `<span><i class="${mt.id === 'buyin' ? 'dash' : ''}" style="--c:${MHEX[mt.id]}"></i>${mt.name}</span>`).join('')}</div>`;
  }

  // ---------- screens ----------

  const views = {
    title() {
      const best = store.get();
      const bestAny = Math.max(0, ...Object.values(best));
      return `<div class="wrap">${brandline()}
        <section class="screen stack-lg">
          <div class="hero">
            <div class="stack">
              <span class="label">A game for mining innovation leaders</span>
              <h1>Innovation Rush</h1>
              <p class="lede">You are the new Chief Innovation Officer at a mining company. Unearth new technology, get it running on your sites and keep the board on side.</p>
            </div>
            <div class="side">
              <button class="btn" data-a="start">Start your tenure</button>
              <span class="hint">${bestAny ? `Your best score so far: ${Math.round(bestAny)}%` : 'About 10 minutes. Built on what works in real mining open innovation programs.'}</span>
            </div>
          </div>
          <div class="scene">${A.pit()}
            <div class="m m-nugget">${A.MASCOTS.nugget()}</div>
            <div class="m m-mammoth">${A.MASCOTS.mammoth()}</div>
            <div class="m m-truck">${A.MASCOTS.truck()}</div>
          </div>
          <div class="statrow">
            <div><span class="stat">3</span><span>years to prove your value</span></div>
            <div><span class="stat">${E.INITIATIVES.length}</span><span>initiatives to choose from</span></div>
            <div><span class="stat">${E.EVENTS.length}</span><span>real-world events</span></div>
            <div><span class="stat">4</span><span>metrics the board watches</span></div>
          </div>
        </section></div>`;
    },

    name() {
      return `<div class="wrap">${brandline()}
        <section class="screen stack-lg">
          <h2>First, what should we call you?</h2>
          <form class="field" id="nameform" novalidate>
            <label for="player">Your name</label>
            <input id="player" maxlength="24" autocomplete="nickname" value="${esc(V.name)}" placeholder="e.g. Alex">
            <span class="hint">Only used on your scorecard.</span>
          </form>
          <button class="btn" id="name-next" data-a="name" ${V.name.trim() ? '' : 'disabled'}>Next</button>
        </section></div>`;
    },

    company() {
      const best = store.get();
      return `<div class="wrap">${brandline()}
        <section class="screen stack-lg">
          <div class="stack"><span class="label">Three job offers</span><h2>Which mining company will you join?</h2>
          <p>Your track record has three companies competing for you. Bigger companies have bigger budgets, and bigger problems.</p></div>
          <div class="companies">${E.COMPANIES.map((c) => `
            <button class="company" data-a="company" data-id="${c.id}" aria-pressed="${V.companyId === c.id}">
              <div class="portrait">${A.MASCOTS[c.mascot]()}</div>
              <div class="body">
                <h3>${c.name}</h3>
                <div class="facts"><span class="chip">${c.size}</span><span class="chip orange">$${c.budget}M budget</span><span class="chip ${c.difficulty === 'Brutal' ? 'bad' : c.difficulty === 'Gentle' ? 'good' : ''}">${c.difficulty}</span></div>
                <p>${c.blurb}</p>
                ${best[c.id] ? `<span class="hint">Your best here: ${Math.round(best[c.id])}%</span>` : ''}
              </div>
            </button>`).join('')}
          </div>
          <div class="row" style="justify-content:center"><button class="btn" data-a="accept" ${V.companyId ? '' : 'disabled'}>${V.companyId ? `Join ${coById(V.companyId).name}` : 'Pick a company'}</button></div>
        </section></div>`;
    },

    welcome() {
      const c = co();
      return `<div class="wrap">${brandline()}
        <section class="screen stack-lg">
          <div class="letter">
            <div class="portrait">${mascot(c.id)}</div>
            <div class="copy">
              <span class="label">A message from the board</span>
              <h2>Welcome to ${c.name}, ${esc(S.player)}!</h2>
              ${c.welcome.map((p) => `<p>${p}</p>`).join('')}
            </div>
          </div>
          <div class="stack">
            <h3>How it works</h3>
            <div class="steps">
              <div class="step"><span class="n">01</span><b>Fund initiatives</b><span>At the start of each year, fund up to three. They keep working until you leave.</span></div>
              <div class="step"><span class="n">02</span><b>Make $${c.budget}M last</b><span>One budget covers all three years. Spend it all in Year 1 and Years 2 and 3 run dry.</span></div>
              <div class="step"><span class="n">03</span><b>Respond to events</b><span>Something happens every quarter. Your call moves the metrics.</span></div>
              <div class="step"><span class="n">04</span><b>Average 90 to win</b><span>Below ${E.FIRE_BELOW} at any point and the board asks for your hard hat back.</span></div>
            </div>
          </div>
          <div class="stack">
            <h3>Your four metrics</h3>
            <div class="metric-legend">${E.METRICS.map((m) => `<div style="--c:${MHEX[m.id]}"><b>${m.name}</b><span>${m.desc}</span></div>`).join('')}</div>
            <p>Average <b>90 or more</b> across all four when your three years are up to win. If the average drops below <b>${E.FIRE_BELOW}</b> at any point, the board will ask for your hard hat back.</p>
          </div>
          <div><button class="btn" data-a="plan">Plan Year 1</button></div>
        </section></div>`;
    },

    plan() {
      const y = S.year;
      const mine = E.fundedThisYear(S);
      const full = mine.length >= E.MAX_PER_YEAR;
      const notice = y === 1
        ? `Your $${co().budget}M budget has to last all three years. Initiatives start paying off in the first quarter after you fund them and keep working until your tenure ends, so early bets have longer to pay back.`
        : `Year ${y - 1} is done. You have ${money(S.budget)} left to cover ${y === 3 ? 'your final year' : 'the next two years'}. Initiatives you already funded keep running.`;
      const cards = E.INITIATIVES.map((init) => {
        const f = S.funded.find((x) => x.id === init.id);
        if (f && f.year < y) {
          return `<button class="card locked" disabled><span class="ic">${A.icon(init.icon)}</span><span class="txt"><span class="nm">${init.name}</span><span class="pick">${init.opts[f.opt].t}</span><span class="label">Running since Year ${f.year}</span></span></button>`;
        }
        if (f) {
          return `<button class="card funded" data-a="card" data-id="${init.id}"><span class="ic">${A.icon(init.icon)}</span><span class="txt"><span class="nm">${init.name}</span><span class="pick">${init.opts[f.opt].t}</span><span class="label" style="color:#B84A00">Funded for Year ${y}. Tap to change</span></span></button>`;
        }
        return `<button class="card ${full ? 'dim' : ''}" data-a="card" data-id="${init.id}" ${full ? 'disabled' : ''}><span class="ic">${A.icon(init.icon)}</span><span class="txt"><span class="nm">${init.name}</span>${pips(init)}</span></button>`;
      }).join('');
      const slots = [0, 1, 2].map((i) => `<span class="slot ${i < mine.length ? 'on' : ''}"></span>`).join('');
      return `${hud()}
        <div class="wrap screen stack-lg">
          <div class="plan-head"><div class="stack"><span class="label">Year ${y} of 3 · Planning</span><h2>Choose up to three initiatives for Year ${y}</h2></div></div>
          <div class="notice">${notice}</div>
          <div class="grid">${cards}</div>
        </div>
        <div class="dock"><div class="dock-inner">
          <div class="row"><div class="slots" aria-hidden="true">${slots}</div><span>${mine.length} of 3 picked${full ? '. That is your limit for this year.' : ''}</span></div>
          <button class="btn" data-a="startYear">Start Year ${y}</button>
        </div></div>
        ${V.modal ? modal() : ''}`;
    },

    event() {
      const ev = E.currentEvent(S);
      return `${hud()}
        <div class="wrap screen stack-lg">
          <div class="panel">
            <span class="label">Year ${S.year} · Quarter ${S.quarter} · Something happened</span>
            <h2>${ev.title}</h2>
            <p class="lead">${ev.body}</p>
            <div class="choices" role="group" aria-label="Your response">
              ${V.order.map((i) => `<button class="choice" id="choice-${i}" data-a="choose" data-i="${i}" aria-pressed="${V.pending === i}">${ev.choices[i].t}</button>`).join('')}
            </div>
            <div><button class="btn" data-a="lock" ${V.pending == null ? 'disabled' : ''}>Lock it in</button></div>
          </div>
        </div>`;
    },

    outcome() {
      const o = V.outcome;
      const ev = E.eventById(o.ev);
      const ch = ev.choices[o.choice];
      const running = S.funded.length;
      const next = S.status === 'fired' ? 'Face the board' : S.status === 'done' ? 'See your scorecard' : S.quarter === 0 ? `Plan Year ${S.year}` : 'Next quarter';
      return `${hud()}
        <div class="wrap screen stack-lg">
          <div class="panel">
            <span class="label">Year ${o.year} · Quarter ${o.quarter} · What happened</span>
            <h2>${ev.title}</h2>
            <p><b style="color:var(--ink)">You chose:</b> ${ch.t}</p>
            <p class="quote">${ch.r}</p>
            ${ch.b ? `<p><span class="chip ${ch.b < 0 ? 'bad' : 'good'}">Budget ${ch.b < 0 ? '−' : '+'}${money(ch.b)}</span></p>` : ''}
            <div class="deltas">${E.METRICS.map((m) => `<div class="delta" style="--c:${MHEX[m.id]}"><span class="t">${m.name}</span><span class="v">${Math.round(o.after[m.id])}</span>${sign(o.after[m.id] - o.before[m.id])}</div>`).join('')}</div>
            <p class="hint">${running ? `These changes include the ${running} initiative${running > 1 ? 's' : ''} you have running.` : 'You have no initiatives running, so only your decision moved the metrics this quarter.'}</p>
          </div>
          <div class="stack"><h3>Your metrics so far</h3>${chart(S.history)}</div>
          <div><button class="btn" data-a="next">${next}</button></div>
        </div>`;
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
      const weakest = nodes.slice(-2).reverse();
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
        return `<div class="dec"><span class="what">${init.name}: ${opt.t} <span class="when">Year ${f.year}</span></span>${verdict(E.impact(opt.e), init.opts.map((o) => E.impact(o.e)))}
          <span class="why">${opt.n}${b !== opt ? ` Stronger choice: <b>${b.t}</b>.` : ''}</span></div>`;
      }).join('') || '<p>You did not fund any initiatives. Events alone cannot move a company.</p>';
      const events = S.log.map((l) => {
        const ev = E.eventById(l.event);
        const ch = ev.choices[l.choice];
        const b = bestOf(ev.choices);
        return `<div class="dec"><span class="what">${ev.title}: ${ch.t} <span class="when">Y${l.year} Q${l.quarter}</span></span>${verdict(E.impact(ch.e), ev.choices.map((c) => E.impact(c.e)))}
          <span class="why">${ch.r}${b !== ch ? ` Stronger choice: <b>${b.t}</b>.` : ''}</span></div>`;
      }).join('');
      return `<div class="wrap">${brandline()}
        <section class="screen stack-lg">
          <div class="score-hero">
            <div class="portrait">${mascot(S.companyId, fired || t.id === 'low' ? 'sad' : 'happy')}</div>
            <div class="stack">
              <span class="label">${fired ? `Board meeting · Year ${lastLog.year}, quarter ${lastLog.quarter}` : `${esc(S.player)} · Chief Innovation Officer scorecard`}</span>
              <h2>${fired ? 'Please hand back your hard hat.' : headlines[t.id]}</h2>
              <p>${fired ? 'Your metrics fell below what the board will accept and they have asked you to step aside. Luckily this was only a game. See what went wrong, then try again.' : verdicts[t.id]}</p>
              <div class="stats">
                <div><span class="label">${fired ? 'Average when fired' : 'Final score'}</span><span class="big">${Math.round(score)}%</span></div>
                <div><span class="label">Performance</span><span class="v">${fired ? 'Fired' : t.name}</span></div>
                <div><span class="label">Award</span><span class="v">${fired ? 'The Empty Core Tray' : t.award}</span></div>
                ${best ? `<div><span class="label">Your best at ${co().name}</span><span class="v">${Math.round(best)}%</span></div>` : ''}
              </div>
            </div>
          </div>
          <div class="section"><h3>Your ${fired ? 'tenure' : 'three years'}</h3>${chart(S.history)}</div>
          <div class="section">
            <h3>What drove your score</h3>
            <p>Eight hidden drivers sit behind the four metrics. Every initiative and decision moved some of them.</p>
            <div class="drivers">${nodes.map((n) => `<div class="drv" style="--c:${n.v >= 75 ? 'var(--orange)' : n.v >= 50 ? 'var(--amber)' : 'var(--m-buyin)'}"><span class="nm">${E.NODES[n.k]}</span><span class="num">${Math.round(n.v)}</span><div class="track"><div class="fill" style="width:${n.v}%"></div></div></div>`).join('')}</div>
            <div class="tips">${weakest.map((n) => `<div class="tip"><span class="label">Work on</span><b>${E.NODES[n.k]}</b><p>${E.NODE_TIPS[n.k]}</p></div>`).join('')}</div>
          </div>
          <div class="section"><h3>Your initiatives</h3><div class="decisions">${inits}</div></div>
          <div class="section"><h3>Your calls</h3><div class="decisions">${events}</div></div>
          <div class="cta">
            <img src="${LOGO_WHITE}" alt="Unearthed">
            <h2>Run open innovation on your own sites.</h2>
            <p>Unearthed connects you with a global ecosystem of innovators to solve your hardest operational challenges, then helps turn the best pilots into production.</p>
            <a class="btn outline-white" href="https://unearthed.solutions" target="_blank" rel="noopener">Talk to Unearthed</a>
          </div>
          <div class="row" style="justify-content:center"><button class="btn" data-a="again">Play again</button><button class="btn ghost" data-a="other">Try another company</button></div>
        </section></div>`;
    },
  };

  function modal() {
    const init = E.initById(V.modal);
    const cur = S.funded.find((f) => f.id === init.id && f.year === S.year);
    const avail = S.budget + (cur ? init.opts[cur.opt].c : 0);
    const order = init.opts.map((o, i) => ({ o, i })).sort((a, b) => a.o.c - b.o.c);
    const sel = V.pending;
    const tooDear = sel != null && init.opts[sel].c > avail + 1e-9;
    const ok = sel != null && !tooDear && !(cur && cur.opt === sel);
    return `<div class="overlay" data-a="closeBg"><div class="modal" data-a="noop" role="dialog" aria-modal="true" aria-labelledby="mtitle">
      <div class="modal-head"><span class="ic">${A.icon(init.icon)}</span><h2 id="mtitle">${init.name}</h2><button class="x" id="modal-close" data-a="close" aria-label="Close">×</button></div>
      <p>${init.desc}</p>
      <fieldset class="opts"><legend class="label" style="margin-bottom:8px">Choose your approach</legend>
        ${order.map(({ o, i }) => {
          const afford = o.c <= avail + 1e-9;
          const cost = o.c < 0 ? `+${money(o.c)} back` : o.c === 0 ? 'No cost' : money(o.c);
          return `<label class="opt ${sel === i ? 'sel' : ''} ${afford ? '' : 'no'}" for="opt-${init.id}-${i}"><input type="radio" name="opt" id="opt-${init.id}-${i}" value="${i}" ${sel === i ? 'checked' : ''}><span>${o.t}</span><span class="cost ${o.c < 0 ? 'back' : ''}">${cost}</span></label>`;
        }).join('')}
      </fieldset>
      ${tooDear ? `<p class="warn">Not enough budget for this option. You have ${money(avail)} to spend.</p>` : ''}
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
    start() { V.view = 'name'; return 'scroll'; },
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
    again() { newRun(S.companyId); return 'scroll'; },
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

  // Keep a game in progress across live updates of the page.
  try { window.claude?.hot?.snapshot?.(() => ({ S, V })); } catch { /* not in a viewer */ }
  const boot = (data) => {
    if (data && data.V && data.V.view) { S = data.S; V = data.V; }
    render();
  };
  if (window.claude?.hot?.ready) window.claude.hot.ready(boot);
  else boot(window.claude?.hot?.data ?? {});
})();
