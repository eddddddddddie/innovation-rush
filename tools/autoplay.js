// Test harness: appended to a copy of the built page. Plays the game up to a stop point given in ?stop=...
(() => {
  const stop = new URLSearchParams(location.search).get('stop') || 'end';
  const errors = [];
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
    for (let y = 1; y <= 3; y++) {
      if (stop === 'modal' && y === 1) { click('[data-a=card][data-id=challenges]'); click('[data-a=useCheck]'); pickRadio(1); return done(); }
      for (const [id, nth] of plans[y]) fundCard(id, nth);
      if (stop === 'ingame-howto' && y === 2) { click('.hudlinks [data-a=page][data-p=howto]'); click('[data-a=back]'); if (!$('.grid')) throw new Error('back did not return to planning'); }
      if (stop === 'plan' + y) return done();
      click('[data-a=startYear]');
      for (let q = 1; q <= 4; q++) {
        if (q === 1) click('[data-a=useCheck]');
        click('.choice');
        if (stop === 'event') return done();
        click('[data-a=lock]');
        if (stop === 'outcome' && y === 2) return done();
        click('[data-a=next]');
        if (!document.querySelector('[data-a=lock], [data-a=startYear], .choice') && $('.score-hero')) break;
      }
      if ($('.score-hero')) break;
    }
  } catch (e) { errors.push('harness: ' + e.message); }
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
