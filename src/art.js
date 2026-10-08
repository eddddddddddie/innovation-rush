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

  const nugget = (mood = 'happy') => `<svg viewBox="0 0 120 120" aria-hidden="true">
    <ellipse cx="60" cy="112" rx="32" ry="5" fill="#000" opacity=".08"/>
    <path d="M28 72 C20 52 34 38 52 40 C62 32 84 34 92 48 C104 56 100 80 90 92 C80 106 44 108 34 96 C26 89 30 81 28 72Z" fill="#FFA627"/>
    <path d="M72 46 L86 58 L76 64Z" fill="#FC883F" opacity=".7"/>
    <path d="M36 88 L46 96 L36 96Z" fill="#FC883F" opacity=".6"/>
    <path d="M38 56 C42 50 48 48 54 49" stroke="#fff" stroke-opacity=".7" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="44" cy="80" r="5" fill="#FC883F" opacity=".45"/><circle cx="80" cy="80" r="5" fill="#FC883F" opacity=".45"/>
    ${face(mood, [[51, 70], [73, 70]], 82, 62)}
    ${hat(36, 44, 50)}
  </svg>`;

  const truck = (mood = 'happy') => `<svg viewBox="0 0 160 120" aria-hidden="true">
    <ellipse cx="82" cy="113" rx="66" ry="5" fill="#000" opacity=".08"/>
    <path d="M20 40 Q38 18 56 30 Q72 14 98 40Z" fill="#C9B8A6"/>
    <circle cx="46" cy="32" r="4" fill="#B5A28E"/><circle cx="74" cy="28" r="3" fill="#B5A28E"/>
    <path d="M12 38 L106 38 L98 76 L22 76Z" fill="#FF6600"/>
    <path d="M36 42 L38 72 M60 42 L60 72 M84 42 L82 72" stroke="#FC883F" stroke-width="3"/>
    <rect x="104" y="42" width="42" height="38" rx="7" fill="#FFA627"/>
    <rect x="110" y="48" width="30" height="20" rx="5" fill="#fff"/>
    ${mood === 'sad'
      ? `<path d="M114 58 q4 -3 8 0 M128 58 q4 -3 8 0" stroke="#333" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M118 76 q7 -5 14 0" stroke="#333" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
      : `<circle cx="118" cy="58" r="3.4" fill="#333"/><circle cx="132" cy="58" r="3.4" fill="#333"/><path d="M118 72 q7 6 14 0" stroke="#333" stroke-width="2.6" fill="none" stroke-linecap="round"/>`}
    <rect x="14" y="76" width="134" height="12" rx="4" fill="#656565"/>
    <circle cx="44" cy="94" r="18" fill="#333"/><circle cx="44" cy="94" r="7" fill="#9A9A9A"/>
    <circle cx="124" cy="94" r="18" fill="#333"/><circle cx="124" cy="94" r="7" fill="#9A9A9A"/>
    <rect x="140" y="64" width="9" height="6" rx="2" fill="#fff"/>
  </svg>`;

  const mammoth = (mood = 'happy') => `<svg viewBox="0 0 140 120" aria-hidden="true">
    <ellipse cx="74" cy="113" rx="52" ry="5" fill="#000" opacity=".08"/>
    <rect x="50" y="84" width="13" height="24" rx="5" fill="#7A7A7A"/><rect x="68" y="86" width="13" height="22" rx="5" fill="#858585"/>
    <rect x="96" y="84" width="13" height="24" rx="5" fill="#7A7A7A"/><rect x="110" y="86" width="12" height="22" rx="5" fill="#858585"/>
    <ellipse cx="84" cy="68" rx="44" ry="30" fill="#8C8C8C"/>
    <path d="M60 44 q4 -6 8 0 M74 40 q4 -6 8 0 M88 40 q4 -6 8 0 M102 44 q4 -6 8 0" stroke="#6E6E6E" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M124 64 q10 2 8 14" stroke="#7A7A7A" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="44" cy="60" r="27" fill="#9B9B9B"/>
    <ellipse cx="64" cy="60" rx="11" ry="16" fill="#7D7D7D"/>
    <path d="M28 70 C14 80 16 100 30 102" stroke="#9B9B9B" stroke-width="12" fill="none" stroke-linecap="round"/>
    <path d="M34 76 C30 92 42 100 52 94" stroke="#D8CBB8" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M34 76 C30 92 42 100 52 94" stroke="#F3EBDD" stroke-width="4" fill="none" stroke-linecap="round"/>
    ${mood === 'sad'
      ? `<path d="M31 58 q4 -3 8 0 M46 58 q4 -3 8 0" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M52 62 q3 6 0 9 q-3 -3 0 -9z" fill="#DADADA"/>`
      : `<circle cx="35" cy="58" r="3.6" fill="#333"/><circle cx="50" cy="58" r="3.6" fill="#333"/><circle cx="36.2" cy="56.6" r="1.1" fill="#fff"/><circle cx="51.2" cy="56.6" r="1.1" fill="#fff"/>`}
    ${hat(22, 40, 44)}
  </svg>`;

  const MASCOTS = { nugget, truck, mammoth };

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
    <path d="M0 40 H60 V75 H170 V110 H280 V150 H520 V110 H630 V75 H740 V40 H800 V0 H0Z" fill="#fff"/>
    <path d="M0 40 H60 V75 H170 V110 H280 V150 H520 V110 H630 V75 H740 V40 H800" stroke="#333" stroke-width="2" fill="none"/>
  </svg>`;

  return { MASCOTS, icon, pit };
})();
