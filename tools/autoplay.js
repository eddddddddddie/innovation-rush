// Test harness: appended to a copy of the built page. Plays the game up to a stop point given in ?stop=...
(() => {
  const stop = new URLSearchParams(location.search).get('stop') || 'end';
  const errors = [];
  // Lead form tests never reach HubSpot: fetch is replaced and the request body is kept for inspection.
  if (stop === 'lead' || stop === 'leadform') {
    ENGINE.UNEARTHED.hubspot.formGuid = 'test-guid';
    window.__sent = null;
    window.fetch = async (url, opts) => { window.__sent = { url, body: JSON.parse(opts.body) }; return { ok: true, json: async () => ({}) }; };
  }
  window.addEventListener('error', (e) => errors.push(e.message));
  const $ = (s) => document.querySelector(s);
  const click = (s) => { const el = typeof s === 'string' ? $(s) : s; if (!el) throw new Error('missing ' + s); el.click(); };
  const pickRadio = (i) => { const r = document.querySelectorAll('.modal input[type=radio]')[i]; r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); };
  const fundCard = (id, nth) => { click(`[data-a=card][data-id=${id}]`); pickRadio(nth); click('[data-a=confirm]'); };
  const plans = { 1: [['problems', 2], ['procurement', 2], ['ip', 2]], 2: [['sponsor', 2], ['stagegate', 2], ['measure', 2]], 3: [['culture', 2], ['scouting', 2], ['champions', 1]] };
  try {
    if (stop === 'title') return done();
    if (stop === 'howto' || stop === 'approach') { click(`[data-a=page][data-p=${stop}]`); return done(); }
    click('[data-a=start]');
    const inp = $('#player'); inp.value = 'Ed'; inp.dispatchEvent(new Event('input', { bubbles: true }));
    click('[data-a=name]');
    click('[data-a=company][data-id=mid]');
    if (stop === 'company') return done();
    click('[data-a=accept]');
    if (stop === 'welcome') return done();
    click('[data-a=plan]');
    // Plays quarter by quarter: plan each year (challenges for both problems, three initiatives), answer events,
    // pick the first submission for each challenge, go through board meetings, until the scorecard.
    let year = 0, events = 0, quarters = 0, guard = 0;
    while (!$('.score-hero') && guard++ < 200) {
      if ($('.problems')) {
        year += 1;
        if (stop === 'modal' && year === 1) { click('[data-a=card][data-id=challenges]'); click('[data-a=useCheck]'); pickRadio(1); return done(); }
        document.querySelectorAll('[data-a=route][data-r=challenge]').forEach((b) => { if (!b.disabled) b.click(); });
        for (const [id, nth] of plans[year]) fundCard(id, nth);
        if (stop === 'ingame-howto' && year === 2) { click('.hudlinks [data-a=page][data-p=howto]'); click('[data-a=back]'); if (!$('.problems')) throw new Error('back did not return to planning'); }
        if (stop === 'plan' + year) return done();
        click('[data-a=startYear]');
      } else if ($('.choice')) {
        events += 1;
        if (events === 1) click('[data-a=useCheck]');
        click('.choice');
        if (stop === 'event') return done();
        click('[data-a=lock]');
      } else if ($('[data-a=pickSub]')) {
        if (stop === 'pick') return done();
        if (!$('.vcheck.done') && $('[data-a=useCheck]')) click('[data-a=useCheck]');
        click('[data-a=pickSub]');
      } else if ($('.boardroom')) {
        if (stop === 'board') return done();
        click('[data-a=plan]');
      } else if ($('[data-a=next]')) {
        quarters += 1;
        if (stop === 'outcome' && quarters === 5) return done();
        click('[data-a=next]');
      } else throw new Error('stuck on view: ' + document.body.innerText.slice(0, 120));
    }
    if (!$('.score-hero')) throw new Error('did not reach the scorecard');
  } catch (e) { errors.push('harness: ' + e.message); }
  if (stop === 'lead') {
    const set = (id, v) => { const el = $('#lf-' + id); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); };
    set('lastname', 'Tester'); set('email', 'test@example.com'); set('company', 'Example Mining');
    const c = $('#lf-consent'); c.checked = true; c.dispatchEvent(new Event('input', { bubbles: true }));
    $('#leadform').requestSubmit();
    return setTimeout(() => { errors.push('SENT:' + JSON.stringify(window.__sent)); errors.push('FORM:' + ($('.leadform') || {}).textContent); done(); }, 300);
  }
  done();
  function done() {
    const pre = document.createElement('pre');
    pre.id = 'test-result';
    pre.textContent = 'ERRORS:' + JSON.stringify(errors) + '\nVIEW_TEXT:' + document.body.innerText.slice(0, 400).replace(/\n+/g, ' | ');
    document.body.appendChild(pre);
    if (stop === 'end' || stop === 'event' || stop === 'company') { /* leave visible */ }
    pre.style.cssText = 'position:fixed;left:0;bottom:0;width:1px;height:1px;overflow:hidden;opacity:0';
  }
})();
