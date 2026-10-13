// Mascots and icons as inline SVG strings.

const ART = (() => {
  const face = (mood, eyes, mouthY, cx) => {
    const [l, r] = eyes;
    if (mood === 'sad') {
      return `<path d="M${l[0] - 5} ${l[1] - 1} q5 -4 10 0 M${r[0] - 5} ${r[1] - 1} q5 -4 10 0" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M${cx - 8} ${mouthY + 4} q8 -7 16 0" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M${r[0] + 3} ${r[1] + 6} q3 6 0 9 q-3 -3 0 -9z" fill="#DADADA"/>`;
    }
    return `<ellipse cx="${l[0]}" cy="${l[1]}" rx="3.8" ry="4.8" fill="#333"/><ellipse cx="${r[0]}" cy="${r[1]}" rx="3.8" ry="4.8" fill="#333"/>
      <circle cx="${l[0] + 1.3}" cy="${l[1] - 1.6}" r="1.2" fill="#fff"/><circle cx="${r[0] + 1.3}" cy="${r[1] - 1.6}" r="1.2" fill="#fff"/>
      <path d="M${cx - 9} ${mouthY} q9 8 18 0" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  };

  const hat = (x, y, w) => `<path d="M${x + 4} ${y} C${x + 4} ${y - 22} ${x + w - 4} ${y - 22} ${x + w - 4} ${y}Z" fill="#FF6600"/>
    <rect x="${x - 4}" y="${y - 2}" width="${w + 8}" height="7" rx="3.5" fill="#FF6600"/>
    <rect x="${x + w / 2 - 4}" y="${y - 19}" width="8" height="15" rx="3" fill="#FC883F"/>`;

  // Hi-vis vest: orange panel with reflective stripes.
  const vest = (d, stripes) => `<path d="${d}" fill="#FF6600"/>${stripes.map(([x1, y, x2]) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#F0EDE9" stroke-width="4"/>`).join('')}`;

  // Side-on eye and mouth for the animals.
  const sideFace = (mood, ex, ey, mouth) => (mood === 'sad'
    ? `<path d="M${ex - 4} ${ey} q4 -3 8 0" stroke="#282726" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M${ex + 2} ${ey + 5} q3 6 0 9 q-3 -3 0 -9z" fill="#DADADA"/>${mouth ? `<path d="${mouth.sad}" stroke="#282726" stroke-width="2.4" fill="none" stroke-linecap="round"/>` : ''}`
    : `<circle cx="${ex}" cy="${ey}" r="3.6" fill="#282726"/><circle cx="${ex + 1.2}" cy="${ey - 1.3}" r="1.1" fill="#fff"/>${mouth ? `<path d="${mouth.happy}" stroke="#282726" stroke-width="2.4" fill="none" stroke-linecap="round"/>` : ''}`);

  // Lucky Strike: an echidna, small, spiky and tough.
  const echidna = (mood = 'happy') => {
    let spines = '';
    for (let i = 0; i <= 14; i++) {
      const a = Math.PI + (Math.PI * (i + 0.5)) / 15.5;
      const bx = 70 + 40 * Math.cos(a), by = 84 + 27 * Math.sin(a);
      const tx = 70 + 56 * Math.cos(a), ty = 84 + 42 * Math.sin(a);
      const dx = 4.5 * Math.sin(a), dy = -4.5 * Math.cos(a);
      spines += `<path d="M${(bx - dx).toFixed(1)} ${(by - dy).toFixed(1)} L${tx.toFixed(1)} ${ty.toFixed(1)} L${(bx + dx).toFixed(1)} ${(by + dy).toFixed(1)}Z" fill="${i % 2 ? '#5A4636' : '#6B5442'}"/>`;
      spines += `<circle cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" r="1.6" fill="#E9DDC7"/>`;
    }
    return `<svg viewBox="0 0 130 120" aria-hidden="true">
      <ellipse cx="68" cy="112" rx="46" ry="5" fill="#000" opacity=".08"/>
      ${spines}
      <ellipse cx="46" cy="106" rx="9" ry="4" fill="#4A3A2E"/><ellipse cx="92" cy="106" rx="9" ry="4" fill="#4A3A2E"/>
      <ellipse cx="70" cy="86" rx="42" ry="24" fill="#8A6B52"/>
      ${vest('M52 66 Q70 62 90 66 L98 104 L44 104 Z', [[47, 86, 95], [45, 96, 97]])}
      <path d="M24 90 Q10 94 3 101" stroke="#4A3A2E" stroke-width="6" fill="none" stroke-linecap="round"/>
      <circle cx="34" cy="84" r="15" fill="#9A7A5E"/>
      ${sideFace(mood, 30, 80, { happy: 'M22 92 q5 3 9 0', sad: 'M22 94 q5 -3 9 0' })}
      ${hat(21, 72, 26)}
    </svg>`;
  };

  // Copper Canyon: a wombat, a stocky tunneller.
  const wombat = (mood = 'happy') => `<svg viewBox="0 0 150 120" aria-hidden="true">
    <ellipse cx="80" cy="112" rx="58" ry="5" fill="#000" opacity=".08"/>
    <rect x="46" y="90" width="15" height="20" rx="6" fill="#6E6156"/><rect x="64" y="92" width="14" height="18" rx="6" fill="#7A6C60"/>
    <rect x="104" y="90" width="15" height="20" rx="6" fill="#6E6156"/><rect x="121" y="92" width="14" height="18" rx="6" fill="#7A6C60"/>
    <ellipse cx="88" cy="74" rx="54" ry="34" fill="#8E7F70"/>
    ${vest('M66 44 Q90 38 114 44 L120 104 L60 104 Z', [[62, 70, 117], [61, 84, 119]])}
    <ellipse cx="17" cy="50" rx="7" ry="10" fill="#8E7F70"/><ellipse cx="64" cy="48" rx="7" ry="10" fill="#8E7F70"/>
    <circle cx="40" cy="64" r="27" fill="#A08F7F"/>
    <rect x="17" y="64" width="24" height="16" rx="8" fill="#3E3530"/>
    ${face(mood, [[31, 56], [50, 56]], 86, 30)}
    ${hat(21, 42, 38)}
  </svg>`;

  // Big Rocks: a saltwater croc, ancient, armoured and slow to move.
  const croc = (mood = 'happy') => {
    let scutes = '', teeth = '';
    for (let x = 68; x <= 140; x += 12) scutes += `<circle cx="${x}" cy="${57 + Math.abs(x - 104) * 0.05}" r="4.2" fill="#5C6944"/>`;
    for (let x = 16; x <= 58; x += 7) teeth += `<path d="M${x} 76 l3 4 l3 -4Z" fill="#F7F3E8"/>`;
    return `<svg viewBox="0 0 190 110" aria-hidden="true">
      <ellipse cx="100" cy="104" rx="82" ry="5" fill="#000" opacity=".08"/>
      <path d="M132 66 Q170 58 188 80 Q160 82 132 90 Z" fill="#6F7D52"/>
      <rect x="62" y="82" width="14" height="18" rx="5" fill="#5C6944"/><rect x="118" y="82" width="14" height="18" rx="5" fill="#5C6944"/>
      ${scutes}
      <ellipse cx="98" cy="74" rx="46" ry="20" fill="#6F7D52"/>
      <ellipse cx="98" cy="84" rx="40" ry="8" fill="#B6B286"/>
      ${vest('M80 56 L116 56 L122 92 L76 92 Z', [[78, 70, 119], [77, 81, 121]])}
      <path d="M66 56 Q34 54 8 63 Q3 71 11 75 L66 78 Z" fill="#6F7D52"/>
      <path d="M11 75 Q34 86 66 82 L66 78 Z" fill="#66744A"/>
      ${teeth}
      <path d="M${mood === 'sad' ? '40 80 q8 -5 16 -2' : '40 77 q9 6 18 1'}" stroke="#3E4630" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <circle cx="12" cy="64" r="1.8" fill="#3E4630"/>
      <circle cx="58" cy="56" r="13" fill="#6F7D52"/>
      <circle cx="58" cy="58" r="7" fill="#E9E4C8"/>
      ${sideFace(mood, 58, 58, null)}
      ${hat(44, 44, 28)}
    </svg>`;
  };

  // Player avatars: head and shoulders in a hard hat and hi-vis vest.
  const PEOPLE = [
    { id: 'p1', skin: '#F2CDB0', hair: 'short', hairC: '#5A3B26', hat: '#FFFFFF', shirt: '#4F4C49' },
    { id: 'p2', skin: '#8D5A3B', hair: 'curly', hairC: '#1E1915', hat: '#FF6600', shirt: '#282726', glasses: true },
    { id: 'p3', skin: '#E2B48E', hair: 'long', hairC: '#2B211C', hat: '#FFFFFF', shirt: '#6B5B4E' },
    { id: 'p4', skin: '#5E3B27', hair: 'none', hairC: '#1E1915', hat: '#FF6600', shirt: '#4F4C49', beard: true },
    { id: 'p5', skin: '#F4D2BA', hair: 'long', hairC: '#B5713A', hat: '#FFA627', shirt: '#282726', glasses: true },
    { id: 'p6', skin: '#C08660', scarf: '#6B5B4E', hat: '#FFFFFF', shirt: '#7A6F66' },
  ];

  const person = (id, mood = 'happy') => {
    const p = PEOPLE.find((x) => x.id === id) || PEOPLE[0];
    const ridge = p.hat === '#FFFFFF' ? '#E2DFDB' : '#FC883F';
    const hairBack = p.hair === 'long' ? `<path d="M28 40 Q24 62 28 76 L72 76 Q76 62 72 40 Z" fill="${p.hairC}"/>` : '';
    const hairFront = p.hair === 'short' ? `<path d="M30 40 Q32 26 50 26 Q68 26 70 40 Q60 34 50 34 Q40 34 30 40Z" fill="${p.hairC}"/>`
      : p.hair === 'curly' ? [32, 40, 48, 56, 64, 68, 32].map((x, i) => `<circle cx="${x}" cy="${i > 4 ? 42 : 33}" r="6" fill="${p.hairC}"/>`).join('')
      : p.hair === 'long' ? `<path d="M30 42 Q34 27 50 28 Q66 27 70 42 Q58 34 44 36 Q36 38 30 42Z" fill="${p.hairC}"/>` : '';
    const scarf = p.scarf ? `<path d="M27 40 Q27 18 50 18 Q73 18 73 40 L74 70 Q66 84 50 85 Q34 84 26 70 Z" fill="${p.scarf}"/>` : '';
    const wrap = '';
    const beard = p.beard ? `<path d="M31 50 Q33 72 50 72 Q67 72 69 50 Q66 62 50 63 Q34 62 31 50Z" fill="${p.hairC}"/>` : '';
    const glasses = p.glasses ? '<circle cx="42" cy="48" r="5.5" fill="none" stroke="#282726" stroke-width="1.8"/><circle cx="58" cy="48" r="5.5" fill="none" stroke="#282726" stroke-width="1.8"/><path d="M47.5 48 h5" stroke="#282726" stroke-width="1.8"/>' : '';
    const mouth = mood === 'sad' ? '<path d="M43 62 q7 -5 14 0" stroke="#5A3A2A" stroke-width="2.4" fill="none" stroke-linecap="round"/>' : '<path d="M43 58 q7 6 14 0" stroke="#5A3A2A" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    return `<svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M12 100 Q14 76 50 73 Q86 76 88 100Z" fill="${p.shirt}"/>
      <path d="M22 100 Q24 82 38 77 L45 100Z" fill="#FF6600"/><path d="M78 100 Q76 82 62 77 L55 100Z" fill="#FF6600"/>
      <path d="M24 92 L44 92 M56 92 L76 92" stroke="#F0EDE9" stroke-width="3.5"/>
      ${hairBack}${scarf}
      ${p.scarf ? '' : `<rect x="43" y="62" width="14" height="14" rx="4" fill="${p.skin}"/><circle cx="30" cy="49" r="4" fill="${p.skin}"/><circle cx="70" cy="49" r="4" fill="${p.skin}"/>`}
      <ellipse cx="50" cy="${p.scarf ? 49 : 48}" rx="${p.scarf ? 16.5 : 19}" ry="${p.scarf ? 19.5 : 22}" fill="${p.skin}"/>
      ${hairFront}${beard}${wrap}
      <circle cx="42" cy="48" r="2.4" fill="#282726"/><circle cx="58" cy="48" r="2.4" fill="#282726"/>${glasses}${mouth}
      ${mood === 'sad' ? '<path d="M60 53 q3 6 0 9 q-3 -3 0 -9z" fill="#BFD7EA" opacity=".9"/>' : ''}
      <path d="M28 34 C28 10 72 10 72 34Z" fill="${p.hat}"/>
      <rect x="23" y="31" width="54" height="7" rx="3.5" fill="${p.hat}" stroke="${p.hat === '#FFFFFF' ? '#DEDAD5' : 'none'}"/>
      <rect x="46" y="12" width="8" height="19" rx="3" fill="${ridge}"/>
    </svg>`;
  };

  const MASCOTS = { echidna, wombat, croc };

  const P = {
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
    globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
    code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    flag: '<path d="M5 21V4h12l-2 4 2 4H5"/>',
    contract: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    key: '<circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3M21 12v2"/>',
    helmet: '<path d="M4 16a8 8 0 0 1 16 0M2 16h20v2.5H2zM10 8.5V5h4v3.5"/>',
    coins: '<ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v4c0 1.7 2.7 3 6 3"/><ellipse cx="15" cy="14" rx="6" ry="3"/><path d="M9 14v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4"/>',
    search: '<circle cx="10" cy="10" r="6"/><path d="M15 15l6 6"/>',
    gate: '<path d="M4 20V5M20 20V5M4 9h16M4 14h16M9 9v5M15 9v5"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
    people: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20a6 6 0 0 1 12 0M14.5 20a4.5 4.5 0 0 1 6.5-4"/>',
    stairs: '<path d="M3 20h5v-5h5v-5h5V5h3"/>',
    gauge: '<path d="M4 17a8 8 0 1 1 16 0"/><path d="M12 17l4-6"/>',
    book: '<path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2 2 2 0 0 0 2 2h13"/>',
    signal: '<path d="M5 20v-3M10 20v-7M15 20V9M20 20V4"/>',
    home: '<path d="M3 11l9-7 9 7M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
    star: '<path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.3L12 17.5 6.5 20.4l1-6.3L3 9.7l6.2-.9z"/>',
  };

  const icon = (name) => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;

  // Open-pit cross-section: benches stepping down, strata in brand oranges.
  const pit = () => `<svg class="pit" viewBox="0 0 800 220" aria-hidden="true">
    <path d="M0 40 H800 V220 H0Z" fill="#F8CA8A"/>
    <path d="M0 95 C200 85 600 105 800 92 V220 H0Z" fill="#FC883F"/>
    <path d="M0 158 C220 148 560 168 800 154 V220 H0Z" fill="#FF6600"/>
    <path d="M0 40 H60 V75 H170 V110 H280 V150 H520 V110 H630 V75 H740 V40 H800 V0 H0Z" fill="#F0EDE9"/>
    <path d="M0 40 H60 V75 H170 V110 H280 V150 H520 V110 H630 V75 H740 V40 H800" stroke="#333" stroke-width="2" fill="none"/>
  </svg>`;

  // The Unearthed 'U' mark, used as a small badge wherever the game shows something Unearthed does.
  const umark = () => `<svg class="umark" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 2 L8 4.2 V14 L3 17Z" fill="#F8CA8A"/><path d="M21 2 L16 4.2 V14 L21 17Z" fill="#FF6600"/>
    <path d="M3 17 L8 14 L12 16.4 V22Z" fill="#FFA627"/><path d="M21 17 L16 14 L12 16.4 V22Z" fill="#FC883F"/></svg>`;

  return { MASCOTS, PEOPLE, person, icon, pit, umark };
})();
